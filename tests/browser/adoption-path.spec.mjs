import {test, expect} from '@playwright/test';
import {readFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {kits} from '../../src/gallery/kits.js';

test.beforeEach(async ({page}) => {page.__errors=[];page.on('pageerror', error => page.__errors.push(error.message));});
test.afterEach(async ({page}) => expect(page.__errors).toEqual([]));

for (const kit of kits) test(`${kit.id} 独立场景保留套系结构并在手机可浏览`, async ({page}) => {
  await page.goto(`/#/scenes/${kit.id}`);
  await expect(page.locator('.scene-surface').locator(kit.capture)).toBeVisible();
  await expect(page.locator('.lab-sidebar')).toHaveCount(0);
  await expect(page).toHaveTitle(new RegExp(kit.title));
  await expect(page.locator('.scene-intro')).toContainText(kit.purpose);
  await expect(page.locator('.scene-try li')).toHaveCount(3);
  await expect(page.getByRole('link',{name:'查看设计规则',exact:true})).toHaveAttribute('href',`#/systems/${kit.preferred}/guidelines/extension`);
  await expect(page.getByRole('link',{name:'返回应用示例',exact:true})).toHaveAttribute('href',`#/systems/${kit.preferred}/patterns`);
  await expect(page.getByRole('link',{name:'用于我的项目',exact:true})).toHaveAttribute('href',`#/usage?suite=${kit.preferred}&kit=${kit.id}`);
  for (const width of [1440,390]) {
    await page.setViewportSize({width,height:900});
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth),`${kit.id} ${width}`).toBe(true);
    await page.screenshot({path:test.info().outputPath(`${kit.id}-${width}.png`),fullPage:false});
  }
});

test('独立场景重置只重建演示，编辑保存后能重新开始',async ({page}) => {
  await page.goto('/#/scenes/projects');
  await page.getByLabel('项目状态',{exact:true}).selectOption('At risk');
  await page.getByRole('button',{name:'保存项目',exact:true}).click();
  await expect(page.getByRole('row').filter({hasText:'Data Platform Upgrade'})).toContainText('At risk');
  await page.getByRole('button',{name:'重新开始',exact:true}).click();
  await expect(page.getByLabel('项目状态',{exact:true})).toHaveValue('In progress');
  await page.getByRole('button',{name:'关闭项目详情',exact:true}).click();
  await expect(page.locator('.cc-project-grid')).toHaveAttribute('data-detail-open','false');
  await page.getByRole('button',{name:'Northwind Migration',exact:true}).click();
  await expect(page.locator('.cc-project-detail')).toContainText('Northwind Migration');
});

test('下载文件与版本清单匹配，选中场景决定 Starter',async ({page,request}) => {
  const manifestResponse = await request.get('/downloads/manifest.json');
  expect(manifestResponse.ok()).toBe(true);
  const manifest = await manifestResponse.json();
  expect(manifest.publishedToNpm).toBe(false);
  expect(manifest.artifacts.length).toBe(1 + new Set(kits.map(kit => kit.preferred)).size + kits.length);
  for (const artifact of manifest.artifacts) {
    // 下载预算防止 Vite 将 public/downloads 再次复制进库包而循环膨胀。
    expect(artifact.bytes,artifact.filename).toBeLessThan(5 * 1024 * 1024);
    const response = await request.get(`/downloads/${artifact.filename}`);
    expect(response.ok(),artifact.filename).toBe(true);
    const body=await response.body();
    expect(body.length).toBe(artifact.bytes);
    expect(createHash('sha256').update(body).digest('hex')).toBe(artifact.sha256);
  }
  await page.goto('/#/usage?suite=quiet-workspace&kit=research');
  await page.getByRole('button',{name:'手动接入',exact:true}).click();
  const pending=page.waitForEvent('download');
  await page.getByRole('link',{name:'下载独立 Starter',exact:true}).click();
  const download=await pending;
  expect(download.suggestedFilename()).toContain('starter-quiet-workspace-research-');
  expect((await readFile(await download.path())).length).toBeGreaterThan(1000);
  await page.getByRole('button',{name:'已有项目',exact:true}).click();
  await expect(page.getByRole('link',{name:'下载组件包',exact:true})).toBeVisible();
  await expect(page.locator('.onboarding-steps')).not.toContainText('npm pack');
});

