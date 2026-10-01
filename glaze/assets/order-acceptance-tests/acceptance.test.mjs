import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import fsp from 'node:fs/promises';
import path from 'node:path';
import os from 'node:os';
import crypto from 'node:crypto';
import vm from 'node:vm';
import ts from 'typescript';
import {PGlite} from '@electric-sql/pglite';
import * as core from '../order-acceptance/1.0.0/order-acceptance.ts';
import * as quotes from '../order-quote/1.0.0/order-quote.ts';
const clone=x=>JSON.parse(JSON.stringify(x));
const line=()=>({itemId:'burger',qty:1,options:[],quotedUnitCents:1000,quotedAgeRestricted:false});
const request=body=>new Request('https://fixture.invalid',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(body)});
const schema=`CREATE TABLE ordering_orders(id text PRIMARY KEY,status text NOT NULL,created_at bigint NOT NULL,data jsonb NOT NULL);CREATE TABLE ordering_print_jobs(id text PRIMARY KEY,printer_id text NOT NULL,order_id text NOT NULL,body text NOT NULL CHECK(body <> 'fail'),status text NOT NULL,created_at bigint NOT NULL);`+core.ATTEMPT_SCHEMA;
function settlement(email='fixture@example.invalid'){
 const id=crypto.randomUUID(),createdAt=1800000000000,order={id,number:1,status:'new',createdAt,guestEmail:email,lines:[line()]};
 return {attempt:{id,fingerprint:'a'.repeat(64),createdAt,outcome:'accepted',status:200,response:{attemptId:id,outcome:'accepted'}},order,jobs:[{id:crypto.randomUUID(),orderId:id,printerId:'kitchen',body:'Ticket 1',status:'queued',createdAt}]};
}
test('PostgreSQL order, attempt, print and email intent commit together; either fanout failure rolls everything back',async()=>{
 const db=new PGlite();await db.waitReady;await db.exec(schema);const query=(sql,p)=>db.query(sql,p);
 try{
  const x=settlement();await assert.rejects(core.settlePostgres(query,x.attempt,x.order,[{...x.jobs[0],body:'fail'}]));
  for(const table of ['ordering_attempts','ordering_orders','ordering_print_jobs','ordering_confirmations'])assert.equal((await db.query('SELECT COUNT(*) AS n FROM '+table)).rows[0].n,0);
  await db.exec("ALTER TABLE ordering_confirmations ADD CONSTRAINT mail_failure CHECK (data->>'guestEmail' <> 'fail')");
  const badMail=settlement('fail');await assert.rejects(core.settlePostgres(query,badMail.attempt,badMail.order,badMail.jobs));
  for(const table of ['ordering_attempts','ordering_orders','ordering_print_jobs','ordering_confirmations'])assert.equal((await db.query('SELECT COUNT(*) AS n FROM '+table)).rows[0].n,0);
  const outcomes=await Promise.all([core.settlePostgres(query,x.attempt,x.order,x.jobs),core.settlePostgres(query,x.attempt,x.order,x.jobs)]);assert.deepEqual(outcomes.map(o=>o.created).sort(),[false,true]);
  for(const table of ['ordering_attempts','ordering_orders','ordering_print_jobs','ordering_confirmations'])assert.equal((await db.query('SELECT COUNT(*) AS n FROM '+table)).rows[0].n,1);
  const blocked={id:x.order.id,fingerprint:null,createdAt:x.order.createdAt,outcome:'cancelled',status:409,response:{attemptId:x.order.id,outcome:'cancelled'}};
  assert.equal((await core.settlePostgres(query,blocked)).attempt.outcome,'accepted');
 }finally{await db.close();}
});
test('committed keys, receipts and queued intents survive a local database close/reopen',async()=>{
 const dir=await fsp.mkdtemp(path.join(os.tmpdir(),'glazed-order-restart-'));let db=new PGlite(dir);const x=settlement();
 try{await db.waitReady;await db.exec(schema);await core.settlePostgres((s,p)=>db.query(s,p),x.attempt,x.order,x.jobs);await db.close();db=new PGlite(dir);await db.waitReady;
  const fresh=core;const recovered=await fresh.settlePostgres((s,p)=>db.query(s,p),x.attempt,x.order,x.jobs);assert.equal(recovered.created,false);assert.deepEqual(clone(recovered.attempt),x.attempt);
  assert.equal((await db.query('SELECT status FROM ordering_confirmations')).rows[0].status,'queued');assert.equal((await db.query('SELECT COUNT(*) AS n FROM ordering_print_jobs')).rows[0].n,1);
 }finally{await db.close();assert.equal(path.dirname(path.resolve(dir)),path.resolve(os.tmpdir()));assert(path.basename(dir).startsWith('glazed-order-restart-'));await fsp.rm(dir,{recursive:true,force:true});}
});

