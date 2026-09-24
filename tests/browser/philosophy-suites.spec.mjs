import {test,expect} from '@playwright/test';

test.beforeEach(async ({page})=>{page.__errors=[];page.on('pageerror',e=>page.__errors.push(e.message));page.on('console',m=>{if(m.type()==='error')page.__errors.push(m.text());});});
test.afterEach(async ({page})=>expect(page.__errors).toEqual([]));

test('果序保存失败保留草稿，成功后取消恢复新基线',async({page})=>{
 await page.goto('/#/systems/orchard-ui/playground');
 await page.getByLabel('模拟保存失败').check();
 await page.getByLabel('工作空间名称',{exact:true}).fill('新研究空间');
 await page.getByRole('button',{name:'保存设置',exact:true}).click();
 await expect(page.getByRole('alert')).toContainText('演示保存失败');
 await expect(page.getByLabel('工作空间名称',{exact:true})).toHaveValue('新研究空间');
 await page.getByLabel('模拟保存失败').uncheck();
 await page.getByRole('button',{name:'保存设置',exact:true}).click();
 await expect(page.locator('.ou-save-status')).toHaveText('设置已保存');
 await page.getByLabel('工作空间名称',{exact:true}).fill('未保存');
 await page.getByRole('button',{name:'取消',exact:true}).click();
 await expect(page.getByLabel('工作空间名称',{exact:true})).toHaveValue('新研究空间');
 await page.getByRole('button',{name:'查看摘要',exact:true}).click();
 await expect(page.getByRole('dialog')).toContainText('新研究空间');
 await page.keyboard.press('Escape');
 await expect(page.getByRole('button',{name:'查看摘要',exact:true})).toBeFocused();
});

test('果序取消与卸载拒绝忽略 AbortSignal 的迟到保存',async({page})=>{
 await page.goto('/tests/browser/fixtures/philosophy.html');
 const name=page.getByLabel('工作空间名称',{exact:true});
 await name.fill('旧请求');await page.getByRole('button',{name:'保存设置',exact:true}).click();
 await expect(name).toBeDisabled();await page.getByRole('button',{name:'取消',exact:true}).click();
 await name.fill('取消后新草稿');await page.getByRole('button',{name:'返回最早请求'}).click();
 await expect(name).toHaveValue('取消后新草稿');await expect(page.locator('output').first()).toContainText('已中止 1');
 await page.getByRole('button',{name:'保存设置',exact:true}).click();await page.getByRole('button',{name:'切换挂载'}).click();
 await page.getByRole('button',{name:'返回最早请求'}).click();await page.getByRole('button',{name:'切换挂载'}).click();
 await expect(name).toHaveValue('我的工作空间');await expect(page.locator('output').first()).toContainText('已中止 2');
});

test('对谈支持中文组合输入、换行、失败重试与复制',async({page})=>{
 await page.goto('/#/systems/dialogue-ui/playground');await page.getByLabel('模拟回复失败').check();
 const input=page.getByRole('textbox',{name:'消息内容'});await input.fill('中文问题');
 await input.dispatchEvent('compositionstart');await input.press('Enter');
 await expect(page.getByRole('article',{name:'你的消息',exact:true})).toHaveCount(0);
 await input.dispatchEvent('compositionend');await input.fill('中文问题');await input.press('End');await input.press('Shift+Enter');await input.press('a');
 await expect(input).toHaveValue('中文问题\na');await input.press('Enter');
 await expect(page.getByRole('alert')).toContainText('演示回复失败');
 await page.getByLabel('模拟回复失败').uncheck();await page.getByRole('button',{name:'重试',exact:true}).click();
 await expect(page.getByRole('article',{name:'助手回复',exact:true})).toContainText('本地适配器已收到');
 await expect(page.getByRole('article',{name:'你的消息',exact:true})).toHaveCount(1);await expect(input).toHaveValue('');
 await page.getByRole('button',{name:'复制回复',exact:true}).click();await expect(page.getByRole('button',{name:'已复制',exact:true})).toBeVisible();
});

