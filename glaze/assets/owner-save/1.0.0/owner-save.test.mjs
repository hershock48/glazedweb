import test from 'node:test';
import assert from 'node:assert/strict';
import {saveOwnerDraft,isMenuSaveState} from './owner-save.ts';
const state={ok:true,backend:'postgres',menus:[{id:'food',label:'Menu',sections:[{name:'Food',items:[{key:'food|Food|Soup',name:'Soup',price:'4.00',desc:'Warm soup',builtInPrice:'4.00',builtInDesc:'Warm soup',hidden:false,edited:false}]}]}]};
test('a save needs a complete acknowledged menu and sends one bounded request',async()=>{
 let calls=0;
 const result=await saveOwnerDraft('/api/workroom/menu',{items:{soup:{price:'5'}}},isMenuSaveState,async(url,init)=>{calls++;assert.equal(init.method,'PUT');assert.ok(init.signal);assert.deepEqual(JSON.parse(init.body),{items:{soup:{price:'5'}}});return Response.json(state);});
 assert.equal(result.kind,'saved');assert.equal(calls,1);assert.deepEqual(result.data,state);
 for(const body of [{...state,ok:false},{...state,menus:[]},{...state,backend:'other'},{...state,menus:[{id:'bad',sections:[null]}]},null])assert.equal((await saveOwnerDraft('/api',{},isMenuSaveState,async()=>Response.json(body))).kind,'uncertain');
});
test('validation, locked sessions and conflicts are actionable; storage and transport remain uncertain',async()=>{
 for(const [status,kind]of [[400,'invalid'],[422,'invalid'],[401,'locked'],[403,'locked'],[409,'conflict'],[500,'uncertain'],[503,'uncertain']]){
  const r=await saveOwnerDraft('/api',{},isMenuSaveState,async()=>Response.json({errors:{price:'Invalid',unsafe:{nested:true}}},{status}));assert.equal(r.kind,kind);assert.match(r.message,/typing/i);if(kind==='invalid')assert.deepEqual(Object.keys(r.errors),['price']);
 }
 assert.equal((await saveOwnerDraft('/api',{},isMenuSaveState,async()=>{throw Error('offline');})).kind,'uncertain');
 assert.equal((await saveOwnerDraft('/api',{},isMenuSaveState,async()=>new Response('<html>proxy error</html>'))).kind,'uncertain');
});
test('timeout does not retry and does not claim the write was rejected',async()=>{
 let calls=0;
 const result=await saveOwnerDraft('/api',{},isMenuSaveState,async(_url,{signal})=>{calls++;return new Promise((resolve,reject)=>signal.addEventListener('abort',()=>reject(Error('timeout')),{once:true}));},5);
 assert.equal(result.kind,'uncertain');assert.match(result.message,/could not be confirmed/);assert.equal(calls,1);
});
test('malformed or duplicate menu items cannot replace the draft',()=>{
 const duplicate=structuredClone(state);duplicate.menus[0].sections[0].items.push(duplicate.menus[0].sections[0].items[0]);assert.equal(isMenuSaveState(duplicate),false);
 const malformed=structuredClone(state);delete malformed.menus[0].sections[0].items[0].price;assert.equal(isMenuSaveState(malformed),false);
 assert.equal(isMenuSaveState(state,['food|Food|Soup','missing-item']),false);
 assert.equal(isMenuSaveState(state,['food|Food|Soup']),true);
});
