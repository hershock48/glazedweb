import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
const root=new URL('../',import.meta.url);
const moduleURL=s=>'data:text/javascript;base64,'+Buffer.from(s).toString('base64');
const pricing=moduleURL(await fs.readFile(new URL('lib/pricing.js',root),'utf8'));
const contact=moduleURL(await fs.readFile(new URL('lib/contact.js',root),'utf8'));
const inquiry=moduleURL((await fs.readFile(new URL('lib/inquiry.js',root),'utf8')).replace('"./pricing"',JSON.stringify(pricing)).replace('"./contact"',JSON.stringify(contact)));
const route=moduleURL((await fs.readFile(new URL('app/api/order/route.js',root),'utf8')).replace('"@/lib/contact"',JSON.stringify(contact)).replace('"@/lib/inquiry"',JSON.stringify(inquiry)));
const {POST}=await import(route);
const valid={name:'Test owner',business:'Example business',email:'owner@example.com',details:'Connect our menu and orders',register:'Square & spreadsheets',flavorChoice:'systems'};
const request=data=>new Request('http://localhost/api/order',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(data)});
test('inquiry delivery and failure behavior',async()=>{
 const oldKey=process.env.RESEND_API_KEY;const oldFetch=globalThis.fetch;
 try{
  delete process.env.RESEND_API_KEY;
  assert.equal((await POST(request({...valid,details:''}))).status,400);
  assert.equal((await POST(request({...valid,name:{nested:'wrong type'}}))).status,400);
  assert.equal((await POST(request({...valid,details:'x'.repeat(6001)}))).status,400);
  const fallback=await POST(request(valid));assert.equal(fallback.status,503);assert.equal((await fallback.json()).reason,'not_configured');
  const form=new URLSearchParams({...valid,details:'<script>alert(1)</script>'});
  const html=await (await POST(new Request('http://localhost/api/order',{method:'POST',body:form}))).text();
  assert.match(html,/has not been delivered/);assert.match(html,/Square/);assert.match(html,/&lt;script&gt;/);assert.ok(!html.includes('<script>'));
  process.env.RESEND_API_KEY='test-only-placeholder';let message;
  globalThis.fetch=async(url,options)=>{message=JSON.parse(options.body);return new Response('{}',{status:200});};
  const success=await POST(request({...valid,flavorPrice:'$1',agreementAcceptedAt:'fabricated'}));
  assert.equal(success.status,200);assert.match(message.html,/5,000/);assert.match(message.html,/No agreement was accepted/);assert.ok(!message.html.includes('fabricated'));assert.equal(message.reply_to,valid.email);
  const native=await POST(new Request('http://localhost/api/order',{method:'POST',body:new URLSearchParams(valid)}));assert.match(await native.text(),/Your inquiry is with Kevin/);
  globalThis.fetch=async()=>new Response('{}',{status:500});assert.equal((await POST(request(valid))).status,503);
  globalThis.fetch=async()=>{throw Error('offline')};assert.equal((await POST(request(valid))).status,503);
 }finally{globalThis.fetch=oldFetch;if(oldKey===undefined)delete process.env.RESEND_API_KEY;else process.env.RESEND_API_KEY=oldKey;}
});
