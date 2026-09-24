import { test, expect } from '@playwright/test';
import { readFile } from 'node:fs/promises';

test.beforeEach(async ({page}) => { page.__errors=[]; page.on('pageerror', error=>page.__errors.push(error.message)); });
test.afterEach(async ({page}) => expect(page.__errors).toEqual([]));
const canvas = page => page.locator('.comparison-canvas');

test('记录对比保留草稿、选中项、视图筛选并可导出恢复', async ({page}) => {
  await page.goto('/#/compare');
  await page.getByRole('button',{name:'记录整理',exact:true}).click();
  await expect(page.getByLabel('Suite A',{exact:true})).toHaveValue('clearline-console');
  await expect(page.getByLabel('Suite B',{exact:true})).toHaveValue('folio-workspace');
  await canvas(page).getByLabel('记录标题',{exact:true}).fill('跨套保留的草稿');
  await canvas(page).getByLabel('记录笔记',{exact:true}).fill('未保存也要保留');
  await page.getByRole('tab',{name:'Folio Workspace',exact:true}).click();
  await expect(canvas(page).getByLabel('记录标题',{exact:true})).toHaveValue('跨套保留的草稿');
  await canvas(page).getByRole('tab',{name:'看板',exact:true}).click();
  await canvas(page).getByLabel('搜索记录',{exact:true}).fill('访谈');
  await page.getByRole('tab',{name:'Clearline Console',exact:true}).click();
  await expect(canvas(page).getByLabel('搜索记录',{exact:true})).toHaveValue('访谈');
  await expect(canvas(page).getByLabel('记录标题',{exact:true})).toHaveValue('跨套保留的草稿');
  await page.getByText('保存、恢复与分享比较配置',{exact:true}).click();
  const pending = page.waitForEvent('download');
  await page.getByRole('button',{name:'导出比较 JSON',exact:true}).click();
  const exported = JSON.parse(await readFile(await (await pending).path(),'utf8'));
  expect(exported.workflow.view).toBe('board');
  expect(exported.workflow.drafts['record-1'].title).toBe('跨套保留的草稿');
  expect(exported.workflow.records[0].title).toBe('访谈资料整理');
  await canvas(page).getByRole('button',{name:'取消编辑',exact:true}).click();
  await expect(canvas(page).getByLabel('记录标题',{exact:true})).toHaveValue('访谈资料整理');
  await page.getByLabel('比较 JSON',{exact:true}).fill(JSON.stringify(exported));
  await page.getByRole('button',{name:'导入比较',exact:true}).click();
  await expect(canvas(page).getByLabel('记录标题',{exact:true})).toHaveValue('跨套保留的草稿');
  await page.getByRole('tab',{name:'Folio Workspace',exact:true}).click();
  await expect(canvas(page).getByRole('tab',{name:'看板',exact:true})).toHaveAttribute('aria-selected','true');
  await page.getByText('视口、密度与状态',{exact:true}).click();
  await page.getByLabel('组件状态',{exact:true}).selectOption('loading');
  await expect(canvas(page).getByLabel('记录标题',{exact:true})).toBeDisabled();
  await page.getByLabel('组件状态',{exact:true}).selectOption('error');
  await canvas(page).getByRole('button',{name:'重新加载',exact:true}).click();
  await canvas(page).getByRole('button',{name:'保存记录',exact:true}).click();
  await canvas(page).getByLabel('搜索记录',{exact:true}).fill('');
  await expect(canvas(page).getByRole('button',{name:'打开 跨套保留的草稿',exact:true})).toBeVisible();
  await page.evaluate(()=>window.scrollTo(0,0));
  await page.screenshot({path:test.info().outputPath('folio-record-comparison.png'),fullPage:false});
  await page.getByLabel('预览视口',{exact:true}).selectOption('mobile');
  expect(await canvas(page).evaluate(node=>node.scrollWidth<=node.clientWidth)).toBe(true);
  await page.setViewportSize({width:390,height:900});
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
  await page.screenshot({path:test.info().outputPath('folio-record-mobile.png'),fullPage:false});
});

test('项目专属场景保存失败保留草稿，重试才回写，接入导出带入场景', async ({page}) => {
  await page.goto('/#/systems/clearline-console/patterns');
  const card = page.locator('[data-kit-id=projects]');
  await card.getByRole('link',{name:'预览项目运营工作台',exact:true}).click();
  await page.getByText('检查失败恢复',{exact:true}).click();
  await page.getByRole('switch',{name:'下次保存模拟失败',exact:true}).click();
  await page.getByLabel('项目状态',{exact:true}).selectOption('At risk');
  await page.getByRole('button',{name:'保存项目',exact:true}).click();
  await expect(page.getByRole('alert').filter({hasText:'演示保存失败'})).toBeVisible();
  const row=page.getByRole('row').filter({hasText:'Data Platform Upgrade'});
  await expect(row).toContainText('In progress');
  await page.getByRole('button',{name:'重试保存项目',exact:true}).click();
  await expect(row).toContainText('At risk');
  await page.getByLabel('项目状态',{exact:true}).selectOption('Planning');
  await page.getByRole('button',{name:'取消编辑',exact:true}).click();
  await expect(page.getByLabel('项目状态',{exact:true})).toHaveValue('At risk');
  await page.goto('/#/usage?suite=clearline-console&kit=projects');
  await page.getByRole('button',{name:'手动接入',exact:true}).click();
  await page.getByRole('button',{name:'复制第 2 步',exact:true}).click();
  expect(await page.evaluate(()=>navigator.clipboard.readText())).toContain('starter-clearline-console-projects-');
  await page.getByRole('button',{name:'已有项目',exact:true}).click();
  const pending=page.waitForEvent('download');
  await page.getByRole('button',{name:'下载接入说明',exact:true}).click();
  const content=await readFile(await (await pending).path(),'utf8');
  expect(content).toContain('项目运营工作台');expect(content).toContain('ClearProjectWorkspace');
});

