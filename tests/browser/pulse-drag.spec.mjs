import {test,expect} from '@playwright/test';

test.beforeEach(async({page})=>{
  await page.addInitScript(()=>{
    const listeners=new Set();window.__pulseMessages=[];
    window.chrome??={};
    window.chrome.webview={addEventListener:(_,fn)=>listeners.add(fn),removeEventListener:(_,fn)=>listeners.delete(fn),postMessage:msg=>window.__pulseMessages.push(msg)};
    window.__pulseSend=(type,value)=>listeners.forEach(fn=>fn({data:{type,value}}));
  });
  await page.goto('/systems/pulse-desktop/desktop/index.html');
  await expect(page).toHaveTitle('Pulse Windows · 本地示例');
});
const count=page=>page.evaluate(()=>window.__pulseMessages.filter(m=>m.type==='drag').length);
const finish=page=>page.evaluate(()=>window.__pulseSend('drag-ended',true));

for(const part of ['.pd-bot','.pd-ring-svg','.pd-value','.pd-drag'])test(`整个胶囊拖动：${part}，阈值、一次触发、松手不误点击`,async({page})=>{
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  const box=await page.locator(part).boundingBox();
  const x=box.x+box.width/2,y=part==='.pd-drag'?box.y+10:box.y+box.height/2;
  await page.mouse.move(x,y);await page.mouse.down();
  await page.mouse.move(x+3,y+2);expect(await count(page)).toBe(0);
  await page.mouse.move(x+8,y+2);await expect.poll(()=>count(page)).toBe(1);
  await page.mouse.move(x+20,y+8);expect(await count(page)).toBe(1);
  await expect(page.locator('.pd-dock')).toHaveAttribute('data-pressed','true');
  const mode=await page.locator('.pd-dock').getAttribute('data-mode');
  await page.mouse.up();await finish(page);
  await expect(page.locator('.pd-dock')).toHaveAttribute('data-mode',mode);
  await expect(page.locator('.pd-dock')).toHaveAttribute('data-pressed','false');
  if(mode==='expanded') {
    await page.getByRole('button',{name:'固定面板',exact:true}).click();
    await expect(page.getByRole('button',{name:'取消固定面板',exact:true})).toBeVisible();
  }
  const messages=await page.evaluate(()=>window.__pulseMessages);
  const index=messages.findIndex(m=>m.type==='drag');
  expect(messages.slice(0,index).filter(m=>m.type==='size').at(-1).attached).toBe(false);
  // 后续真实单击恢复；空白区域的单击明确打开详情。
  await page.locator('.pd-drag').click({position:{x:32,y:10}});
  await expect(page.locator('.pd-dock')).toHaveAttribute('data-mode','expanded');
  expect(errors).toEqual([]);
});

test('分页轻点仍翻页，拖动分页按钮不误翻页，额外指针不抢拖动',async({page})=>{
  await page.addInitScript(()=>{window.__PULSE_HOST_MODE__='live';});await page.reload();
  await expect.poll(()=>page.evaluate(()=>window.__pulseMessages.some(m=>m.type==='ready'))).toBe(true);
  const packet={schemaVersion:2,source:'companion-live',sequence:1,applications:['codex','cursor','claude','grok-bot'].map(id=>({id,iconMode:'brand',state:id==='codex'?{schemaVersion:1,source:'companion-live',sequence:1,remaining:50,quotaState:'ready',tasksState:'ready',tasks:[]}:{schemaVersion:1,source:'companion-live',remaining:null,quotaState:'signed-out',tasksState:'unsupported',tasks:[],notice:'',quotaLabel:'账户额度',quotaWindows:[],authState:'signed-out',canAuthorize:true,canDisconnect:false}}))};
  await page.evaluate(value=>window.__pulseSend('snapshot',value),packet);
  await expect(page.locator('.pd-pages span')).toHaveText('1/2');
  await page.getByRole('button',{name:'下一组应用'}).click();
  await expect(page.locator('.pd-pages span')).toHaveText('2/2');
  const button=page.getByRole('button',{name:'上一组应用'}),box=await button.boundingBox();
  await page.mouse.move(box.x+10,box.y+10);await page.mouse.down();
  await page.evaluate(()=>{
    const root=document.querySelector('.pd-dock');
    root.dispatchEvent(new PointerEvent('pointerdown',{pointerId:2,isPrimary:false,button:0,buttons:1,bubbles:true}));
    root.dispatchEvent(new PointerEvent('pointermove',{pointerId:2,isPrimary:false,clientX:900,buttons:1,bubbles:true}));
  });expect(await count(page)).toBe(0);
  await page.mouse.move(box.x+24,box.y+10);await expect.poll(()=>count(page)).toBe(1);
  await page.mouse.up();await finish(page);
  await expect(page.locator('.pd-pages span')).toHaveText('2/2');
  await button.click();await expect(page.locator('.pd-pages span')).toHaveText('1/2');
  await page.locator('.pd-summary[data-application="cursor"]').hover();
  await page.evaluate(()=>window.__pulseSend('auto-dock',true));
  const toggle=page.getByRole('checkbox',{name:'自动贴边'});await expect(toggle).toBeChecked();
  await toggle.click(); // 实时界面等待宿主确认，不能先假装保存成功。
  await expect(toggle).toBeChecked();
  const command=await page.evaluate(()=>window.__pulseMessages.filter(m=>m.type==='auto-dock').at(-1));
  expect(command).toEqual({type:'auto-dock',value:false});
  await page.evaluate(()=>window.__pulseSend('window-notice','自动贴边保存失败，已保留原设置'));
  await expect(page.locator('.pd-panel')).toContainText('自动贴边保存失败');
  await page.evaluate(()=>{window.__pulseSend('auto-dock',false);window.__pulseSend('window-notice','');});
  await expect(toggle).not.toBeChecked();
});

