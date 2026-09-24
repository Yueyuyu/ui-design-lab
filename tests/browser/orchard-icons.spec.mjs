import {test,expect} from '@playwright/test';

test('图标可搜索选择，键盘连续移动，失败保留选择',async({page})=>{
 await page.goto('/tests/browser/fixtures/orchard-icons.html');
 const picker=page.getByRole('region',{name:'选择图标'}),search=picker.getByRole('searchbox');
 await search.fill('music');await expect(picker.getByRole('button')).toHaveCount(1);
 await picker.getByRole('button',{name:'音乐',exact:true}).click();await expect(page.getByLabel('选择结果')).toHaveText('music');
 await search.fill('不存在');await expect(picker.getByRole('status')).toContainText('没有匹配');
 await search.fill('');await picker.getByRole('button',{name:'文件夹',exact:true}).press('End');await expect(picker.getByRole('button',{name:'专注',exact:true})).toBeFocused();
 await page.keyboard.press('Home');await expect(picker.getByRole('button',{name:'文件夹',exact:true})).toBeFocused();
 await page.getByLabel('验收状态').selectOption('error');await expect(page.getByLabel('选择结果')).toHaveText('music');await expect(picker.getByRole('alert')).toContainText('当前选择已保留');
});

test('应用与命令回调、禁用跳过、加载锁定及图像回退',async({page})=>{
 await page.goto('/tests/browser/fixtures/orchard-icons.html');
 const launcher=page.getByRole('region',{name:'常用应用'}),menu=page.getByRole('region',{name:'快捷操作'});
 await menu.getByRole('searchbox').focus();await menu.getByRole('searchbox').dispatchEvent('keydown',{key:'ArrowDown',isComposing:true});await expect(menu.getByRole('searchbox')).toBeFocused();
 await launcher.getByRole('searchbox').fill('邮件');await launcher.getByRole('button',{name:'邮件，3',exact:true}).click();await expect(page.getByLabel('执行结果')).toHaveText('mail');
 await menu.getByRole('searchbox').press('ArrowDown');await expect(menu.getByRole('button',{name:'新建笔记',exact:true})).toBeFocused();await page.keyboard.press('ArrowDown');await expect(menu.getByRole('button',{name:'偏好设置',exact:true})).toBeFocused();await page.keyboard.press('Enter');await expect(page.getByLabel('执行结果')).toHaveText('settings');
 for(const state of ['disabled','loading']) {await page.getByLabel('验收状态').selectOption(state);await expect(menu.getByRole('searchbox')).toBeDisabled();await expect(launcher.getByRole('button').first()).toBeDisabled();await expect(page.getByRole('region',{name:'选择图标'}).getByRole('button').first()).toBeDisabled();}
 await expect(page.getByRole('img',{name:'图像回退'}).locator('img')).toHaveCount(0);await page.getByRole('button',{name:'恢复图像'}).click();await expect(page.getByRole('img',{name:'图像回退'}).locator('img')).toBeVisible();
});
