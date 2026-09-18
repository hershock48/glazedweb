import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';import path from 'node:path';import os from 'node:os';import crypto from 'node:crypto';import {PGlite} from '@electric-sql/pglite';import * as core from '../printer-jobs/1.0.0/printer-jobs.ts';import * as client from '../printer-review/1.0.0/printer-review.ts';
const now=1800000000000,id=()=>crypto.randomUUID(),clean=x=>JSON.parse(JSON.stringify(x));
const ddl=`CREATE TABLE ordering_orders(id text PRIMARY KEY,status text NOT NULL,created_at bigint NOT NULL,data jsonb NOT NULL);CREATE TABLE ordering_print_jobs(id text PRIMARY KEY,printer_id text NOT NULL,order_id text NOT NULL,body text NOT NULL,status text NOT NULL,created_at bigint NOT NULL);CREATE TABLE ordering_printers(id text PRIMARY KEY,last_seen bigint NOT NULL);`;
const ready=(jobToken=null,statusCode='200 OK',printingInProgress=false)=>({jobToken,statusCode,printingInProgress});
async function fixture(dir){const db=new PGlite(dir);await db.exec(ddl+core.PRINT_SCHEMA);const q=(s,p)=>db.query(s,p);return {db,q,tx:fn=>db.transaction(t=>fn((s,p)=>t.query(s,p)))};}
async function seed(f,printer='kitchen',at=now,patch={}){const o={id:id(),number:42,status:'new',paid:true,totalCents:1199,createdAt:at,...patch},j=id();await f.q('INSERT INTO ordering_orders VALUES($1,$2,$3,$4)',[o.id,o.status,at,JSON.stringify(o)]);await f.q("INSERT INTO ordering_print_jobs(id,printer_id,order_id,body,status,created_at) VALUES($1,$2,$3,$4,'queued',$5)",[j,printer,o.id,'FIXTURE TICKET '+j,at]);return {o,j};}
async function raw(f,j){return (await f.q('SELECT * FROM ordering_print_jobs WHERE id=$1',[j])).rows[0];}
async function order(f,o){return (await f.q('SELECT data FROM ordering_orders WHERE id=$1',[o.id])).rows[0].data;}
async function command(f,j,mode='skip'){const issue=(await core.printStatus(f.q)).issues.find(x=>x.id===j);return {operationId:id(),printerId:issue.printerId,jobId:j,revision:issue.revision,mode,reason:'Physically checked at the fixture printer'};}
test('status parser accepts encoded and optional-null protocol fields without inferring success from missing codes',()=>{
 assert.deepEqual(clean(core.parsePrinterPoll({statusCode:'200%20OK',printingInProgress:null,jobToken:null})),ready());assert.equal(core.parsePrinterPoll({statusCode:'220 Busy'}).printingInProgress,true);
 assert.equal(core.printerCode('OK'),'200 OK');for(const v of [null,'','%','200\nOK','garbage'])assert.equal(core.printerCode(v),null);
 for(const body of [null,[],{}, {statusCode:'200',jobToken:'bad'},{statusCode:'200',printingInProgress:1}])assert.equal(core.parsePrinterPoll(body),null);
});
test('job token binds fetch and duplicate/delayed acknowledgements to one ticket',async()=>{
 const f=await fixture();try{const a=await seed(f),b=await seed(f,'kitchen',now+1);
  assert.equal((await core.pollPrintJob(f.tx,'kitchen',ready(),now)).id,a.j);
  assert.equal((await core.confirmPrintJob(f.tx,'kitchen',a.j,'kitchen','200 OK',now)).status,409);
  const served=await core.fetchPrintJob(f.tx,'kitchen',a.j,now+2);assert.equal(served.status,200);
  assert.equal((await core.fetchPrintJob(f.tx,'kitchen',a.j,now+3)).job.body,served.job.body);
  assert.equal((await core.fetchPrintJob(f.tx,'front',a.j,now)).status,404);assert.equal((await core.fetchPrintJob(f.tx,'kitchen',b.j,now)).status,409);
  assert.equal((await core.confirmPrintJob(f.tx,'kitchen',a.j,'kitchen','',now)).status,400);
  assert.equal((await core.confirmPrintJob(f.tx,'kitchen',a.j,'kitchen','200 OK',now+4)).status,200);
  assert.equal((await core.confirmPrintJob(f.tx,'kitchen',a.j,'kitchen','200%20OK',now+5)).duplicate,true);
  assert.equal((await core.fetchPrintJob(f.tx,'kitchen',a.j,now)).status,410);
  assert.equal((await order(f,a.o)).status,'accepted');assert.equal((await order(f,a.o)).paid,true);assert.equal((await order(f,a.o)).totalCents,1199);assert.equal((await raw(f,b.j)).status,'queued');assert.equal((await order(f,b.o)).status,'new');
  assert.equal((await core.pollPrintJob(f.tx,'kitchen',ready(a.j),now+6)).id,b.j);
  assert.equal((await core.confirmPrintJob(f.tx,'kitchen',a.j,'kitchen','500 Error',now)).status,409);
 }finally{await f.db.close();}
});
test('unfetched expiry is device-scoped, fetched uncertainty holds the queue across TTL, busy and printer failures',async()=>{
 const f=await fixture();try{const a=await seed(f),b=await seed(f,'front');await core.fetchPrintJob(f.tx,'kitchen',a.j,now);await seed(f,'kitchen',now+core.PRINT_TTL_MS);
  for(const poll of [ready(),ready(id()),ready(a.j,'500 Paper error'),ready(a.j,'220 Busy',true)])assert.equal(await core.pollPrintJob(f.tx,'kitchen',poll,now+core.PRINT_TTL_MS+1),null);
  assert.equal((await raw(f,a.j)).status,'fetched');assert.equal((await raw(f,b.j)).status,'queued');assert.equal((await core.fetchPrintJob(f.tx,'kitchen',a.j,now+core.PRINT_TTL_MS+1)).status,200);
  await core.pollPrintJob(f.tx,'front',ready(),now+core.PRINT_TTL_MS+1);assert.equal((await raw(f,b.j)).status,'expired');assert.equal((await core.printStatus(f.q)).issueCount,2);
 }finally{await f.db.close();}
});
test('front success never accepts an order; unsupported media failure can arrive before fetch',async()=>{
 const f=await fixture();try{const a=await seed(f,'front'),b=await seed(f,'kitchen');await core.fetchPrintJob(f.tx,'front',a.j,now);await core.confirmPrintJob(f.tx,'front',a.j,'front','200 OK',now);
 assert.equal((await order(f,a.o)).status,'new');assert.equal((await core.confirmPrintJob(f.tx,'kitchen',b.j,'kitchen','1000 Unsupported media',now)).status,200);assert.equal((await raw(f,b.j)).status,'failed');assert.equal((await order(f,b.o)).status,'new');
 }finally{await f.db.close();}
});
test('cancellation before fetch refuses paper and late success after cancellation cannot reopen or change money',async()=>{
 const f=await fixture();try{const a=await seed(f,'kitchen',now,{status:'cancelled'});assert.equal((await core.fetchPrintJob(f.tx,'kitchen',a.j,now)).status,410);
 await f.q("UPDATE ordering_print_jobs SET status='failed' WHERE id=$1",[a.j]);const b=await seed(f);await core.fetchPrintJob(f.tx,'kitchen',b.j,now);const cancelled={...b.o,status:'cancelled'};await f.q("UPDATE ordering_orders SET status='cancelled',data=$2 WHERE id=$1",[b.o.id,JSON.stringify(cancelled)]);
 assert.equal((await core.confirmPrintJob(f.tx,'kitchen',b.j,'kitchen','200 OK',now)).status,200);assert.deepEqual(await order(f,b.o),cancelled);
 }finally{await f.db.close();}
});
test('fetch, acknowledgement, owner review and replacement intent roll back if audit cannot be committed',async()=>{
 const f=await fixture();try{const a=await seed(f);
 const fail=()=>f.db.exec("CREATE OR REPLACE FUNCTION fail_print() RETURNS trigger LANGUAGE plpgsql AS $$ BEGIN RAISE EXCEPTION 'audit unavailable'; END; $$;CREATE TRIGGER fail_print BEFORE INSERT ON ordering_print_history FOR EACH ROW EXECUTE FUNCTION fail_print();"),unfail=()=>f.db.exec('DROP TRIGGER fail_print ON ordering_print_history;');
 await fail();await assert.rejects(core.fetchPrintJob(f.tx,'kitchen',a.j,now));assert.equal((await raw(f,a.j)).status,'queued');await unfail();await core.fetchPrintJob(f.tx,'kitchen',a.j,now);
 await fail();await assert.rejects(core.confirmPrintJob(f.tx,'kitchen',a.j,'kitchen','200',now));assert.equal((await raw(f,a.j)).status,'fetched');assert.equal((await order(f,a.o)).status,'new');const cmd=await command(f,a.j,'reprint');await assert.rejects(core.resolvePrintJob(f.tx,cmd,'kitchen',now));assert.equal(await core.getPrintAction(f.q,cmd.operationId),null);assert.equal((await f.q('SELECT count(*)::int AS n FROM ordering_print_jobs')).rows[0].n,1);await unfail();assert.equal((await core.resolvePrintJob(f.tx,cmd,'kitchen',now)).outcome,'saved');
 }finally{await f.db.close();}
});
test('owner replacement is repeatable, fences old acknowledgements, preserves orders and records rejected stale reviews',async()=>{
 const f=await fixture();try{const a=await seed(f);await core.fetchPrintJob(f.tx,'kitchen',a.j,now);const cmd=await command(f,a.j,'reprint'),stale=await command(f,a.j,'confirm_printed');
 const first=await core.resolvePrintJob(f.tx,cmd,'kitchen',now+1),second=await core.resolvePrintJob(f.tx,cmd,'kitchen',now+2);assert.deepEqual(clean(first),clean(second));assert.equal((await f.q('SELECT count(*)::int AS n FROM ordering_print_jobs')).rows[0].n,2);
 assert.equal((await raw(f,first.replacementId)).body.startsWith('*** REPLACEMENT:'),true);assert.equal((await order(f,a.o)).status,'new');assert.equal((await core.confirmPrintJob(f.tx,'kitchen',a.j,'kitchen','200',now)).status,410);assert.equal((await core.pollPrintJob(f.tx,'kitchen',ready(a.j),now+3)).id,first.replacementId);
 assert.equal((await core.resolvePrintJob(f.tx,stale,'kitchen',now)).outcome,'rejected');assert.equal((await core.resolvePrintJob(f.tx,{...cmd,reason:'different'},'kitchen',now)).httpStatus,409);assert.deepEqual(clean(await core.getPrintAction(f.q,cmd.operationId)),clean(first));
 }finally{await f.db.close();}
});
test('physical owner check accepts only open kitchen orders; skip does not accept and closed orders cannot be reprinted',async()=>{
 const f=await fixture();try{const a=await seed(f);await core.fetchPrintJob(f.tx,'kitchen',a.j,now);await core.resolvePrintJob(f.tx,await command(f,a.j,'confirm_printed'),'kitchen',now);assert.equal((await order(f,a.o)).status,'accepted');
 const b=await seed(f);await core.fetchPrintJob(f.tx,'kitchen',b.j,now);await core.resolvePrintJob(f.tx,await command(f,b.j),'kitchen',now);assert.equal((await order(f,b.o)).status,'new');assert.equal((await raw(f,b.j)).status,'dismissed');
 const c=await seed(f,'kitchen',now,{status:'done'});await f.q("UPDATE ordering_print_jobs SET status='failed' WHERE id=$1",[c.j]);assert.equal((await core.resolvePrintJob(f.tx,await command(f,c.j,'reprint'),'kitchen',now)).httpStatus,409);
 }finally{await f.db.close();}
});
test('fetched jobs plus review receipts survive database restart',async()=>{
 const dir=fs.mkdtempSync(path.join(os.tmpdir(),'printer-jobs-'));let f=await fixture(dir);try{const a=await seed(f);await f.db.exec(core.PRINT_SCHEMA);await core.fetchPrintJob(f.tx,'kitchen',a.j,now);await f.db.close();let db=new PGlite(dir);f={db,q:(s,p)=>db.query(s,p),tx:fn=>db.transaction(t=>fn((s,p)=>t.query(s,p)))};
 assert.equal(await core.pollPrintJob(f.tx,'kitchen',ready(),now+1),null);const cmd=await command(f,a.j,'reprint'),result=await core.resolvePrintJob(f.tx,cmd,'kitchen',now+2);await f.db.close();db=new PGlite(dir);f={db,q:(s,p)=>db.query(s,p),tx:fn=>db.transaction(t=>fn((s,p)=>t.query(s,p)))};assert.deepEqual(clean(await core.resolvePrintJob(f.tx,cmd,'kitchen',now+3)),clean(result));
 }finally{await f.db.close();fs.rmSync(dir,{recursive:true,force:true});}
});
test('schema upgrade preserves a legacy queued ticket and is repeatable',async()=>{
 const db=new PGlite();try{await db.exec(ddl);const j=id();await db.query("INSERT INTO ordering_print_jobs VALUES($1,'kitchen','legacy-order','legacy paper','queued',$2)",[j,now]);await db.exec(core.PRINT_SCHEMA);await db.exec(core.PRINT_SCHEMA);const row=(await db.query('SELECT * FROM ordering_print_jobs WHERE id=$1',[j])).rows[0];assert.equal(row.body,'legacy paper');assert.equal(row.status,'queued');assert.equal(row.fetched_at,null);assert.equal(row.result_code,null);}finally{await db.close();}
});
test('review client rejects uncorrelated results and retries the exact same command after a lost response',async()=>{
 const cmd={operationId:id(),printerId:'kitchen',jobId:id(),revision:'a'.repeat(64),mode:'reprint',reason:'Checked'},result={operationId:cmd.operationId,command:cmd,outcome:'saved',httpStatus:200,message:'Queued',createdAt:now,replacementId:id()},calls=[];
 assert.equal(client.readPrintAction({...result,replacementId:undefined},cmd),null);assert.equal(client.readPrintAction({...result,operationId:id()},cmd),null);assert.equal(client.readPrintAction({...result,command:{...cmd,reason:'changed'}},cmd),null);
 const fake=async(url,options)=>{calls.push([url,options.body]);if(calls.length===1)throw Error('Response lost');return Response.json(result);};assert.equal(await client.requestPrintReview(cmd,false,fake),null);assert.deepEqual(clean(await client.requestPrintReview(cmd,false,fake)),result);assert.equal(calls[0][1],calls[1][1]);assert.deepEqual(clean(await client.requestPrintReview(cmd,true,fake)),result);assert.match(calls[2][0],new RegExp(cmd.operationId));
 assert.equal(core.parsePrintCommand({...cmd,reason:'\n'}),null);assert.equal(core.parsePrintCommand({...cmd,unexpected:true}),null);
});