test('a stopped memory submission cannot later create an order; existing receipts remain stable',()=>{
 const bag={attempts:new Map(),orders:new Map(),printJobs:[],confirmations:new Map()},x=settlement();
 const stopped={id:x.attempt.id,fingerprint:null,createdAt:x.attempt.createdAt,outcome:'cancelled',status:409,response:{attemptId:x.attempt.id,outcome:'cancelled'}};
 assert.equal(core.settleMemory(bag,stopped).created,true);assert.equal(core.settleMemory(bag,x.attempt,x.order,x.jobs).attempt.outcome,'cancelled');assert.equal(bag.orders.size,0);
 const next=settlement();assert.equal(core.settleMemory(bag,next.attempt,next.order,next.jobs).created,true);assert.equal(core.settleMemory(bag,next.attempt,next.order,next.jobs).created,false);assert.equal(bag.printJobs.length,1);assert.equal(bag.confirmations.size,1);
});
test('fingerprints are stable and JSON size and nesting are bounded before settlement',async()=>{
 assert.equal(core.requestFingerprint({b:2,a:{d:4,c:3}}),core.requestFingerprint({a:{c:3,d:4},b:2}));
 assert.equal(await core.readAttemptBody(request({note:'x'.repeat(65537)})),null);
 let deep={};for(let i=0;i<20;i++)deep={deep};assert.throws(()=>core.requestFingerprint(deep));assert.equal(core.isAttemptId('not-a-key'),false);
});
test('client recovery requires the same reference and reviewed quote; a retry sends one unchanged body',async()=>{
 const source=fs.readFileSync(new URL('../order-recovery/1.0.0/order-recovery.ts',import.meta.url),'utf8');
 const module={exports:{}};new vm.Script(ts.transpileModule(source,{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText).runInNewContext({module,exports:module.exports,AbortSignal,require:name=>{assert.equal(name,'./order-quote');return quotes;}});
 const client=module.exports,id=crypto.randomUUID(),totals=quotes.orderTotals(1000,99,0,600),body={attemptId:id,guestEmail:'',payAtPickup:false,lines:[line()],expectedTotals:totals},submission={id,body:JSON.stringify(body)};
 const quote={lines:[{itemId:'burger',name:'Burger',qty:1,unitCents:1000,lineCents:1000,options:[],ageRestricted:false}],totals,taxBasisPoints:600,hasAlcohol:false};
 const receipt={attemptId:id,outcome:'accepted',id,number:1,quotedMinutes:15,payAtPickup:false,totals,quote};
 assert.equal(client.readRecovery(receipt,submission).kind,'accepted');assert.equal(client.readRecovery(receipt,{id,body:null}).kind,'accepted');
 assert.equal(client.readRecovery({...receipt,attemptId:crypto.randomUUID()},submission).kind,'unknown');assert.equal(client.readRecovery({...receipt,totals:{...totals,totalCents:1}},submission).kind,'unknown');
 let calls=0;const result=await client.recoverSubmission(submission,'submit',async(_url,options)=>{calls++;assert.equal(options.body,submission.body);throw Error('lost response');});assert.equal(result.kind,'unknown');assert.equal(calls,1);
});
