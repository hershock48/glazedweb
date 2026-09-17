import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {loadBook,registryFacts,assertLegacyWritable,flagsFor} from './ledger.mjs';
import {studioProjection} from './studio-authority.mjs';
test('archive reads current dashboard and never silently falls back when authority is missing',()=>{
 const dir=fs.mkdtempSync(path.join(os.tmpdir(),'studio-authority-')),legacy=path.join(dir,'legacy.json'),studio=path.join(dir,'studio.json');
 try{
  fs.writeFileSync(legacy,JSON.stringify({rows:{old:{stage:'meeting'}}}));
  fs.writeFileSync(studio,JSON.stringify({revision:12,book:{rows:{old:{stage:'meeting',operations:{buildPayment:'paid'},commercial:{monthlyStatus:'not-started'},sourceRecords:[{id:'legacy-original',content:JSON.stringify({research:{date:'2026-09-14'},stage:'meeting'})}]}}}}));
  fs.writeFileSync(legacy+'.authority.json',JSON.stringify({version:1,mode:'studio-local',file:'studio.json'}));
  const book=loadBook(legacy);assert.equal(book.authority.revision,12);assert.equal(book.rows.old.stage,'paid');assert.equal(book.rows.old.research.date,'2026-09-14');assert.equal(book.rows.old.commercial.monthlyStatus,'not-started');
  assert.throws(()=>assertLegacyWritable(legacy),/archived/);assert.throws(()=>assertLegacyWritable(studio),/dashboard storage/);
  fs.unlinkSync(studio);assert.throws(()=>loadBook(legacy));
  assert.equal(JSON.parse(fs.readFileSync(legacy)).rows.old.stage,'meeting');
 }finally{fs.rmSync(dir,{recursive:true,force:true});}
});

test('older imports retain paid/live facts and advanced stages; un-parking removes the terminal stage',()=>{
 const rows={paid:{stage:'paid',events:[{type:'pay',date:'2026-09-01'}]},live:{stage:'live',operations:{buildPayment:'paid'}},retained:{stage:'retained',operations:{delivery:'live'}},reopened:{stage:'dormant',operations:{sales:'conversation'}}};
 const book=studioProjection({revision:1,book:{rows}});
 assert.equal(registryFacts(null,'paid',book.rows.paid).buildFeePaid,true);
 assert.equal(book.rows.live.stage,'live');assert.equal(registryFacts(null,'live',book.rows.live).live,true);
 assert.equal(book.rows.retained.stage,'retained');assert.equal(book.rows.reopened.stage,'replied');
});
test('dashboard notes and edits cannot conceal quiet contact time',()=>{
 const row={stage:'confirmed',events:[{type:'reply',date:'2026-09-01'},{type:'edit',date:'2026-09-17'}]};
 assert.deepEqual(flagsFor(row,'2026-09-17'),['quiet 16d']);
 row.events.push({type:'touch',date:'2026-09-17'});assert.deepEqual(flagsFor(row,'2026-09-17'),[]);
});
test('studio facts override stale registry payments, requirements and proposed prices',()=>{
 const row={_studio:true,name:'Fixture',operations:{buildPayment:'paid',agreement:'signed',delivery:'building'},commercial:{build:null,monthly:45,monthlyStatus:'not-started'},blockers:[{id:'owner',owner:'client',text:'Owner name',done:false}]};
 const facts=registryFacts({orders:{one:{buildFee:999,buildFeePaid:false,live:true,project:{needs:[{id:'old',ask:'Already supplied'}]}}},todos:{one:['Old task']}},'one',row);
 assert.equal(facts.build,null);assert.equal(facts.buildFeePaid,true);assert.equal(facts.monthlyStatus,'not-started');assert.equal(facts.live,false);assert.equal(facts.needsOpen[0].id,'owner');assert.deepEqual(facts.todos,[]);
 assert.equal(registryFacts(null,'one',row).hasRegistry,false);
});
test('parked and lost accounts stay closed even when they have paid',()=>{
 const result=studioProjection({revision:1,book:{rows:{one:{operations:{sales:'parked',buildPayment:'paid'}},two:{operations:{sales:'lost',delivery:'live'}}}}});
 assert.equal(result.rows.one.stage,'dormant');assert.equal(result.rows.two.stage,'passed');
});
