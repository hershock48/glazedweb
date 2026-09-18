import test from 'node:test';
import assert from 'node:assert/strict';
import {prepareMenuSave} from './menu-write.ts';
const rules={normalizePrice:value=>Number(value).toFixed(2),priceError:value=>!value||/^\d{1,3}(\.\d{1,2})?$/.test(value)?null:'Invalid price'};
const state={revision:'current',menus:[{sections:[{items:[{key:'soup',builtInPrice:'5.00',builtInDesc:'Soup'},{key:'long',builtInPrice:'12.00',builtInDesc:'x'.repeat(436)}]}]}]};
const items={soup:{price:'7.5',desc:'Soup',hidden:false},long:{price:'12.00',desc:'x'.repeat(436),hidden:false}};
test('valid complete saves preserve long built-in descriptions and normalize client-approved prices',()=>{
 const plan=prepareMenuSave(state,{revision:'current',items},rules);assert.equal(plan.ok,true);assert.deepEqual({...plan.overrides},{soup:{price:'7.50'}});
 const reset=structuredClone(items);reset.soup.price='';assert.deepEqual({...prepareMenuSave(state,{revision:'current',items:reset},rules).overrides},{});
});
test('old or missing revisions and incomplete/unknown item sets cannot erase menu overrides',()=>{
 for(const revision of ['old',undefined])assert.equal(prepareMenuSave(state,{revision,items},rules).status,409);
 for(const badItems of [{},[],{...items,unknown:{}},{soup:items.soup}])assert.equal(prepareMenuSave(state,{revision:'current',items:badItems},rules).status,400);
});
test('invalid fields and prices are rejected instead of defaulted or truncated',()=>{
 for(const patch of [{desc:'x'.repeat(437)},{hidden:'false'},{price:5},{desc:null}]){
  const next=structuredClone(items);next.long={...next.long,...patch};assert.equal(prepareMenuSave(state,{revision:'current',items:next},rules).status,400);
 }
 const bad=structuredClone(items);bad.soup.price='-2';assert.equal(prepareMenuSave(state,{revision:'current',items:bad},rules).errors.soup,'Invalid price');
});
