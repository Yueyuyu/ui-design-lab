import {test,expect} from '@playwright/test';

const suites=['quiet-workspace','midnight-ledger','clearline-console','signal-studio','folio-workspace','orchard-ui','dialogue-ui'];
async function expectClearLayout(page) {
 await expect.poll(()=>page.locator('.doc-index-list').evaluateAll(lists=>lists.every(list=>{
  const items=[...list.children].map(item=>item.getBoundingClientRect());
  const bottom=list.getBoundingClientRect().bottom;
  return items.every((a,index)=>a.bottom<=bottom+1 && items.slice(index+1).every(b=>
   a.right<=b.left+1 || b.right<=a.left+1 || a.bottom<=b.top+1 || b.bottom<=a.top+1));
 }))).toBe(true);
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
 expect(await page.locator('.doc-index-preview').evaluateAll(nodes=>nodes.every(node=>node.scrollWidth<=node.clientWidth+1))).toBe(true);
}

for(const id of suites) test(`${id} 自然高度陈列保持顺序、无重叠并响应窗口变化`,async({page})=>{
 const errors=[];page.on('pageerror',error=>errors.push(error.message));
 await page.setViewportSize({width:1674,height:1000});
 await page.goto(`/#/systems/${id}/components`);
 await expect(page.getByRole('heading',{level:1,name:'组件目录'})).toBeVisible();
 await expect(page.locator('.doc-index-list[data-masonry=ready]').first()).toBeVisible();
 const ids=await page.locator('.doc-index-item').evaluateAll(nodes=>nodes.map(node=>node.dataset.component));
 for(const width of [1674,1176,390]) {
  await page.setViewportSize({width,height:1000});
  await expectClearLayout(page);
  expect(await page.locator('.doc-index-item').evaluateAll(nodes=>nodes.map(node=>node.dataset.component))).toEqual(ids);
  // 从上到下读取的起点与 DOM 顺序一致，不能为了填空把后面的组件提前。
  expect(await page.locator('.doc-index-list').evaluateAll(lists=>lists.every(list=>{
   const tops=[...list.children].map(item=>item.getBoundingClientRect().top);
   return tops.every((top,index)=>index===0 || top>=tops[index-1]-1);
  }))).toBe(true);
  await page.screenshot({path:`.local-cache/appica-layout-${id}-${width}.png`,animations:'disabled'});
 }
 await page.getByRole('searchbox',{name:'搜索组件',exact:true}).fill('Button');
 await expect(page.locator('.doc-index-item[data-component=button]')).toBeVisible();
 await expectClearLayout(page);
 expect(errors).toEqual([]);
});

test('短面板接续排列，交互改变高度后仍保留控件状态',async({page})=>{
 await page.setViewportSize({width:1674,height:1000});
 await page.goto('/#/systems/midnight-ledger/components');
 const filters=page.getByRole('navigation',{name:'组件分类'});
 await expect(page.getByRole('heading',{level:1,name:'组件目录'})).toBeVisible();
 await expectClearLayout(page);
 const panels=await page.locator('.doc-index-item[data-category=business]').evaluateAll(nodes=>nodes.slice(0,6).map(node=>{
  const r=node.getBoundingClientRect();return {top:r.top,bottom:r.bottom,height:r.height};
 }));
 expect(Math.max(...panels.slice(0,3).map(r=>r.height))-Math.min(...panels.slice(0,3).map(r=>r.height))).toBeGreaterThan(20);
 expect(panels[3].top).toBeLessThan(Math.max(...panels.slice(0,3).map(r=>r.bottom)));
 await filters.getByRole('button',{name:/反馈与浮层/}).click();
 const queue=page.locator('[data-component=toast-queue]');
 const initial=(await queue.boundingBox()).height;
 for(let n=0;n<4;n++) await queue.getByRole('button',{name:'新增通知',exact:true}).click();
 await expect.poll(async()=>(await queue.boundingBox()).height).toBeGreaterThan(initial+80);
 await expectClearLayout(page);
 await filters.getByRole('button',{name:/表单输入/}).click();
 const field=page.locator('[data-component=field]').getByRole('textbox',{name:/项目名称/});
 await field.fill('布局切换保留输入');
 for(const width of [1176,390,1674]) {
  await page.setViewportSize({width,height:1000});
  await expect(field).toHaveValue('布局切换保留输入');
  await expectClearLayout(page);
 }
});
