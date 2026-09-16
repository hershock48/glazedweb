import { chromium } from 'playwright-core';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
const browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH});
const base='http://127.0.0.1:4490';
await fs.mkdir('review-screens',{recursive:true});
try {
 for(const width of [320,390,768,1440,2560]){
  const page=await browser.newPage({viewport:{width,height:900},reducedMotion:'reduce'});
  const requests=[];page.on('request',r=>requests.push(r.url()));
  await page.goto(base,{waitUntil:'networkidle'});
  assert.match(await page.locator('.brand-motion picture img').evaluate(el=>el.currentSrc),/logo-still/);
  assert.equal(requests.some(url=>url.includes('logo-loop')),false,'Reduced motion must not download animated assets');
  await page.locator('#jelly').scrollIntoViewIfNeeded();
  assert.equal(await page.getByRole('link',{name:'Let’s talk Jelly →'}).getAttribute('href'),'/order?flavor=custom');
  assert.equal(await page.locator('#work .wcard').first().getAttribute('id'),'ban-card');
  for(const card of await page.locator('.reveal').all())await card.scrollIntoViewIfNeeded();
  await page.evaluate(()=>scrollTo(0,0));
  await page.screenshot({path:`review-screens/home-${width}.png`,fullPage:true});
  await page.close();
 }
 const page=await browser.newPage({viewport:{width:1440,height:900}});
 await page.goto(base,{waitUntil:'networkidle'});
 await page.waitForFunction(()=>document.querySelector('.brand-motion').dataset.playing==='true');
 assert.match(await page.locator('.brand-motion picture img').evaluate(el=>el.currentSrc),/logo-loop.webp/);
 await page.getByRole('button',{name:'Pause logo animation'}).click();
 assert.match(await page.locator('.brand-motion picture img').evaluate(el=>el.currentSrc),/logo-still/);
 await page.getByRole('button',{name:'Play logo animation'}).press('Enter');
 await page.waitForFunction(()=>document.querySelector('.brand-motion').dataset.playing==='true');
 await page.locator('footer').scrollIntoViewIfNeeded();
 await page.waitForFunction(()=>document.querySelector('.brand-motion').dataset.playing==='false');
 await page.evaluate(()=>scrollTo(0,0));
 await page.waitForFunction(()=>document.querySelector('.brand-motion').dataset.playing==='true');
 await page.emulateMedia({reducedMotion:'reduce'});
 await page.waitForFunction(()=>document.querySelector('.brand-motion').dataset.playing==='false');
 const mobile=await browser.newPage({viewport:{width:390,height:844}});
 await mobile.goto(base,{waitUntil:'networkidle'});
 assert.match(await mobile.locator('.brand-motion picture img').evaluate(el=>el.currentSrc),/logo-loop-small/);
 const nojs=await browser.newPage({javaScriptEnabled:false});
 await nojs.goto(base,{waitUntil:'networkidle'});
 assert.ok(await nojs.locator('.brand-motion picture img').evaluate(el=>el.complete&&el.naturalWidth>0));
 assert.match(await nojs.locator('.brand-motion picture img').evaluate(el=>el.currentSrc),/logo-still/);
 assert.equal(await nojs.locator('.brand-motion-toggle').isVisible(),false);
 const failed=await browser.newPage();
 await failed.route('**/logo-loop*.webp',route=>route.abort());
 await failed.goto(base,{waitUntil:'networkidle'});
 await failed.waitForFunction(()=>document.querySelector('.brand-motion picture img').currentSrc.includes('logo-still'));
 assert.ok(await failed.locator('.brand-motion picture img').evaluate(el=>el.complete&&el.naturalWidth>0));
 console.log('Five widths, reduced-motion network behavior, pause/play keyboard, offscreen pause/resume, mobile asset selection, no-JS, and failed-animation fallback passed.');
}finally{await browser.close();}

