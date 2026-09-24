import {test,expect} from '@playwright/test';
import {readFile} from 'node:fs/promises';
import {kits} from '../../src/gallery/kits.js';

test.beforeEach(async({page})=>{page.__errors=[];page.on('pageerror',error=>page.__errors.push(error.message));});
test.afterEach(async({page})=>expect(page.__errors).toEqual([]));

test('应用示例归属套系，旧目录兼容且场景入口保留',async({page})=>{
 await page.goto('/#/kits');
 await expect(page.getByRole('heading',{name:'探索设计体系',exact:true})).toBeVisible();
 await expect(page.getByRole('navigation',{name:'首页导航'}).getByRole('link')).toHaveCount(3);
 for (const suiteId of new Set(kits.map(kit=>kit.preferred))) {
  await page.goto(`/#/systems/${suiteId}/patterns`);
  await expect(page.getByRole('heading',{name:'应用示例',exact:true})).toBeVisible();
  await expect(page.locator('[data-kit-id]')).toHaveCount(kits.filter(kit=>kit.preferred===suiteId).length);
  for (const kit of kits.filter(kit=>kit.preferred===suiteId)) await expect(page.locator(`[data-kit-id="${kit.id}"]`)).toBeVisible();
  await expect.poll(()=>page.locator('.suite-example-preview img').evaluateAll(images=>images.every(image=>image.complete&&image.naturalWidth>0))).toBe(true);
 }
 await page.goto('/#/systems/pulse-desktop/patterns');
 await expect(page.getByRole('heading',{name:'独立应用示例开发中'})).toBeVisible();
 await expect(page.locator('[data-kit-id]')).toHaveCount(0);
 await page.goto('/#/systems/midnight-ledger/patterns');
 await page.getByRole('link',{name:'预览运营分析与报表',exact:true}).click();
 await expect(page).toHaveURL(/#\/scenes\/reports$/);
 await expect(page.locator('.lab-sidebar')).toHaveCount(0);
 await expect(page.getByRole('heading',{name:'运营概览',exact:true})).toBeVisible();
 await page.getByRole('link',{name:'返回应用示例',exact:true}).click();
 await expect(page).toHaveURL(/#\/systems\/midnight-ledger\/patterns$/);
 await page.goto('/#/systems/quiet-workspace/patterns/flows?kit=tasks');
 await expect(page.getByRole('combobox',{name:'场景包',exact:true})).toHaveValue('tasks');
 await page.goto('/#/systems/quiet-workspace/patterns/flows?kit=research');
 await expect(page.getByRole('combobox',{name:'场景包',exact:true})).toHaveValue('research');
 await expect(page.getByRole('heading',{name:'项目与资料',exact:true})).toBeVisible();
 await page.getByRole('combobox',{name:'场景包',exact:true}).selectOption('reports');
 await page.reload();await expect(page.getByRole('combobox',{name:'场景包',exact:true})).toHaveValue('reports');
});

test('场景带入套系，项目类型、复制指令与刷新保持一致',async({page})=>{
 await page.goto('/#/systems/folio-workspace/patterns');
 await page.locator('[data-kit-id=knowledge]').getByRole('link',{name:'用于我的项目',exact:true}).click();
 const select=page.getByRole('combobox',{name:'选择设计套系',exact:true});
 await expect(select).toContainText('Folio Workspace');
 await expect(page.getByRole('button',{name:'新建项目',exact:true})).not.toBeVisible();
 await page.getByRole('button',{name:'复制接入指令',exact:true}).click();
 const handoff=await page.evaluate(()=>navigator.clipboard.readText());
 expect(handoff).toContain('https://raw.githubusercontent.com/Yueyuyu/ui-design-lab/main/skills/consume-suite/SKILL.md');expect(handoff).not.toMatch(/localhost|127\.0\.0\.1|\/downloads\//);
 expect(handoff.length).toBeLessThan(350);expect(handoff).not.toContain('interface ');
 expect(handoff).toContain('（folio-workspace）');expect(handoff).toContain('请按指南自行读取规范并完成接入');
 await page.getByRole('button',{name:'手动接入',exact:true}).click();
 await page.getByRole('button',{name:'复制第 2 步',exact:true}).click();
 expect(await page.evaluate(()=>navigator.clipboard.readText())).toContain('starter-folio-workspace-knowledge-');
 await page.getByRole('button',{name:'已有项目',exact:true}).click();
 await page.getByRole('button',{name:'复制第 3 步',exact:true}).click();
 expect(await page.evaluate(()=>navigator.clipboard.readText())).toContain('FolioWorkspace');
 await select.click();
 await page.getByRole('option',{name:'Midnight Ledger 午夜账盘',exact:true}).click();
 await expect(page.locator('.agent-example-context')).toHaveCount(0);
 await page.getByRole('button',{name:'复制第 3 步',exact:true}).click();
 const sample=await page.evaluate(()=>navigator.clipboard.readText());
 expect(sample).toContain('LedgerButton');expect(sample).not.toContain('folio-workspace');
 await page.getByRole('button',{name:'复制接入指令',exact:true}).click();
 const prompt=await page.evaluate(()=>navigator.clipboard.readText());
 expect(prompt).toContain('midnight-ledger');expect(prompt).not.toContain('folio-workspace');
 await page.reload();await expect(select).toContainText('Midnight Ledger');
 await page.getByRole('button',{name:'手动接入',exact:true}).click();
 await expect(page.getByRole('button',{name:'已有项目',exact:true})).toHaveAttribute('aria-pressed','true');
});

test('接入说明与授权下载包含当前选择和真实交付范围',async({page})=>{
 await page.goto('/#/usage?suite=folio-workspace&path=existing');
 await page.getByRole('button',{name:'手动接入',exact:true}).click();
 const downloadPromise=page.waitForEvent('download');
 await page.getByRole('button',{name:'下载接入说明',exact:true}).click();
 const download=await downloadPromise;
 const text=await readFile(await download.path(),'utf8');
 expect(text).toContain('FolioWorkspace');expect(text).toContain('npm install ./ui-design-lab-');expect(text).toContain('MIT');expect(text).not.toContain('试价');
 expect(text).toContain('NOTICE.md');expect(text).toContain('尚未开放购买');
});

test('套系面板支持键盘导航、取消与窄屏滚动，开发中不可选',async({page})=>{
 await page.goto('/#/usage?suite=quiet-workspace');
 const picker=page.getByRole('combobox',{name:'选择设计套系',exact:true});
 const list=page.getByRole('listbox',{name:'选择设计套系',exact:true});
 await picker.click();
 await expect(list).toBeVisible();
 await expect(list.getByRole('option',{name:/Pulse Desktop/})).toBeDisabled();
 await picker.press('End');
 await expect(picker).toHaveAttribute('aria-activedescendant',/dialogue-ui$/);
 await picker.press('Escape');
 await expect(list).not.toBeVisible();
 await expect(picker).toContainText('Quiet Workspace');
 await picker.press('ArrowDown');
 await picker.press('ArrowDown');
 await picker.press('Enter');
 await expect(picker).toContainText('Midnight Ledger');
 await expect(page).toHaveURL(/suite=midnight-ledger/);
 await picker.click();
 await page.getByRole('heading',{name:'使用方式',exact:true}).click();
 await expect(list).not.toBeVisible();
 for(const width of [1487,390,320]) {
  await page.setViewportSize({width,height:844});
  await picker.click();
  await expect(list).toBeVisible();
  expect(await list.evaluate(node=>{const rect=node.getBoundingClientRect();return rect.left>=0&&rect.right<=document.documentElement.clientWidth&&rect.top>=0&&rect.bottom<=innerHeight;})).toBe(true);
  await picker.press('End');
  await picker.press('Enter');
  await expect(picker).toContainText('Dialogue UI');
 }
});

test('公共页面在桌面、平板、手机无横向溢出，展开代码仍可复制',async({page})=>{
 for(const route of ['systems/folio-workspace/patterns','usage?suite=folio-workspace&path=existing']) {
  await page.goto(`/#/${route}`);
  await expect(page.locator('.suite-examples, .public-page')).toBeVisible();
  if(route.startsWith('usage')) {
   await page.getByRole('button',{name:'手动接入',exact:true}).click();
   await page.getByText('查看页面代码',{exact:true}).click();
  }
  for(const width of [1440,900,390]) {
   await page.setViewportSize({width,height:1000});
   expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),`${route} ${width}`).toBe(true);
   expect(await page.locator('.suite-examples, .public-page').evaluate(node=>getComputedStyle(node).fontFamily)).toContain('Segoe UI');
   await page.evaluate(()=>window.scrollTo(0,0));
   await page.screenshot({path:`.local-cache/public-pages-${route.split('?')[0].replaceAll('/','-')}-${width}.png`,animations:'disabled'});
  }
  if(route.startsWith('usage')) {
   await page.getByRole('button',{name:'复制第 3 步',exact:true}).click();
   expect(await page.evaluate(()=>navigator.clipboard.readText())).toContain('FolioWorkspace');
  }
 }
});

test('无效套系回退，设计研究与本机反馈入口可访问',async({page})=>{
 await page.goto('/#/usage?suite=missing&path=bad');
 await expect(page.getByRole('combobox',{name:'选择设计套系',exact:true})).toContainText('Quiet Workspace');
 await page.getByRole('button',{name:'手动接入',exact:true}).click();
 await expect(page.getByRole('button',{name:'新建项目',exact:true})).toHaveAttribute('aria-pressed','true');
 await page.locator('.usage-feedback > summary').click();
 await expect(page.getByRole('checkbox',{name:'在本机记录使用事件',exact:true})).not.toBeChecked();
 await page.getByRole('link',{name:/Notion 产品界面研究/}).click();
 await expect(page).toHaveURL(/#\/usage\/notion$/);
 await expect(page.getByRole('heading',{level:1})).toBeVisible();
});
