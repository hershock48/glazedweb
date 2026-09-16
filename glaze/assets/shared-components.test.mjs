import test from 'node:test';
import assert from 'node:assert/strict';
import {issueSession,sessionRole,SESSION_SECONDS} from './workroom-session/1.0.0/session.ts';
import {parsePicks,priceOptions} from './option-pricing/1.0.0/pricing.ts';
test('versioned session rejects forgery, role escalation, expiry and rotated credentials',()=>{
 const now=1700000000000,secret='fixture-only-secret-'.repeat(3),pins={owner:'owner-code',staff:'staff-code'};
 for(const role of ['owner','staff']){
  const token=issueSession(role,pins[role],secret,now);
  assert.equal(sessionRole(token,secret,pins,now),role);
  assert.equal(sessionRole(token+'x',secret,pins,now),null);
  assert.equal(sessionRole(token,secret,pins,now+SESSION_SECONDS*1000),null);
  assert.equal(sessionRole(token,'new-secret'.repeat(5),pins,now),null);
  assert.equal(sessionRole(token,secret,{owner:'changed',staff:'changed'},now),null);
  const [raw,signature]=token.split('.'),data=JSON.parse(Buffer.from(raw,'base64url'));data.role=role==='staff'?'owner':'staff';
  assert.equal(sessionRole(Buffer.from(JSON.stringify(data)).toString('base64url')+'.'+signature,secret,pins,now),null);
 }
 assert.equal(sessionRole('owner-code',secret,pins,now),null);
 assert.throws(()=>issueSession('owner',pins.owner,'short'));
});
test('versioned option pricing distinguishes duplicate names across groups and enforces selection rules',()=>{
 const item={name:'Fixture',options:[{name:'Included',multi:false,required:true,choices:[{name:'Sauce',priceCents:0}]},{name:'Extras',multi:true,required:false,choices:[{name:'Sauce',priceCents:125}]}]};
 const picks=[{group:'Included',choice:'Sauce'},{group:'Extras',choice:'Sauce'}];
 assert.deepEqual(priceOptions(item,picks),{ok:true,optionCents:125,labels:['Included: Sauce','Extras: Sauce']});
 assert.equal(priceOptions(item,[]).ok,false);assert.equal(priceOptions(item,[...picks,picks[1]]).ok,false);
 assert.equal(priceOptions(item,[{group:'Missing',choice:'Sauce'}]).ok,false);
 assert.equal(parsePicks(['Sauce']),'stale');assert.equal(parsePicks({}),null);assert.deepEqual(parsePicks(undefined),[]);
});
