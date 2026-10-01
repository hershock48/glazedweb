import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import os from 'node:os';
import {randomUUID} from 'node:crypto';
import {PGlite} from '@electric-sql/pglite';
import * as core from '../kitchen-operations/1.0.0/kitchen-operations.ts';
import * as client from '../kitchen-request/1.0.0/kitchen-request.ts';
const now=1800000000000;
const board=(raw=null,change={busyMinutes:15},operationId=randomUUID())=>({operationId,kind:'state',revision:core.revisionOf(raw),change});
const move=(o,status,patch={})=>({operationId:randomUUID(),kind:'order',orderId:o.id,revision:core.revisionOf(o),status,...patch});
const order=()=>({id:randomUUID(),number:1,createdAt:now,status:'new',acceptedAt:null,paid:true,totalCents:1200,guestPhone:'2025550123'});
const prepare=(command,raw,actor='owner')=>core.prepare(command,raw,actor,core.revisionOf(command),now);
const schema=`CREATE TABLE ordering_state(id int PRIMARY KEY,data jsonb NOT NULL);CREATE TABLE ordering_orders(id text PRIMARY KEY,status text NOT NULL,created_at bigint NOT NULL,data jsonb NOT NULL);CREATE TABLE ordering_print_jobs(id text PRIMARY KEY,order_id text NOT NULL,status text NOT NULL);`+core.OPERATION_SCHEMA;
const commit=(db,p)=>core.commitOperation((s,v)=>db.query(s,v),p.receipt,p.candidate);

test('explicit controls and state transitions retain money and require owner cancellation',()=>{
 for(const change of [{toggle86:'x'},{busyMinutes:'15'},{pauseMinutes:31},{itemId:'x',unavailable:1}])assert.equal(core.parseCommand(board(null,change),'state'),null);
 const o=order();assert.equal(prepare(move(o,'done'),o).receipt.httpStatus,409);
 assert.equal(prepare(move(o,'cancelled',{reason:'Guest request'}),o,'staff').receipt.httpStatus,403);
 const cancelled=prepare(move(o,'cancelled',{reason:'Guest request'}),o).candidate.after;
 assert.equal(cancelled.paid,true);assert.equal(cancelled.totalCents,1200);assert.equal(cancelled.status,'cancelled');
 assert.equal(prepare(move(cancelled,'accepted'),cancelled,'printer').receipt.httpStatus,409);
});

test('concurrent SQL saves record one duplicate result and refuse stale overwrites, with before/after history',async()=>{
 const db=new PGlite();try{
  await db.exec(schema);const action=prepare(board(),null);
  const result=await Promise.all([commit(db,action),commit(db,action)]);assert.deepEqual(result[0],result[1]);assert.equal(result[0].httpStatus,200);
  const stale=prepare(board(null,{busyMinutes:0}),null);assert.equal((await commit(db,stale)).httpStatus,409);
  const saved=(await db.query('SELECT data FROM ordering_state')).rows[0].data;
  assert.equal(saved.busyMinutes,15);assert.deepEqual(result[0].after,saved);
  const rows=(await db.query('SELECT data FROM ordering_operations')).rows;assert.equal(rows.length,2);assert.equal(rows.filter(r=>r.data.response.outcome==='applied').length,1);
 }finally{await db.close();}
});

test('a receipt failure rolls back cancellation and queued-print suppression together',async()=>{
 const db=new PGlite();try{
  await db.exec(schema);const o=order();await db.query('INSERT INTO ordering_orders VALUES($1,$2,$3,$4)',[o.id,o.status,o.createdAt,JSON.stringify(o)]);await db.query("INSERT INTO ordering_print_jobs VALUES('fixture',$1,'queued')",[o.id]);
  await db.exec("CREATE FUNCTION no_receipt() RETURNS trigger LANGUAGE plpgsql AS $$ BEGIN RAISE EXCEPTION 'fixture failure'; END; $$;CREATE TRIGGER no_receipt BEFORE INSERT ON ordering_operations FOR EACH ROW EXECUTE FUNCTION no_receipt();");
  const action=prepare(move(o,'cancelled',{reason:'Guest request'}),o);await assert.rejects(commit(db,action));
  assert.equal((await db.query('SELECT status FROM ordering_orders')).rows[0].status,'new');assert.equal((await db.query('SELECT status FROM ordering_print_jobs')).rows[0].status,'queued');
  await db.exec('DROP TRIGGER no_receipt ON ordering_operations');await commit(db,action);
  assert.equal((await db.query('SELECT status FROM ordering_print_jobs')).rows[0].status,'failed');assert.equal((await db.query('SELECT data FROM ordering_orders')).rows[0].data.paid,true);
 }finally{await db.close();}
});

test('same-reference requests against different rows cannot commit a losing mutation',async()=>{
 const db=new PGlite();try{
  await db.exec(schema);const o=order(),id=randomUUID();await db.query('INSERT INTO ordering_orders VALUES($1,$2,$3,$4)',[o.id,o.status,o.createdAt,JSON.stringify(o)]);
  const results=await Promise.all([commit(db,prepare(board(null,{busyMinutes:15},id),null)),commit(db,prepare(move(o,'accepted',{operationId:id}),o))]);
  assert.equal(results.filter(r=>r.httpStatus===200).length,1);const recorded=(await db.query('SELECT data FROM ordering_operations')).rows[0].data;
  if(recorded.kind==='state')assert.equal((await db.query('SELECT status FROM ordering_orders')).rows[0].status,'new');
  else assert.equal((await db.query('SELECT data FROM ordering_state')).rows.length,0);
 }finally{await db.close();}
});

test('durable receipts survive database restart and later edits without replaying the original action',async()=>{
 const dir=await fs.mkdtemp(path.join(os.tmpdir(),'glazed-kitchen-restart-'));let db=new PGlite(dir);
 try{
  await db.exec(schema);const first=prepare(board(),null);await commit(db,first);const before=(await db.query('SELECT data FROM ordering_state')).rows[0].data;
  await commit(db,prepare(board(before,{busyMinutes:30}),before));await db.close();db=new PGlite(dir);
  assert.deepEqual(await commit(db,first),first.receipt);assert.equal((await db.query('SELECT data FROM ordering_state')).rows[0].data.busyMinutes,30);
 }finally{await db.close();assert.equal(path.dirname(path.resolve(dir)),path.resolve(os.tmpdir()));assert(path.basename(dir).startsWith('glazed-kitchen-restart-'));await fs.rm(dir,{recursive:true,force:true});}
});

test('client recovery keeps malformed replies unresolved and retries one immutable body',async()=>{
 const command=board(),action=prepare(command,null),draft={id:command.operationId,kind:'state',body:JSON.stringify(command)},calls=[];
 assert.equal(client.readKitchenResult({ok:true},draft).outcome,'unknown');assert.equal(client.readKitchenResult({...action.receipt.response,operationId:randomUUID()},draft).outcome,'unknown');
 const lost=async(url,options)=>{calls.push({url,options});throw Error('Lost acknowledgement');};assert.equal((await client.requestKitchen(draft,'submit',lost)).outcome,'unknown');assert.equal(calls.length,1);
 const ok=async(url,options)=>{calls.push({url,options});return Response.json(action.receipt.response);};assert.equal((await client.requestKitchen(draft,'submit',ok)).outcome,'applied');assert.equal(calls[0].options.body,calls[1].options.body);
});
