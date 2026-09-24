import {chromium,expect} from '@playwright/test';
import {mkdir} from 'node:fs/promises';
import {kits} from '../src/gallery/kits.js';

// 捕获真实场景本体，不把套系总览封面当作业务流程预览。
const browser=await chromium.launch();
try {
 const page=await browser.newPage({viewport:{width:1600,height:1200},deviceScaleFactor:1});
 await mkdir('src/gallery/kit-previews',{recursive:true});
 for(const kit of kits.filter(item => !process.argv.some(arg => arg.startsWith('--kit=')) || process.argv.includes('--kit='+item.id))) {
  await page.goto(`http://127.0.0.1:5173/${kit.route}`);
  const scene=page.locator(kit.capture);
  await scene.waitFor({state:'visible'});
  if(['tasks','research','reports'].includes(kit.id)) await expect(page.getByRole('combobox',{name:'场景包',exact:true})).toHaveValue(kit.id);
  await page.evaluate(()=>document.fonts.ready);
  await scene.locator('img').evaluateAll(images=>Promise.all(images.map(image=>image.decode())));
  await scene.screenshot({path:`src/gallery/kit-previews/${kit.id}.png`,animations:'disabled'});
  console.log(`${kit.id}: ${await scene.getAttribute('class')}`);
 }
} finally {await browser.close();}
