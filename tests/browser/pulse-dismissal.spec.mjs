import {test,expect} from '@playwright/test';
const browserErrors=new WeakMap();

test.beforeEach(async({page})=>{
  const errors=[];browserErrors.set(page,errors);
  page.on('pageerror',error=>errors.push(error.message));
  page.on('console',message=>{if(message.type()==='error')errors.push(message.text());});
  page.setDefaultTimeout(10000);
  await page.goto('/tests/browser/fixtures/pulse-dismissal.html');
  await expect(page).toHaveTitle('Pulse 临时面板交互验收');
});
test.afterEach(async({page})=>{expect(browserErrors.get(page)).toEqual([]);});
const mode=(page,value)=>expect(page.locator('.pd-dock')).toHaveAttribute('data-mode',value);
const leave=page=>page.mouse.move(12,600);
const enter=async page=>{await leave(page);await page.locator('.pd-summary').hover();await mode(page,'expanded');};

test('悬停、点击、宿主展开都临时显示；离开收起，重入取消计时',async({page})=>{
  await enter(page);const panel=await page.locator('.pd-panel-header').boundingBox();
  await leave(page);await page.waitForTimeout(100);
  await page.mouse.move(panel.x+60,panel.y+12);await page.waitForTimeout(400);await mode(page,'expanded');
  await leave(page);await mode(page,'compact');
  await enter(page);await page.locator('.pd-summary').click();await mode(page,'compact');
  await page.locator('.pd-summary').click();await mode(page,'expanded');
  await leave(page);await mode(page,'compact');
  await page.getByRole('button',{name:'宿主展开'}).click();await mode(page,'expanded');
  await page.locator('.pd-panel-header').hover();await leave(page);await mode(page,'compact');
});

test('透明空白属于外部；外部点击、窗口失焦和宿主离开均收起',async({page})=>{
  await enter(page);
  const rail=await page.locator('.pd-rail').boundingBox();
  await page.mouse.move(rail.x+32,rail.y+160);await mode(page,'compact');
  await enter(page);await page.getByRole('button',{name:'外部操作'}).click();await mode(page,'compact');
  await enter(page);await page.evaluate(()=>window.dispatchEvent(new Event('blur')));await mode(page,'compact');
  await enter(page);await page.evaluate(()=>window.dispatchEvent(new CustomEvent('pulse:host-pointer',{detail:false})));await mode(page,'compact');
});

test('关注不关闭；打开任务收起；固定是唯一常驻开关',async({page})=>{
  await enter(page);await page.getByRole('button',{name:'取消关注：交互验证任务'}).click();await mode(page,'expanded');
  await page.locator('.pd-task-open').click();await mode(page,'compact');await expect(page.getByLabel('打开记录')).toHaveText('task-1');
  await enter(page);await page.getByRole('button',{name:'固定面板',exact:true}).click();
  await leave(page);await page.waitForTimeout(420);await mode(page,'expanded');
  await page.getByRole('button',{name:'外部操作'}).click();await mode(page,'expanded');
  await page.evaluate(()=>window.dispatchEvent(new Event('blur')));await mode(page,'expanded');
  await page.locator('.pd-task-open').click();await mode(page,'expanded');
  await page.getByRole('button',{name:'取消固定面板'}).click();await leave(page);await mode(page,'compact');
});

test('键盘展开不被外部静止指针关闭，Escape 回焦；贴边回到细条',async({page})=>{
  await page.locator('.pd-summary').focus();await page.keyboard.press('Enter');await mode(page,'expanded');
  await page.evaluate(()=>window.dispatchEvent(new CustomEvent('pulse:host-pointer',{detail:false})));
  await page.waitForTimeout(420);await mode(page,'expanded');
  await page.keyboard.press('Escape');await mode(page,'compact');await expect(page.locator('.pd-summary')).toBeFocused();
  await enter(page);await page.getByRole('button',{name:'贴边收起'}).click();await mode(page,'docked');
  await page.locator('.pd-edge').hover();await mode(page,'expanded');await leave(page);await mode(page,'docked');
});

test('Lab 实际页面保持示例并使用相同收起规则',async({page})=>{
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto('/#/systems/pulse-desktop/playground');
  await page.getByRole('button',{name:'重置',exact:true}).click();
  await expect(page.locator('.pd-positioner .pd-value')).toHaveText('69%');
  await page.locator('.pd-positioner .pd-summary').hover();await mode(page,'expanded');
  await leave(page);await mode(page,'compact');
  await page.locator('.pd-positioner .pd-summary').hover();await mode(page,'expanded');
  await page.getByRole('button',{name:'贴边收起',exact:true}).click();await mode(page,'docked');
  await page.locator('.pd-edge').hover();await mode(page,'expanded');
  await page.getByLabel('桌面模拟画布',{exact:true}).click({position:{x:12,y:500}});await mode(page,'docked');
  await expect(page.locator('vite-error-overlay')).toHaveCount(0);expect(errors).toEqual([]);
});
