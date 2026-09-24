import {test,expect} from '@playwright/test';
const suites=['quiet-workspace','midnight-ledger','clearline-console','signal-studio','folio-workspace'];
for(const id of suites) test(`${id} 分类索引、独立组件和分步复制`,async({page})=>{
 const errors=[];page.on('pageerror',error=>errors.push(error.message));
 await page.setViewportSize({width:1674,height:1000});
 await page.goto(`/#/systems/${id}/components`);
 await expect(page.getByRole('heading',{level:1,name:'组件目录'})).toBeVisible();
 const itemCount=await page.locator('.doc-index-list > li').count();
 await expect(page.locator('.doc-index-preview > .doc-example')).toHaveCount(itemCount);
 await expect(page.getByText(/该组件缺少独立示例/)).toHaveCount(0);
 const buttonPreview=page.locator('[data-component=button] .doc-index-preview');
 await buttonPreview.getByRole('button',{name:'保存更改',exact:true}).click();
 await expect(buttonPreview.getByRole('status')).toContainText(/已/);
 await expect(page.getByRole('heading',{level:1,name:'组件目录'})).toBeVisible();
 const link=page.locator('.doc-index-link').first();
 const title=await link.locator('strong').textContent();
 await link.click();
 await expect(page.getByRole('heading',{level:1,name:title,exact:true})).toBeVisible();
 await expect(page.locator('.doc-detail-preview')).toHaveCount(1);
 await expect(page.getByRole('navigation',{name:'按分类浏览组件'}).locator('[aria-current="page"]')).toHaveCount(1);
 for(const width of [1674,390]) {
  await page.setViewportSize({width,height:1000});
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),`${id} ${width} 组件详情`).toBe(true);
 }
 await page.setViewportSize({width:1674,height:1000});
 await page.goto(`/#/systems/${id}/usage`);
 await expect(page.getByRole('heading',{level:1,name:'接入指南'})).toBeVisible();
 await expect(page.locator('.usage-steps > li')).toHaveCount(4);
 await expect(page.getByRole('link',{name:'下载组件包',exact:true})).toBeVisible();
 await expect(page.getByRole('button',{name:'复制第 1 步',exact:true})).toHaveCount(0);
 for(let step=2;step<=4;step++) {
  await page.getByRole('button',{name:`复制第 ${step} 步`,exact:true}).click();
  expect(await page.evaluate(()=>navigator.clipboard.readText())).toContain(step===2?'npm install ./ui-design-lab-':step===3?`ui-design-lab/${id}`:'npm run build');
 }
 await page.getByRole('button',{name:'复制 Codex 指令',exact:true}).click();
 expect(await page.evaluate(()=>navigator.clipboard.readText())).toContain(`systems/${id}`);
 expect(errors).toEqual([]);
});
test('目录预览可直接编辑与打开浮层，宽组件完整显示并支持手机',async({page})=>{
 const errors=[];page.on('pageerror',error=>errors.push(error.message));
 await page.setViewportSize({width:1440,height:1000});
 await page.goto('/#/systems/midnight-ledger/components');
 const filters=page.getByRole('navigation',{name:'组件分类'});
 await filters.getByRole('button',{name:/表单输入/}).click();
 const field=page.locator('[data-component=field]').getByRole('textbox',{name:/项目名称/});
 await field.fill('目录内直接编辑');await expect(field).toHaveValue('目录内直接编辑');
 const select=page.locator('[data-component=select]').getByRole('combobox',{name:'复盘频率',exact:true});
 await select.selectOption('monthly');await expect(select).toHaveValue('monthly');
 const slider=page.getByRole('slider',{name:'预览比例',exact:true});
 await slider.focus();await slider.press('ArrowRight');await expect(slider).toHaveValue('45');
 await filters.getByRole('button',{name:/反馈与浮层/}).click();
 await page.locator('[data-component=dialog]').getByRole('button').click();
 await expect(page.getByRole('dialog',{name:'研究详情'})).toBeVisible();
 await page.getByRole('dialog').getByRole('button',{name:'保存并关闭'}).click();
 await expect(page.getByRole('dialog')).toHaveCount(0);
 await filters.getByRole('button',{name:/业务组件/}).click();
 const holdings=page.locator('[data-component=holdings-panel]');
 await expect(holdings.getByRole('heading',{name:'当前持仓 · 5'})).toBeVisible();
 await holdings.getByRole('button',{name:/NVDA 买/}).click();
 await expect(holdings.getByRole('status')).toContainText('NVDA');
 for(const width of [1440,1176,390]) {
  await page.setViewportSize({width,height:900});
  for(const category of ['全部','表单输入','业务组件']) {
   await filters.getByRole('button',{name:new RegExp(`^${category}`)}).click();
   expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
   expect(await page.locator('.doc-index-preview').evaluateAll(nodes=>nodes.every(node=>node.scrollWidth<=node.clientWidth+1))).toBe(true);
   await page.evaluate(()=>scrollTo(0,0));
   await page.screenshot({path:`.local-cache/component-visual-index-${width}-${category}.png`,animations:'disabled'});
  }
 }
 expect(errors).toEqual([]);
});
test('分类筛选、侧栏跳转、章节定位与手机组件选择',async({page})=>{
 await page.setViewportSize({width:1674,height:1000});
 await page.goto('/#/systems/midnight-ledger/components');
 await page.getByRole('navigation',{name:'组件分类'}).getByRole('button',{name:/表单输入/}).click();
 await expect(page.locator('.doc-index-group')).toHaveCount(1);
 await page.locator('.doc-index-link').filter({hasText:'日期范围'}).click();
 await expect(page.getByRole('heading',{name:'日期范围',level:1})).toBeVisible();
 await expect.poll(()=>page.locator('.lab-component-browser').evaluate(node=>{const bounds=node.getBoundingClientRect(),item=node.querySelector('[aria-current="page"]').getBoundingClientRect();return item.top>=bounds.top&&item.bottom<=bounds.bottom;})).toBe(true);
 expect((await page.locator('.doc-detail-preview').boundingBox()).width).toBeGreaterThan(400);
 const url=page.url();
 await page.getByRole('navigation',{name:'本页内容'}).getByRole('button',{name:'参数与事件'}).click();
 await expect(page.locator('#component-api')).toBeFocused();expect(page.url()).toBe(url);
 await page.getByRole('searchbox',{name:'查找侧栏组件'}).fill('Select');
 await page.getByRole('navigation',{name:'按分类浏览组件'}).getByRole('link',{name:'选择器 Select',exact:true}).click();
 await expect(page.getByRole('heading',{name:'选择器',level:1})).toBeVisible();
 await page.getByRole('combobox',{name:'数据状态'}).selectOption('disabled');
 await page.getByRole('navigation',{name:'按分类浏览组件'}).getByRole('link',{name:'多项选择 MultiSelect',exact:true}).click();
 await expect(page.getByRole('combobox',{name:'数据状态'})).toHaveValue('default');
 await page.setViewportSize({width:390,height:844});
 await page.locator('.doc-mobile-picker > summary').click();
 await page.getByRole('searchbox',{name:'查找手机组件'}).fill('Slider');
 await page.getByRole('navigation',{name:'手机组件导航'}).getByRole('link',{name:'数值滑块 Slider',exact:true}).click();
 await expect(page.getByRole('slider',{name:'预览比例',exact:true})).toBeVisible();
 await expect(page.locator('.doc-mobile-picker')).not.toHaveAttribute('open','');
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
});
for(const id of suites.filter(id=>id!=='folio-workspace')) test(`${id} 套系选择器和滑块键盘操作`,async({page})=>{
 await page.goto(`/#/systems/${id}/playground`);
 const scenario=page.getByRole('combobox',{name:'场景状态',exact:true});
 if(await page.evaluate(()=>CSS.supports('appearance','base-select'))) expect(await scenario.evaluate(node=>getComputedStyle(node).appearance)).toBe('base-select');
 await scenario.selectOption('loading');await expect(page.getByRole('button',{name:'保存设置',exact:true})).toBeDisabled();
 await scenario.selectOption('default');await expect(page.getByRole('button',{name:'保存设置',exact:true})).toBeEnabled();
 await page.goto(`/#/systems/${id}/components/slider`);
 const slider=page.getByRole('slider',{name:'预览比例',exact:true});
 await slider.focus();await slider.press('ArrowRight');await expect(slider).toHaveValue('45');
 await slider.press('End');await expect(slider).toHaveValue('100');
 await slider.press('Home');await expect(slider).toHaveValue('0');
 await page.getByRole('combobox',{name:'数据状态'}).selectOption('disabled');await expect(slider).toBeDisabled();
 await page.goto(`/#/systems/${id}/theme`);
 await page.getByRole('slider',{name:'圆角',exact:true}).fill('12');
 await page.getByRole('button',{name:'显示配置',exact:true}).click();
 const theme=JSON.parse(await page.getByRole('textbox',{name:'主题 JSON',exact:true}).inputValue());
 expect(Object.entries(theme.values).some(([key,value])=>key.includes('radius')&&value==='12px')).toBe(true);
 await page.evaluate(()=>scrollTo(0,0));
 await page.screenshot({path:`.local-cache/refinement-${id}-theme.png`});
});
