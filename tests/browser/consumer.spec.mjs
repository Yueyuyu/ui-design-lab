import { test, expect } from "@playwright/test";
import { consumerFlow } from "./flows.mjs";
const consumerUrl = `http://127.0.0.1:${Number(process.env.UI_LAB_CONSUMER_PORT || 5174)}`;

test('消费运行时的加载浮层和内容区不可交互，关闭后恢复焦点', async ({page}) => {
  test.skip(!process.env.UI_LAB_CONSUMER_DIR, '需要独立安装目录');
  const errors=[];
  page.on('pageerror',error=>errors.push(error.message));
  page.on('console',message=>{if (['warning','error'].includes(message.type())) errors.push(message.text());});
  await page.goto(consumerUrl+'/runtime-compatibility.html');
  if (process.env.UI_LAB_REACT_VERSION) await expect(page.getByRole('heading',{level:1})).toContainText(process.env.UI_LAB_REACT_VERSION);
  const storyButton=page.getByRole('button',{name:'Board',exact:true});
  await expect(storyButton).toBeAttached();
  expect(await storyButton.evaluate(node=>!!node.closest('[inert]'))).toBe(true);
  for (const type of ['quiet','ledger','clear','signal','dialog','orchard','dialogue']) {
    await page.getByLabel('浮层类型').selectOption(type);
    await page.getByRole('button',{name:'打开浮层',exact:true}).click();
    const input=page.getByTestId('dialog-input');
    await expect(page.getByRole('dialog',{name:'兼容性详情'})).toBeVisible();
    expect(await input.evaluate(node=>!!node.closest('[inert]'))).toBe(true);
    expect(await page.getByTestId('dialog-action').evaluate(node=>!!node.closest('[inert]'))).toBe(true);
    await input.focus();
    await expect(input).not.toBeFocused();
    await page.getByRole('button',{name:['dialog','orchard','dialogue'].includes(type)?'关闭对话框':'关闭详情',exact:true}).click();
    await expect(page.getByRole('dialog')).toHaveCount(0);
    await expect(page.getByRole('button',{name:'打开浮层',exact:true})).toBeFocused();
  }
  await page.getByLabel('加载状态').uncheck();
  expect(await storyButton.evaluate(node=>!!node.closest('[inert]'))).toBe(false);
  await storyButton.click();
  await expect(storyButton).toHaveAttribute('aria-pressed','true');
  expect(errors).toEqual([]);
});

test("仓库外静谧与午夜连续任务工作台", async ({ page }) => {
  test.skip(!process.env.UI_LAB_CONSUMER_DIR, "先运行 test:consumer，并将输出目录设置为 UI_LAB_CONSUMER_DIR");
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await consumerFlow({ p: page, goto: (url) => page.goto(consumerUrl + url) });
  expect(errors).toEqual([]);
});
test("仓库外 Folio 页面编辑与视图切换", async ({page}) => {
  test.skip(!process.env.UI_LAB_CONSUMER_DIR, '需要独立安装目录');
  const errors=[]; page.on('pageerror',error=>errors.push(error.message));
  await page.goto(consumerUrl);
  await page.getByLabel('设计套系').selectOption('folio-workspace');
  await expect(page.getByLabel('业务场景')).toHaveCount(0);
  await page.getByLabel('页面标题',{exact:true}).fill('独立安装的研究手记');
  await page.getByRole('tab',{name:'看板',exact:true}).click();
  await expect(page.locator('.fw-board article')).toHaveCount(4);
  await expect(page.getByText('已保存到此浏览器',{exact:true})).toBeVisible();
  await page.reload();
  await page.getByLabel('设计套系').selectOption('folio-workspace');
  await expect(page.getByLabel('页面标题',{exact:true})).toHaveValue('独立安装的研究手记');
  expect(errors).toEqual([]);
});


test('仓库外项目与内容工作台采用本套专属入口', async ({page}) => {
  test.skip(!process.env.UI_LAB_CONSUMER_DIR, '需要独立安装目录');
  const errors=[];page.on('pageerror',error=>errors.push(error.message));
  await page.goto(consumerUrl);
  await page.getByLabel('设计套系').selectOption('clearline-console');
  await expect(page.getByLabel('业务场景')).toHaveCount(0);
  await page.getByRole('button',{name:'Add project',exact:true}).click();
  await page.getByRole('dialog').getByRole('textbox',{name:'Project name',exact:true}).fill('包内项目工作台');
  await page.getByRole('button',{name:'Create project',exact:true}).click();
  await expect(page.getByRole('heading',{name:'包内项目工作台',exact:true})).toBeVisible();
  await page.getByLabel('设计套系').selectOption('signal-studio');
  await expect(page.getByLabel('业务场景')).toHaveCount(0);
  await page.getByRole('button',{name:'Create story',exact:true}).click();
  await page.getByRole('textbox',{name:'内容标题',exact:true}).fill('包内内容工作台');
  await page.getByRole('button',{name:'保存内容',exact:true}).click();
  await expect(page.locator('.ss-revisions')).toContainText('包内内容工作台');
  expect(errors).toEqual([]);
});


test('仓库外果序与对谈可以独立保存和发送',async({page})=>{
 test.skip(!process.env.UI_LAB_CONSUMER_DIR,'需要独立安装目录');
 const errors=[];page.on('pageerror',error=>errors.push(error.message));
 await page.goto(consumerUrl);await page.getByLabel('设计套系').selectOption('orchard-ui');
 await page.getByRole('textbox',{name:'工作空间名称',exact:true}).fill('包外工作空间');await page.getByRole('button',{name:'保存设置',exact:true}).click();
 await expect(page.locator('.ou-save-status')).toContainText('已保存到本次演示');
 await page.getByRole('button',{name:'查看摘要',exact:true}).click();await expect(page.getByRole('dialog')).toContainText('包外工作空间');await page.keyboard.press('Escape');
 await page.getByLabel('设计套系').selectOption('dialogue-ui');await page.getByRole('textbox',{name:'消息内容'}).fill('包外对话测试');await page.getByRole('button',{name:'发送消息',exact:true}).click();
 await expect(page.getByRole('article',{name:'助手回复',exact:true})).toContainText('尚未连接 AI 服务');await expect(page.getByRole('article',{name:'你的消息',exact:true})).toHaveCount(1);
 expect(errors).toEqual([]);
});
