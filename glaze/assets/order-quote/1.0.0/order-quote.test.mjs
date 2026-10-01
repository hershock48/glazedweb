import test from 'node:test';
import assert from 'node:assert/strict';
import * as q from './order-quote.ts';
import * as pricing from '../../option-pricing/1.0.0/pricing.ts';
const clean=x=>JSON.parse(JSON.stringify(x));
const item=(patch={})=>({id:'food-burger',name:'Burger',priceCents:1000,ageRestricted:false,options:[],...patch});
const line=(patch={})=>({itemId:'food-burger',qty:1,options:[],quotedUnitCents:1000,quotedAgeRestricted:false,...patch});
const quote=(lines=[line()],items=[item()],config={})=>q.quoteOrder(lines,new Map(items.map(i=>[i.id,i])),[],{feeCents:99,tipCents:0,taxBasisPoints:600,...config},pricing.priceOptions);
test('exact half-up cents, tip bounds and overflow do not round or coerce inputs',()=>{
 assert.deepEqual(clean(q.orderTotals(25,0,0,600)),{subtotalCents:25,feeCents:0,tipCents:0,taxCents:2,totalCents:27});
 assert.equal(q.orderTotals(24,0,0,600).taxCents,1);
 for(const qty of [0,-1,1.5,'1',true,null,NaN,Infinity,13,Number.MAX_SAFE_INTEGER])assert.equal(quote([line({qty})]).ok,false,String(qty));
 for(const tipCents of [-1,.5,'100',true,null,undefined,NaN,Infinity,2001])assert.equal(quote(undefined,undefined,{tipCents}).ok,false,String(tipCents));
 assert.equal(quote(undefined,undefined,{tipCents:2000}).ok,true);
 assert.equal(q.orderTotals(Number.MAX_SAFE_INTEGER,1,0,0),null);
 assert.equal(quote([line({qty:12})],[item({priceCents:Number.MAX_SAFE_INTEGER})]).ok,false);
 assert.equal(q.orderTotals(10,0,0,10001),null);
});
test('cart identities preserve option combinations even when names contain separators',()=>{
 const first=[{group:'A',choice:'B,C=D'}],second=[{group:'A',choice:'B'},{group:'C',choice:'D'}];
 assert.notEqual(q.orderLineKey('item',first),q.orderLineKey('item',second));
 assert.equal(q.orderLineKey('item',second),q.orderLineKey('item',[...second].reverse()));
});
test('malformed carts, catalog ambiguity, duplicate picks and duplicate lines are refused',()=>{
 for(const lines of [null,{},[],[null],[{}],Array.from({length:31},()=>line()),[line(),line()]])assert.equal(quote(lines).ok,false);
 const group={name:'Sauce',required:true,multi:true,choices:[{name:'Queso',priceCents:250}]};
 const options=[{group:'Sauce',choice:'Queso'}];
 assert.equal(quote([line({options})],[item({options:[group]})]).quote.lines[0].unitCents,1250);
 for(const picks of [[],['Queso'],[null],[...options,...options],[{group:'Wrong',choice:'Queso'}]])assert.equal(quote([line({options:picks})],[item({options:[group]})]).ok,false);
 for(const options of [[group,group],[{...group,choices:[...group.choices,...group.choices]}]])assert.equal(quote([line()],[item({options})]).status,503);
 const sameNames=[group,{...group,name:'Extra',choices:[{name:'Queso',priceCents:50}]}];
 assert.equal(quote([line({options:[...options,{group:'Extra',choice:'Queso'}]})],[item({options:sameNames})]).quote.lines[0].unitCents,1300);
});
test('review requires every displayed line price, age requirement and each total; malformed replies cannot replace cart',()=>{
 const lines=[line(),line({itemId:'food-fries',quotedUnitCents:500})],items=[item(),item({id:'food-fries',name:'Fries',priceCents:500})];
 const good=quote(lines,items).quote;
 assert.equal(q.quoteWasReviewed(lines,good.totals,good),true);assert.equal(q.isQuoteForSubmission(good,lines),true);
 const swapped=quote(lines,[item({priceCents:900}),item({id:'food-fries',name:'Fries',priceCents:600})]).quote;
 assert.equal(swapped.totals.totalCents,good.totals.totalCents);assert.equal(q.quoteWasReviewed(lines,good.totals,swapped),false);
 assert.equal(q.quoteWasReviewed([line({quotedAgeRestricted:undefined}),lines[1]],good.totals,good),false);
 for(const changed of [null,{...good,lines:[]},{...good,hasAlcohol:true},{...good,totals:{...good.totals,totalCents:1}},{...good,lines:[{...good.lines[0],lineCents:1},good.lines[1]]}])assert.equal(q.isQuoteForSubmission(changed,lines),false);
});
