import test from 'node:test';
import assert from 'node:assert/strict';
import {PGlite} from '@electric-sql/pglite';
import {compareContent,compareMemory,contentRevision,CONTENT_HISTORY_SCHEMA} from './content-cas.ts';
test('PostgreSQL compare-and-set protects first and subsequent writes and records accepted changes',async()=>{
 const db=new PGlite();
 try{
  await db.exec('CREATE TABLE workroom_content(key text PRIMARY KEY,data jsonb NOT NULL);'+CONTENT_HISTORY_SCHEMA);
  const query=(sql,params)=>db.query(sql,params),key='menu-overrides';
  const outcomes=await Promise.all([compareContent(query,key,null,{soup:{price:'7.50'}}),compareContent(query,key,null,{soup:{price:'8.50'}})]);
  assert.deepEqual(outcomes,[true,false]);
  assert.equal(await compareContent(query,key,{soup:{price:'5.00'}},{soup:{price:'9.00'}}),false);
  assert.equal(await compareContent(query,key,{soup:{price:'7.50'}},{soup:{price:'6.25'}}),true);
  const history=(await db.query('SELECT before_data,after_data,actor,changed_at FROM workroom_content_history ORDER BY changed_at')).rows;
  assert.equal(history.length,2);assert.equal(history[0].before_data,null);assert.equal(history[0].actor,'owner');assert.ok(history[0].changed_at);
  assert.deepEqual(history[1].before_data,{soup:{price:'7.50'}});assert.deepEqual(history[1].after_data,{soup:{price:'6.25'}});
  assert.equal(await compareContent(query,'removed',{soup:{price:'5.00'}},{}),false);
  assert.equal((await db.query('SELECT data FROM workroom_content WHERE key=$1',[key])).rows[0].data.soup.price,'6.25');
 }finally{await db.close();}
});
test('an audit failure rolls back the menu mutation in PostgreSQL',async()=>{
 const db=new PGlite();
 try{
  await db.exec('CREATE TABLE workroom_content(key text PRIMARY KEY,data jsonb NOT NULL);'+CONTENT_HISTORY_SCHEMA);
  await db.query('INSERT INTO workroom_content VALUES ($1,$2)',['menu-overrides',JSON.stringify({price:'5.00'})]);
  await db.exec("ALTER TABLE workroom_content_history ADD CONSTRAINT fail_fixture CHECK (actor <> 'owner')");
  await assert.rejects(compareContent((sql,params)=>db.query(sql,params),'menu-overrides',{price:'5.00'},{price:'9.00'}));
  assert.deepEqual((await db.query('SELECT data FROM workroom_content')).rows[0].data,{price:'5.00'});
  assert.equal((await db.query('SELECT * FROM workroom_content_history')).rows.length,0);
 }finally{await db.close();}
});
test('memory compare-and-set snapshots values and treats JSON key order consistently',()=>{
 const content=new Map(),history=[];
 assert.equal(compareMemory(content,history,'menu',null,{a:1,b:2}),true);
 assert.equal(compareMemory(content,history,'menu',{b:2,a:1},{a:3}),true);
 assert.equal(compareMemory(content,history,'menu',{a:1,b:2},{a:4}),false);
 assert.equal(history.length,2);content.get('menu').a=10;assert.deepEqual(history[1].after,{a:3});
 assert.equal(contentRevision({a:1,b:2}),contentRevision({b:2,a:1}));
});
