import {test,expect} from '@playwright/test';

test('桌面悬停展开及移出收起不移动触发环或改变宿主宽度',async({page})=>{
  const errors=[];page.on('pageerror',error=>errors.push(error.message));
  await page.addInitScript(()=>{
    const listeners=new Set();
    window.__pulseSizes=[];
    window.chrome??={};
    window.chrome.webview={
      addEventListener:(_,listener)=>listeners.add(listener),removeEventListener:(_,listener)=>listeners.delete(listener),
      postMessage:message=>{if(message.type==='size')window.__pulseSizes.push(message);},
    };
    window.__pulseSend=(type,value)=>listeners.forEach(listener=>listener({data:{type,value}}));
  });
  await page.goto('/systems/pulse-desktop/desktop/index.html');
  await expect(page).toHaveTitle('Pulse Windows · 本地示例');
  await expect(page.locator('.pd-dock')).toHaveAttribute('data-mode','compact');
  for(const side of ['right','left'])for(const scale of [1,1.25,1.5,2]){
    await page.evaluate(({side,scale})=>{window.__pulseSend('side',side);window.__pulseSend('scale',scale);window.__pulseSizes=[];},{side,scale});
    await expect(page.locator('.pd-dock')).toHaveAttribute('data-side',side);
    await expect(page.locator('.pd-native')).toHaveCSS('zoom',String(scale));
    const before=await page.locator('.pd-summary').boundingBox();
    await page.locator('.pd-summary').hover();
    await expect(page.locator('.pd-dock')).toHaveAttribute('data-mode','expanded');
    const expanded=await page.locator('.pd-summary').boundingBox();
    expect(Math.abs(expanded.x-before.x),'展开时触发环不应横跳').toBeLessThan(1);
    await page.mouse.move(1100,850);
    await expect(page.locator('.pd-dock')).toHaveAttribute('data-mode','compact');
    await page.waitForTimeout(380);
    await expect(page.locator('.pd-dock')).toHaveAttribute('data-mode','compact');
    const after=await page.locator('.pd-summary').boundingBox();
    expect(Math.abs(after.x-before.x),'收起时触发环不应横跳').toBeLessThan(1);
    const widths=await page.evaluate(()=>window.__pulseSizes.map(size=>size.width));
    expect(new Set(widths).size,'悬停切换不能再伸缩原生窗口宽度').toBe(1);
    const heights=await page.evaluate(()=>window.__pulseSizes.map(size=>size.height));
    expect(new Set(heights).size,'悬停切换不能再伸缩原生窗口高度').toBe(1);
    const modes=await page.evaluate(()=>window.__pulseSizes.map(size=>size.mode).filter((mode,index,all)=>index===0||mode!==all[index-1]));
    if(modes[0]==='compact')modes.shift();
    expect(modes,'一次移入移出只开合一次，不能闪回展开态').toEqual(['expanded','compact']);
  }
  await expect(page.locator('vite-error-overlay')).toHaveCount(0);expect(errors).toEqual([]);
});
