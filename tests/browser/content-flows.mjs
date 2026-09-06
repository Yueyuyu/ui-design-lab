// 日期使用原生方向键提交变化，覆盖浏览器按日期段编辑的真实路径。
const ensure = (value, message) => { if (!value) throw Error(message); };
export async function reportFlow({ p, goto, id }) {
  await goto("/#systems/" + id + "/workflows");
  await p.locator('.lab-content[data-ui-system="'+id+'"]').getByRole("heading",{name:"完整场景工作台",exact:true}).waitFor({state:"visible"});
  await p.getByRole("combobox", { name: "场景包", exact: true }).selectOption("reports");
  await p.locator('input[type="date"]').nth(0).fill("2026-09-02");
  await p.locator('input[type="date"]').nth(0).press("ArrowUp");
  await p.locator('input[type="date"]').nth(0).press("ArrowDown");
  await p.locator('input[type="date"]').nth(1).fill("2026-09-03");
  await p.locator('input[type="date"]').nth(1).press("ArrowUp");
  await p.locator('input[type="date"]').nth(1).press("ArrowDown");
  await p.getByRole("button", { name: "应用日期", exact: true }).click();
  await p.getByRole("heading", { name: "区间用量：162 次", exact: true }).waitFor({ state: "visible" });
  await p.getByRole("button", { name: "保存视图", exact: true }).click();
  await p.getByRole("button", { name: "清空日期", exact: true }).click();
  await p.getByRole("heading", { name: "区间用量：342 次", exact: true }).waitFor({ state: "visible" });
  await p.getByRole("button", { name: "恢复视图", exact: true }).click();
  await p.getByRole("heading", { name: "区间用量：162 次", exact: true }).waitFor({ state: "visible" });
  await p.getByRole("checkbox", { name: "模拟导出失败", exact: true }).check();
  await p.getByRole("button", { name: "导出当前明细 CSV", exact: true }).click();
  await p.getByRole("button", { name: "重试导出", exact: true }).click();
  await p.getByText("CSV 已生成并触发下载。", { exact: true }).waitFor({ state: "visible" });
  await p.getByRole("button", { name: "查看 内容目录检查", exact: true }).click();
  await p.getByRole("dialog", { name: "内容目录检查", exact: true }).waitFor({ state: "visible" });
  await p.getByRole("button", { name: "关闭详情", exact: true }).click();
  await p.locator('input[type="date"]').nth(0).fill("2026-09-05");
  await p.locator('input[type="date"]').nth(0).press("ArrowUp");
  await p.locator('input[type="date"]').nth(0).press("ArrowDown");
  ensure(!(await p.getByRole("button", { name: "应用日期", exact: true }).isEnabled()), "逆序日期仍能提交");
  await p.getByRole("button", { name: "取消日期修改", exact: true }).click();
}

export async function researchFlow({ p, goto, id = "quiet-workspace" }) {
  await goto("/#systems/" + id + "/workflows");
  await p.locator('.lab-content[data-ui-system="'+id+'"]').getByRole("heading",{name:"完整场景工作台",exact:true}).waitFor({state:"visible"});
  await p.getByRole("combobox", { name: "场景包", exact: true }).selectOption("research");
  await p.getByRole("textbox", { name: "资料内容", exact: true }).fill("本轮验收的研究内容");
  await p.getByRole("button", { name: "保存新版本", exact: true }).click();
  await p.getByRole("textbox", { name: "资料内容", exact: true }).fill("应被取消");
  await p.getByRole("button", { name: "取消编辑", exact: true }).click();
  ensure(await p.evaluate(() => document.querySelector(".research-layout textarea").value) === "本轮验收的研究内容", "资料取消没有恢复");
  await p.getByRole("button", { name: "版本历史", exact: true }).click();
  ensure(await p.getByRole("button", { name: "载入此版本", exact: true }).count() === 2, "没有保留历史版本");
  await p.getByRole("button", { name: "载入此版本", exact: true }).first().click();
  ensure((await p.evaluate(() => document.querySelector(".research-layout textarea").value)).includes("独立开发者"), "历史版本未载入编辑器");
}

export async function choicesFlow({ p, goto, id }) {
  await goto("/#systems/" + id + "/components-plus");
  await p.getByRole("combobox", { name: "默认模板", exact: true }).selectOption("month");
  await p.getByRole("searchbox", { name: "搜索默认模板", exact: true }).fill("无匹配词");
  ensure(await p.evaluate(() => document.querySelector('select[aria-label="默认模板"]').value) === "month", "搜索丢失已选项");
  await p.getByRole("checkbox", { name: "每周复盘", exact: true }).check();
  await p.getByRole("checkbox", { name: "每月总结", exact: true }).check();
  await p.getByRole("button", { name: "移除每周复盘", exact: true }).press("Enter");
  ensure(await p.getByRole("button", { name: "移除每周复盘", exact: true }).count() === 0, "多选不能用键盘移除");
  ensure(await p.getByRole("button", { name: "移除每月总结", exact: true }).count() === 1, "删除影响其他选项");
}