test('轻微移动仍点击、键盘可打开；右键与取消不启动拖动',async({page})=>{
  const box=await page.locator('.pd-drag').boundingBox();
  await page.mouse.move(box.x+32,box.y+10);await page.mouse.down();
  await page.mouse.move(box.x+35,box.y+12);await page.mouse.up();
  await expect(page.locator('.pd-dock')).toHaveAttribute('data-mode','expanded');expect(await count(page)).toBe(0);
  await page.mouse.down({button:'right'});await page.mouse.move(box.x+55,box.y+10);await page.mouse.up({button:'right'});expect(await count(page)).toBe(0);
  await page.locator('.pd-summary').focus();await page.keyboard.press('Escape');await page.keyboard.press('Enter');
  await expect(page.locator('.pd-dock')).toHaveAttribute('data-mode','expanded');
  await page.mouse.move(box.x+32,box.y+10);await page.mouse.down();
  await page.evaluate(()=>document.querySelector('.pd-dock').dispatchEvent(new PointerEvent('pointercancel',{bubbles:true,pointerId:1})));
  await page.mouse.up();await expect(page.locator('.pd-dock')).toHaveAttribute('data-pressed','false');expect(await count(page)).toBe(0);
});

test('贴边拉出先解除 attached；按住期间不因 host leave/blur 收起',async({page})=>{
  await page.evaluate(()=>window.__pulseSend('mode','docked'));
  await expect(page.locator('.pd-edge')).toBeVisible();
  const edge=await page.locator('.pd-edge').boundingBox();
  await page.mouse.move(edge.x+edge.width/2,edge.y+45); // 原有 hover 展开规则保留
  await expect(page.locator('.pd-dock')).toHaveAttribute('data-attached','true');
  const box=await page.locator('.pd-summary').boundingBox();
  await page.mouse.move(box.x+20,box.y+20);await page.mouse.down();await page.mouse.move(box.x+30,box.y+20);
  await expect.poll(()=>count(page)).toBe(1);
  await expect(page.locator('.pd-dock')).toHaveAttribute('data-attached','false');
  await page.evaluate(()=>{window.__pulseSend('pointer-inside',false);window.dispatchEvent(new Event('blur'));});
  await page.waitForTimeout(400);await expect(page.locator('.pd-dock')).toHaveAttribute('data-mode','expanded');
  await page.mouse.up();await finish(page);
  await expect(page.locator('.pd-dock')).toHaveAttribute('data-pressed','false');
  await page.evaluate(()=>window.__pulseSend('pointer-inside',false));
  await expect(page.locator('.pd-dock')).toHaveAttribute('data-mode','compact');
});

test('自动贴边默认关，可操作并接收宿主回滚；详情操作不发拖动',async({page})=>{
  await page.locator('.pd-summary').hover();
  const toggle=page.getByRole('checkbox',{name:'自动贴边'});await expect(toggle).not.toBeChecked();
  await toggle.check();await expect(toggle).toBeChecked();
  await expect.poll(()=>page.evaluate(()=>window.__pulseMessages.filter(m=>m.type==='auto-dock').at(-1)?.value)).toBe(true);
  await page.evaluate(()=>window.__pulseSend('auto-dock',false));await expect(toggle).not.toBeChecked();
  await page.getByRole('button',{name:'固定面板',exact:true}).click();expect(await count(page)).toBe(0);
  await expect(page.locator('vite-error-overlay')).toHaveCount(0);
});

test('Lab 画布使用共享阈值，拖出部分允许、展开不推回；保持示例',async({page})=>{
  await page.goto('/#/systems/pulse-desktop/playground');
  await page.getByRole('button',{name:'重置',exact:true}).click();
  const rail=page.locator('.pd-positioner .pd-rail');
  const before=await rail.boundingBox();
  await page.mouse.move(before.x+32,before.y+10);await page.mouse.down();
  await page.mouse.move(before.x+40,before.y+10);await page.mouse.move(before.x+100,before.y+70);await page.mouse.up();
  const after=await rail.boundingBox();expect(after.x-before.x).toBeGreaterThan(40);expect(after.y-before.y).toBeGreaterThan(40);
  await expect(page.locator('.pd-positioner .pd-value')).toHaveText('69%');
  await page.locator('.pd-positioner .pd-summary').hover();
  const expanded=await rail.boundingBox();expect(Math.abs(expanded.x-after.x)).toBeLessThan(1);
  await expect(page.getByRole('checkbox',{name:'自动贴边'})).not.toBeChecked();
  const stage=await page.getByLabel('桌面模拟画布',{exact:true}).boundingBox();
  await page.mouse.move(expanded.x+32,expanded.y+10);await page.mouse.down();
  await page.mouse.move(expanded.x+40,expanded.y+10);await page.mouse.move(stage.x-150,expanded.y+10);await page.mouse.up();
  const partial=await rail.boundingBox();
  expect(partial.x).toBeLessThan(stage.x);expect(partial.x+partial.width-stage.x).toBeGreaterThanOrEqual(15);
});
