import { chromium } from 'playwright-core';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
const base='http://127.0.0.1:4490';
const browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH});
await fs.mkdir('review-screens',{recursive:true});
try {
 for(const width of [320,390,768,1440]){
  const page=await browser.newPage({viewport:{width,height:900},reducedMotion:'reduce'});
  await page.goto(base,{waitUntil:'networkidle'});
  assert.equal(await page.locator('h1').count(),1);
  await page.getByRole('button',{name:'Mark strawberry sold out'}).click();
  assert.match(await page.locator('[role="status"]').innerText(),/Updated/);
  await page.getByRole('button',{name:'Put strawberry back'}).click();
  assert.match(await page.locator('[role="status"]').innerText(),/matches the case/);
  await page.evaluate(()=>scrollTo(0,0));
  await page.screenshot({path:`review-screens/home-${width}.png`,fullPage:true});
  await page.goto(base+'/order?flavor=systems',{waitUntil:'networkidle'});
  assert.equal(await page.locator('select[name="flavorChoice"]').inputValue(),'systems');
  assert.equal(await page.locator('input[type="checkbox"]').count(),0);
  await page.screenshot({path:`review-screens/inquiry-${width}.png`,fullPage:true});
  await page.close();
 }
 const page=await browser.newPage({javaScriptEnabled:false,viewport:{width:390,height:844}});
 await page.goto(base+'/order');
 await page.locator('[name="name"]').fill('Local test');await page.locator('[name="business"]').fill('Example');await page.locator('[name="email"]').fill('test@example.com');await page.locator('[name="details"]').fill('A local no-JavaScript test');
 await page.getByRole('button',{name:'Start the conversation'}).click();
 assert.match(await page.locator('main').innerText(),/has not been delivered/);
 assert.ok((await page.getByRole('link',{name:'Open your prepared email'}).getAttribute('href')).includes('test%40example.com'));
 console.log('Demo, query selection, four responsive captures, and native form fallback passed.');
}finally{await browser.close();}