test('内容专属场景从创建到重试和修订，取消不产生新版本', async ({page}) => {
  await page.goto('/#/systems/signal-studio/patterns/flows?kit=content');
  await page.getByRole('button',{name:'Create story',exact:true}).waitFor({state:'visible'});
  await expect(page.locator('.ss-revisions')).toContainText('还没有修订记录');
  await page.getByText('检查失败恢复',{exact:true}).click();
  await page.getByRole('switch',{name:'下次保存模拟失败',exact:true}).click();
  await page.getByRole('button',{name:'Create story',exact:true}).click();
  await page.getByLabel('内容标题',{exact:true}).fill('可接入的内容草稿');
  await page.getByLabel('内容说明',{exact:true}).fill('失败时仍保留');
  await page.getByRole('button',{name:'保存内容',exact:true}).click();
  await expect(page.getByRole('alert').filter({hasText:'演示保存失败'})).toBeVisible();
  await expect(page.getByLabel('内容标题',{exact:true})).toHaveValue('可接入的内容草稿');
  await page.getByRole('button',{name:'重试保存内容',exact:true}).click();
  await expect(page.getByRole('dialog')).toHaveCount(0);
  await expect(page.locator('.ss-revisions li')).toHaveCount(1);
  await page.locator('.ss-revisions').getByRole('button',{name:'可接入的内容草稿',exact:true}).click();
  await page.getByLabel('内容标题',{exact:true}).fill('取消的改名');
  await page.getByRole('button',{name:'取消编辑',exact:true}).click();
  await expect(page.locator('.ss-revisions')).not.toContainText('取消的改名');
  await expect(page.locator('.ss-revisions li')).toHaveCount(1);
});

for (const suite of ['clearline-console','signal-studio']) {
  test(suite+' 受控业务集合只接纳成功响应，关闭拒绝迟到结果', async ({page}) => {
    let release;
    let requests=0;
    await page.route('**/__workspace-save',async route=>{
      requests++;
      const record=route.request().postDataJSON();
      if(requests===1) await route.fulfill({status:503,body:'failed'});
      else if(requests===2) await route.fulfill({json:{...record,date:'2026-09-19',updatedAt:'2026-09-19'}});
      else { await new Promise(resolve=>{release=resolve;}); await route.fulfill({json:record}); }
    });
    await page.goto('/tests/browser/fixtures/workspaces.html?suite='+suite+'&ignore-cancel=1');
    const signal=suite==='signal-studio';
    await page.getByRole('button',{name:signal?'Create story':'Add project',exact:true}).click();
    await page.getByRole('dialog').getByRole('textbox',{name:signal?'内容标题':'Project name',exact:true}).fill('真实回调记录');
    await page.getByRole('button',{name:signal?'保存内容':'Create project',exact:true}).click();
    await expect(page.getByRole('alert').filter({hasText:'服务拒绝保存'})).toBeVisible();
    await expect(page.getByLabel('业务集合')).not.toContainText('真实回调记录');
    await page.getByRole('button',{name:signal?'重试保存内容':'重试保存项目',exact:true}).click();
    await expect(page.getByLabel('业务集合')).toContainText('真实回调记录');
    await page.getByRole('button',{name:signal?'Create story':'Add project',exact:true}).click();
    await page.getByRole('dialog').getByRole('textbox',{name:signal?'内容标题':'Project name',exact:true}).fill('迟到结果不写入');
    await page.getByRole('button',{name:signal?'保存内容':'Create project',exact:true}).click();
    await expect.poll(()=>!!release).toBe(true);
    await expect(page.getByRole('button',{name:signal?'保存内容':'Create project',exact:true})).toBeDisabled();
    await page.getByRole('button',{name:'关闭详情',exact:true}).click();
    release();
    await expect.poll(()=>requests).toBe(3);
    await page.getByRole('button',{name:signal?'Create story':'Add project',exact:true}).click();
    await expect(page.getByRole('dialog').getByRole('textbox',{name:signal?'内容标题':'Project name',exact:true})).toHaveValue('');
    await expect(page.getByLabel('业务集合')).not.toContainText('迟到结果不写入');
    await page.getByRole('button',{name:'关闭详情',exact:true}).click();
    await page.goto('/tests/browser/fixtures/workspaces.html?suite='+suite+'&readonly=1');
    await expect(page.getByRole('button',{name:signal?'Create story':'Add project',exact:true})).toBeDisabled();
  });
}

test('新场景桌面与手机布局可操作且无外部溢出', async ({page}) => {
  for(const [suite,kit] of [['clearline-console','projects'],['signal-studio','content']]) {
    await page.goto('/#/systems/'+suite+'/patterns/flows?kit='+kit);
    await expect(page.getByRole('button',{name:kit==='projects'?'Add project':'Create story',exact:true})).toBeVisible();
    for(const width of [1440,390]) {
      await page.setViewportSize({width,height:960});
      expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
      await page.screenshot({path:test.info().outputPath(kit+'-'+width+'.png'),fullPage:false});
      await page.getByRole('button',{name:kit==='projects'?'Add project':'Create story',exact:true}).click();
      await expect(page.getByRole('dialog')).toBeVisible();
      await page.getByRole('dialog').press('Escape');
      await expect(page.getByRole('dialog')).toHaveCount(0);
    }
  }
});
