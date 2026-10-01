import test from 'node:test';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {parseRegistrySource,loadMainRegistry,registryReview,registryWarnings} from './registry-reader.mjs';
import {registryFacts,flagsFor,loadRegistry} from './ledger.mjs';

const source='export const CUSTOM_ORDERS = {shop:{buildFee:1000,monthly:99,buildFeePaid:false,live:false,project:{needs:[]}}};';
const packet=(text=source)=>({path:'lib/customOrders.js',encoding:'base64',sha:createHash('sha1').update('blob '+Buffer.byteLength(text)+'\0').update(text).digest('hex'),content:Buffer.from(text).toString('base64')});
const response=(body,status=200)=>new Response(JSON.stringify(body),{status,headers:{'Content-Type':'application/json'}});
const row=()=>({_studio:true,name:'Shop',stage:'confirmed',events:[],commercial:{build:1000,monthly:99,monthlyStatus:'not-started'},operations:{buildPayment:'paid',delivery:'building',agreement:'signed'},blockers:[]});

test('registry parser reads only literal data and never executes source code',()=>{
  const parsed=parseRegistrySource(source+'\nthrow new Error("must not run");');
  assert.equal(parsed.shop.buildFee,1000);assert.equal(parsed.shop.monthly,99);
  for(const value of ['process.exit()','(()=>1000)()','{get amount(){return 1}}','{...other}','{["amount"]:1}','{__proto__: {bad:true}}']){
    assert.throws(()=>parseRegistrySource('export const CUSTOM_ORDERS = {shop:{buildFee:'+value+'}};'));
  }
  assert.throws(()=>parseRegistrySource('export const CUSTOM_ORDERS = {shop:{buildFee:Infinity}};'));
  assert.throws(()=>parseRegistrySource('export const OTHER = {};'));
});

test('main reader checks response bounds and blob identity, recording unavailable rather than stale success',async()=>{
  const calls=[];
  const result=await loadMainRegistry({fetchImpl:async(url,options)=>{calls.push({url,options});return response(packet());},now:()=>new Date('2026-09-17T15:00:00Z')});
  assert.equal(result.check.status,'checked');assert.equal(result.check.blobSha,packet().sha);
  assert.match(calls[0].url,/ref=main$/);assert.equal(calls[0].options.redirect,'error');assert.equal(calls[0].options.cache,'no-store');
  assert.equal(result.orders.shop.buildFee,1000);
  for(const fetchImpl of [async()=>response({},429),async()=>{throw Error('offline');},async()=>response({...packet(),sha:'0'.repeat(40)}),async()=>response({...packet(),path:'another-file.js'}),async()=>new Response(' '.repeat(524289))]){
    const failed=await loadMainRegistry({fetchImpl});assert.equal(failed.check.status,'unavailable');assert.equal(failed.orders,null);assert.match(failed.check.message,/REGISTRY NOT CHECKED/);
  }
});

test('registry changes are explicit while saved prices, newer payments and independent monthly status survive',()=>{
  const current=row(),before=structuredClone(current);
  const registry={orders:parseRegistrySource(source),todos:{},check:{status:'checked',source:'GitHub main'}};
  assert.equal(registryFacts(registry,'shop',current).registryReview.status,'matched');
  registry.orders.shop.buildFee=2000;
  const facts=registryFacts(registry,'shop',current);
  assert.equal(facts.build,1000);assert.equal(facts.buildFeePaid,true);assert.equal(facts.monthlyStatus,'not-started');
  assert.equal(facts.registryReview.status,'differs');assert.deepEqual(facts.registryReview.differences,[{field:'build',dashboard:1000,registry:2000}]);
  assert.deepEqual(flagsFor(current,'2026-09-17',facts),['REGISTRY DIFFERS']);
  assert.deepEqual(current,before);
  registry.orders.shop.buildFee=1000;registry.orders.shop.monthly=null;
  assert.equal(registryFacts(registry,'shop',current).registryReview.differences[0].field,'monthly');
});

test('aliases, missing registry rows, positive status claims and outage warnings remain distinct',()=>{
  const current=row(),registry={orders:parseRegistrySource(source),todos:{}};
  current.aliases=['shop'];assert.equal(registryFacts(registry,'renamed',current).registryReview.registryId,'shop');
  current.aliases=['shop','other'];registry.orders.other={buildFee:1000,monthly:99};
  assert.equal(registryFacts(registry,'renamed',current).registryReview.status,'ambiguous');
  current.aliases=[];assert.equal(registryFacts(registry,'missing',current).registryReview.status,'not-listed');
  registry.orders.shop.live=true;
  assert.deepEqual(registryFacts(registry,'shop',current).registryReview.differences,[{field:'delivery',dashboard:'building',registry:'live'}]);
  const unknown=registryFacts({orders:null,check:{status:'unavailable',source:'GitHub main'}},'shop',current);
  assert.deepEqual(registryWarnings(unknown.registryReview),['REGISTRY NOT CHECKED']);
  assert.equal(unknown.build,1000);assert.equal(unknown.buildFeePaid,true);
});

test('fixture mode never contacts main, and production rejects a fixture registry override',async()=>{
  assert.deepEqual((await loadRegistry({fixture:true})).orders,{});
  await assert.rejects(loadRegistry({'registry-file':'anything.json'}),/only for isolated/);
});
