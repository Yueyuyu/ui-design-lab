import {test,expect} from '@playwright/test';
import {readFileSync,readdirSync} from 'node:fs';
const suites=readdirSync('systems',{withFileTypes:true}).filter(item=>item.isDirectory()).map(item=>({id:item.name,entries:JSON.parse(readFileSync(`systems/${item.name}/showcase/catalog.generated.json`,'utf8'))}));

for(const suite of suites) test(`${suite.id} 每个公开 UI 导出都能独立查看并有真实预览`,async({page})=>{
  const errors=[];page.on('pageerror',error=>errors.push(error.message));
  await page.goto(`/#/systems/${suite.id}/components`);
  await expect(page.getByRole('heading',{name:'组件目录',exact:true})).toBeVisible();
  await expect(page.locator('.doc-index-list > li')).toHaveCount(suite.entries.filter(item=>item.kind!=='pattern').length);
  await expect(page.locator('.lab-navigation [aria-current="page"]')).toHaveCount(1);
  const labels=await page.locator('.lab-navigation button').allTextContents();
  expect(labels[0]).toContain('套系总览');expect(labels.some(text=>text.includes('业务组件'))).toBe(false);
  await page.screenshot({path:`.local-cache/docs-${suite.id}-directory.png`,fullPage:true});
  for(const entry of suite.entries) {
    await page.goto(`/#/systems/${suite.id}/components/${entry.id}`);
    await expect(page.getByRole('heading',{name:entry.title,exact:true,level:1})).toBeVisible();
    await expect(page.locator('.doc-detail-preview')).toBeVisible();
    await expect(page.getByText(`该组件缺少独立示例：${entry.exportName}`)).toHaveCount(0);
    await expect(page.getByRole('heading',{name:'参数与事件',exact:true})).toBeVisible();
    await expect(page.locator('.doc-state-list > div')).toHaveCount(7);
    expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
  }
  expect(errors).toEqual([]);
});

test('账盘七块业务面板保留受控操作，空/加载/失败/禁用边界明确',async({page})=>{
  await page.goto('/#/systems/midnight-ledger/components/holdings-panel');
  const preview=page.locator('.doc-detail-preview');
  await expect(preview.getByRole('heading',{name:'当前持仓 · 5'})).toBeVisible();
  await preview.getByRole('button',{name:/NVDA 买/}).click();
  await expect(preview.getByRole('status')).toContainText('NVDA');
  const state=page.getByRole('combobox',{name:'数据状态'});
  await state.selectOption('empty');await expect(preview.getByRole('heading',{name:'当前持仓 · 0'})).toBeVisible();await expect(preview).toContainText('暂无数据');
  await state.selectOption('loading');await expect(preview.getByRole('status').first()).toContainText('正在读取');
  await state.selectOption('error');await preview.getByRole('button',{name:'重试',exact:true}).click();
  await expect(preview.getByRole('status')).toContainText('已请求重试');
  await state.selectOption('disabled');expect(await preview.locator('[inert]').count()).toBe(1);
  await page.goto('/#/systems/midnight-ledger/components/pnl-calendar');
  await expect(preview.locator('.ml-calendar-grid > span')).toHaveCount(5);
  await preview.getByRole('button',{name:'2026-08-01，+48',exact:true}).click();
  await expect(preview.getByRole('status')).toContainText('2026-08-01');
  await expect(preview.getByRole('button',{name:'2026-08-01，+48',exact:true})).toHaveAttribute('aria-pressed','true');
  await page.screenshot({path:'.local-cache/docs-ledger-calendar-detail.png',fullPage:true});
  await state.selectOption('empty');
  await expect(preview.locator('.ml-calendar-grid > button')).toHaveCount(31);
  await preview.getByRole('button',{name:'2026-08-01，无记录',exact:true}).click();
  await expect(preview.getByRole('status')).toContainText('无记录');
});

test('目录搜索、旧链接、应用示例、浏览器返回和错误链接',async({page})=>{
  await page.goto('/#systems/midnight-ledger/components-plus');
  await expect(page.getByRole('heading',{name:'组件目录',exact:true})).toBeVisible();
  await page.getByRole('searchbox',{name:'搜索组件'}).fill('LedgerAssetSummary');
  await expect(page.locator('.doc-index-list > li')).toHaveCount(1);
  await page.locator('.doc-index-link').click();
  await expect(page.getByRole('heading',{name:'资产摘要',level:1})).toBeVisible();
  await page.goBack();await expect(page.getByRole('heading',{name:'组件目录',exact:true})).toBeVisible();
  await page.getByRole('navigation',{name:'Midnight Ledger 文档'}).getByRole('button',{name:/应用示例/}).click();
  await expect(page.getByRole('heading',{name:'应用示例',exact:true})).toBeVisible();
  await page.goBack();await expect(page.getByRole('heading',{name:'组件目录',exact:true})).toBeVisible();
  await page.goto('/#systems/midnight-ledger/workflows');
  await expect(page.getByRole('searchbox',{name:'筛选任务列表'})).toBeVisible();
  await page.goto('/#/systems/midnight-ledger/missing');await expect(page.getByRole('heading',{name:'未找到这个页面'})).toBeVisible();
  await page.goto('/#/systems/midnight-ledger/components/missing');await expect(page.getByRole('heading',{name:'没有找到这个组件'})).toBeVisible();
});

test('所有套系目录和组件详情在手机完整重排',async({page})=>{
  await page.setViewportSize({width:390,height:844});
  for(const suite of suites) {
    for(const suffix of ['components',`components/${suite.entries.find(entry=>entry.kind==='business').id}`,'foundations','guidelines','patterns','usage']) {
      await page.goto(`/#/systems/${suite.id}/${suffix}`);
      await page.locator('.lab-content h1').first().waitFor();
      expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),`${suite.id}/${suffix}`).toBe(true);
      if(suffix==='guidelines') {
        const composition=readFileSync(`systems/${suite.id}/standards/composition.md`,'utf8');
        const headings=[...composition.matchAll(/^## (.+)\r?$/gm)].map(match=>match[1].trim());
        await expect(page.locator('#composition h3')).toHaveText(headings);
        await expect(page.locator('#composition li')).toHaveCount(4);
        expect(await page.locator('.doc-standards li').evaluateAll(items=>items.every(item=>item.textContent.trim().length>0))).toBe(true);
        if(suite.id==='quiet-workspace') await expect(page.locator('#status-semantics table tbody tr')).toHaveCount(4);
      }
    }
  }
  await page.goto('/#/systems/midnight-ledger/components/holdings-panel');
  await page.screenshot({path:'.local-cache/docs-ledger-mobile.png',fullPage:true});
});
