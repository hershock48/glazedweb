import { chromium } from 'playwright-core';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
const browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH});
await fs.mkdir('review-screens',{recursive:true});
try {
 for(const width of [320,390,768,1440,2560]){
  const page=await browser.newPage({viewport:{width,height:900},reducedMotion:'reduce'});
  await page.goto('http://127.0.0.1:4490',{waitUntil:'networkidle'});
  await page.locator('#jelly').scrollIntoViewIfNeeded();
  assert.equal(await page.getByRole('link',{name:'Let’s talk Jelly →'}).getAttribute('href'),'/order?flavor=custom');
  assert.equal(await page.locator('#work .wcard').first().getAttribute('id'),'ban-card');
  assert.equal(await page.locator('#chism-card').count(),0);
  await page.evaluate(()=>scrollTo(0,0));
  await page.screenshot({path:`review-screens/home-${width}.png`,fullPage:true});
  await page.close();
 }
 const page=await browser.newPage({viewport:{width:1440,height:900}});
 await page.goto('http://127.0.0.1:4490',{waitUntil:'networkidle'});
 const mark=page.locator('.animated-mark');
 const frames=await mark.evaluate(el=>{
  const anims=el.getAnimations({subtree:true});anims.forEach(a=>a.pause());
  return [0,3200,4300,5000].map(time=>{anims.forEach(a=>a.currentTime=time);return getComputedStyle(el.querySelector('.droplet')).transform;});
 });
 assert.ok(new Set(frames).size>2,'Glaze must have distinct gathering and falling phases');
 await mark.evaluate(el=>el.getAnimations({subtree:true}).forEach(a=>a.play()));
 await page.locator('footer').scrollIntoViewIfNeeded();
 await page.waitForFunction(()=>document.querySelector('.animated-mark').classList.contains('motion-paused'));
 await page.evaluate(()=>scrollTo(0,0));
 await page.waitForFunction(()=>!document.querySelector('.animated-mark').classList.contains('motion-paused'));
 console.log('Five responsive captures, Jelly link, portfolio, distinct drip phases, offscreen pause/resume passed.');
}finally{await browser.close();}