test('对比高级工具按需展开，组件目录只有一份搜索',async ({page}) => {
  await page.goto('/#/compare');
  await expect(page.getByRole('heading',{name:'月度经营复盘',exact:true})).toBeVisible();
  for (const width of [1440,390]) {
    await page.setViewportSize({width,height:900});
    expect(await page.locator('.comparison-canvas').evaluate(node => node.getBoundingClientRect().top)).toBeLessThan(650);
  }
  await expect(page.getByLabel('组件状态',{exact:true})).not.toBeVisible();
  await expect(page.locator('.comparison-inspector__prompt pre')).not.toBeVisible();
  await page.getByText('视口、密度与状态',{exact:true}).click();
  await expect(page.getByLabel('组件状态',{exact:true})).toBeVisible();
  await page.goto('/#/systems/clearline-console/components');
  await expect(page.getByRole('searchbox',{name:'搜索组件',exact:true})).toBeVisible();
  await expect(page.locator('.lab-component-browser')).toHaveCount(0);
  await expect(page.locator('[data-component="data-table"] .cc-table-toolbar')).toHaveCount(0);
});

test('采用记录需填写实际阶段，导出自述而非虚构验证',async ({page}) => {
  await page.goto('/#/usage?suite=clearline-console');
  await page.getByRole('button',{name:'手动接入',exact:true}).click();
  await page.locator('.usage-feedback > summary').click();
  await expect(page.getByLabel('目前完成到哪一步')).toHaveValue('');
  await page.getByLabel('目前完成到哪一步').selectOption('starter');
  await page.getByLabel('首次运行耗时（分钟，可选）').fill('8');
  await page.getByLabel('卡住的步骤与期望').fill('测试记录：尚未接入业务服务');
  const pending=page.waitForEvent('download');
  await page.getByRole('button',{name:'导出本次接入记录',exact:true}).click();
  const report=await readFile(await (await pending).path(),'utf8');
  expect(report).toContain('使用者自述，未经独立核验');
  expect(report).toContain('已运行独立 Starter');
  expect(report).toContain('8 分钟');
  await expect(page.getByRole('checkbox',{name:'在本机记录使用事件'})).not.toBeChecked();
});

test('研究编辑区保留正文空间，窄屏数字读数不拆行',async ({page}) => {
  await page.goto('/#/scenes/research');
  const editor=page.getByRole('textbox',{name:'资料内容',exact:true});
  await expect(editor).toBeVisible();
  for (const [width,minHeight] of [[1440,280],[390,220]]) {
    await page.setViewportSize({width,height:900});
    expect(await editor.evaluate(node=>node.getBoundingClientRect().height)).toBeGreaterThanOrEqual(minHeight);
    expect(await editor.evaluate(node=>parseFloat(getComputedStyle(node).fontSize))).toBeGreaterThanOrEqual(14);
  }
  await page.goto('/#/scenes/tasks');
  await page.getByRole('button',{name:'用量统计',exact:true}).click();
  await expect(page.locator('.qw-signed-bars b').first()).toBeVisible();
  expect(await page.locator('.qw-signed-bars b').evaluateAll(nodes=>nodes.every(node=>getComputedStyle(node).whiteSpace==='nowrap'))).toBe(true);
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
});

for (const id of ['clearline-console','signal-studio']) test(`${id} 紧凑密度实际收紧控件而保留字号`,async ({page}) => {
  await page.goto(`/#/systems/${id}/components/field`);
  const input=page.locator('.doc-detail-preview').getByRole('textbox',{name:/项目名称/});
  await expect(input).toBeVisible();
  const comfortable=await input.evaluate(node=>({height:node.getBoundingClientRect().height,font:getComputedStyle(node).fontSize}));
  await page.getByRole('button',{name:'紧凑',exact:true}).click();
  await expect(page.locator('.lab-content')).toHaveAttribute('data-density','compact');
  const compact=await input.evaluate(node=>({height:node.getBoundingClientRect().height,font:getComputedStyle(node).fontSize}));
  expect(compact.height).toBeLessThan(comfortable.height);
  expect(compact.height).toBeCloseTo(32,2);
  expect(compact.font).toBe(comfortable.font);
});