test('对谈停止与切换拒绝迟到回复，等待时的新草稿不丢失',async({page})=>{
 await page.goto('/tests/browser/fixtures/philosophy.html');await page.getByLabel('验收套系').selectOption('dialogue-ui');
 const input=page.getByRole('textbox',{name:'消息内容'});
 await input.fill('停止这次请求');await input.press('Enter');await page.getByRole('button',{name:'停止生成',exact:true}).click();
 await page.getByRole('button',{name:'返回最早请求'}).click();await expect(page.getByRole('article',{name:'助手回复',exact:true})).toHaveCount(0);await expect(input).toHaveValue('停止这次请求');
 await input.fill('切换这次请求');await input.press('Enter');await page.getByRole('button',{name:'新建对话',exact:true}).click();
 await page.getByRole('button',{name:'返回最早请求'}).click();await expect(page.getByRole('article',{name:'助手回复',exact:true})).toHaveCount(0);
 await input.fill('正常请求');await input.press('Enter');await input.fill('下一条草稿');await page.getByRole('button',{name:'返回最早请求'}).click();
 await expect(page.getByRole('article',{name:'助手回复',exact:true})).toContainText('迟到回复：正常请求');await expect(input).toHaveValue('下一条草稿');
 await page.getByRole('searchbox',{name:'搜索对话',exact:true}).fill('停止这次请求');await expect(page.getByRole('navigation',{name:'对话历史'}).getByRole('button')).toHaveCount(1);
 await page.getByRole('navigation',{name:'对话历史'}).getByRole('button').click();await expect(page.getByRole('article',{name:'助手回复',exact:true})).toHaveCount(0);
});

for(const suite of ['orchard-ui','dialogue-ui']) {
 test(`${suite} 菜单、分段、标签与忙碌模态的键盘行为`,async({page})=>{
  await page.goto('/tests/browser/fixtures/philosophy.html');await page.getByLabel('验收套系').selectOption(suite);
  const menu=page.getByRole('button',{name:'更多操作',exact:true});await menu.press('ArrowDown');await expect(page.getByRole('menuitem',{name:'第一项',exact:true})).toBeFocused();
  await page.keyboard.press('ArrowDown');await expect(page.getByRole('menuitem',{name:'最后一项',exact:true})).toBeFocused();await page.keyboard.press('Escape');await expect(menu).toBeFocused();
  await page.getByRole('tab',{name:'第一视图',exact:true}).press('ArrowRight');await expect(page.getByRole('tab',{name:'第二视图',exact:true})).toBeFocused();
  const segment=page.getByRole('group',{name:'验收密度'});await segment.getByRole('radio',{name:'紧凑',exact:true}).press('Home');await expect(segment.getByRole('radio',{name:'舒适',exact:true})).toBeChecked();
  await page.getByLabel('模态忙碌',{exact:true}).check();const trigger=page.getByRole('button',{name:'打开验收模态',exact:true});await trigger.click();
  const dialog=page.getByRole('dialog',{name:'验收模态'});await expect(dialog).toContainText('正在处理');
  await page.keyboard.press('Tab');await expect(dialog.getByRole('button',{name:'关闭对话框',exact:true})).toBeFocused();
  await expect(page.locator('body')).toHaveCSS('overflow','hidden');await page.keyboard.press('Escape');await expect(trigger).toBeFocused();await expect(page.locator('body')).not.toHaveCSS('overflow','hidden');
 });
 test(`${suite} 组件目录、窄屏场景与减少动态`,async({page})=>{
  await page.goto(`/#/systems/${suite}/components`);await expect(page.locator('.doc-index-item')).toHaveCount(suite==='orchard-ui'?25:21);
  const scene=suite==='orchard-ui'?'preferences':'conversation';
  for(const width of [1440,900,390]) {
   await page.setViewportSize({width,height:900});await page.goto(`/#/scenes/${scene}`);await expect(page.locator(suite==='orchard-ui'?'.ou-workspace':'.du-workspace')).toBeVisible();
   expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
   if(width===390&&suite==='dialogue-ui'){await page.getByRole('button',{name:'切换对话列表',exact:true}).click();await expect(page.getByRole('searchbox',{name:'搜索对话',exact:true})).toBeVisible();await page.getByRole('button',{name:'关闭对话列表',exact:true}).click();await expect(page.getByRole('textbox',{name:'消息内容'})).toBeVisible();}
   await page.screenshot({path:test.info().outputPath(`${suite}-${width}.png`),fullPage:false});
  }
  await page.emulateMedia({reducedMotion:'reduce'});expect(await page.locator(`[data-ui-system="${suite}"]`).first().evaluate((el,prefix)=>getComputedStyle(el).getPropertyValue(`--${prefix}-motion`).trim(),suite==='orchard-ui'?'ou':'du')).toBe('0ms');
 });
}

