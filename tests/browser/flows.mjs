// CI 与本地 CUA 使用同一组流程；只通过可见控件改变状态。
const ensure = (value, message) => { if (!value) throw new Error(message); };
const snapshot = async (p) => {
  const prompt = await p.locator(".comparison-inspector__prompt pre").textContent();
  return JSON.parse(prompt.match(/```json\n([\s\S]*?)\n```/)[1]);
};
export async function noOverflow(p) {
  ensure(await p.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1), "页面存在水平溢出");
}

export async function catalogFlow({ p, goto }) {
  await goto("/#/systems");
  await p.getByRole("heading", { name: "完整套系目录" }).waitFor({ state: "visible" });
  ensure((await p.locator(".home-suite-facts").first().textContent()).includes("稳定"), "缺少成熟度");
  await p.getByRole("textbox", { name: "搜索全部套系" }).fill("Quiet");
  ensure(await p.getByRole("button", { name: "进入 Quiet Workspace", exact: true }).isVisible(), "搜索漏掉精选套系");
  ensure(await p.getByRole("button", { name: "进入 Midnight Ledger", exact: true }).count() === 0, "目录筛选未生效");
  await noOverflow(p);
  ensure(await p.evaluate(() => {
    if (innerWidth > 700) return true;
    const brand = document.querySelector(".lab-public-brand").getBoundingClientRect();
    const nav = document.querySelector(".lab-public-header nav").getBoundingClientRect();
    return nav.top >= brand.bottom && nav.width > innerWidth * 0.75;
  }), "手机导航未获得独立完整行");
  await p.getByRole("navigation", { name: "首页导航" }).getByRole("button", { name: "同场景对比", exact: true }).click();
  await p.getByRole("tab", { name: "Quiet Workspace", exact: true }).waitFor({ state: "visible" });
  await p.getByRole("heading", { name: "月度经营复盘", exact: true }).waitFor({ state: "visible" });
  await noOverflow(p);
}

export async function comparisonFlow({ p, goto, clipboard }) {
  await goto("/");
  await goto("/#/compare");
  await p.getByRole("button", { name: "设置表单", exact: true }).click();
  await p.getByRole("textbox", { name: /负责人/ }).fill("测试负责人");
  await p.getByRole("textbox", { name: /抄送邮箱/ }).fill("qa@example.com");
  await p.getByRole("switch", { name: "自动保存草稿", exact: true }).click();
  await p.getByRole("switch", { name: "完成后发送通知", exact: true }).click();
  await p.getByRole("combobox", { name: "组件密度", exact: true }).selectOption("compact");
  for (const [label, id] of [["Midnight Ledger", "midnight-ledger"], ["Quiet Workspace", "quiet-workspace"]]) {
    await p.getByRole("tab", { name: label, exact: true }).click();
    await p.locator(`.comparison-canvas [data-ui-system="${id}"] input`).first().waitFor({ state: "visible" });
    const fields = await p.evaluate(() => Array.from(document.querySelectorAll(".comparison-canvas input")).map(el => el.value));
    ensure(fields[0] === "测试负责人", "切换丢失负责人");
    ensure(fields[1] === "qa@example.com", "切换丢失邮箱");
    ensure(await p.getByRole("switch", { name: "自动保存草稿", exact: true }).getAttribute("aria-checked") === "false", "切换丢失关闭状态");
    const data = await snapshot(p);
    ensure(data.suiteId === id && data.density === "compact", "导出套系或密度不匹配");
    ensure(JSON.stringify(data.content) === JSON.stringify({ owner: "测试负责人", email: "qa@example.com", autoSave: false, notify: false }), "设置导出不完整");
  }
  await p.getByRole("button", { name: "复制全部", exact: true }).click();
  ensure((await clipboard()).includes('"email": "qa@example.com"'), "实际剪贴板缺少场景设置");
  await p.getByRole("button", { name: "数据表格", exact: true }).click();
  ensure((await snapshot(p)).content.rows.length === 4, "表格导出了错误场景");
  await p.getByRole("combobox", { name: "组件状态", exact: true }).selectOption("error");
  await p.locator(".comparison-canvas").getByRole("button", { name: /重新加载|重试/ }).click();
  ensure((await snapshot(p)).visualState === "default", "重试没有恢复可用状态");
  await p.getByRole("button", { name: "月度经营复盘", exact: true }).click();
  await p.locator(".comparison-canvas").getByRole("textbox", { name: /复盘名称/ }).fill("完整场景回归");
  await p.getByRole("button", { name: "详情页", exact: true }).click();
  const details = await snapshot(p);
  ensure(details.content.title === "完整场景回归" && details.content.items.some((item) => item.value === "测试负责人"), "详情没有沿用编辑数据");
  await p.getByRole("button", { name: "空状态", exact: true }).click();
  ensure((await snapshot(p)).content.records.length === 0, "空状态没有空记录");
  await p.locator(".comparison-canvas").getByRole("button", { name: "创建月度复盘", exact: true }).click();
  ensure((await snapshot(p)).scenarioId === "monthly-review", "空状态缺少有效下一步");
  await noOverflow(p);
}

export async function dialogFlow({ p, goto, key }, suiteId) {
  await goto(`/#/systems/${suiteId}/components`);
  const openerName = suiteId === "quiet-workspace" ? "打开对话框" : "打开交易确认";
  const actionName = suiteId === "quiet-workspace" ? "保存设置" : "确认执行";
  const opener = p.getByRole("button", { name: openerName, exact: true });
  await opener.click();
  const dialog = p.locator("dialog[open]");
  await dialog.waitFor({ state: "visible" });
  const initial = await p.evaluate(() => {
    const el = document.querySelector("dialog[open]");
    const r = el.querySelector("section").getBoundingClientRect();
    return { y: window.scrollY, visible: r.top >= 0 && r.bottom <= window.innerHeight + 1, modal: el.matches(":modal"), locked: document.body.style.overflow === "hidden", focus: document.activeElement?.getAttribute("aria-label"), density: el.parentElement.dataset.density };
  });
  ensure(initial.y > 100, "未在长页面滚动后验证弹窗");
  ensure(initial.visible && initial.modal && initial.locked && initial.focus === "关闭对话框", "弹窗位置、初始焦点或滚动锁失败");
  await key("Shift+Tab");
  ensure(await p.evaluate(() => document.activeElement?.textContent) === actionName, "反向焦点循环失败");
  await key("Tab");
  ensure(await p.evaluate(() => document.activeElement?.getAttribute("aria-label")) === "关闭对话框", "正向焦点循环失败");
  await key("Escape");
  await dialog.waitFor({ state: "detached" });
  ensure(await p.evaluate(() => document.body.style.overflow !== "hidden" && document.activeElement?.textContent) === openerName, "关闭没有解锁滚动或恢复焦点");
  const block = p.locator(".gallery-block").filter({ has: p.getByRole("heading", { name: "对话框", exact: true }) });
  for (const label of ["加载", "禁用"]) {
    await block.getByRole("button", { name: label, exact: true }).click();
    await opener.click();
    await dialog.waitFor({ state: "visible" });
    await key("Tab");
    ensure(await p.evaluate(() => document.activeElement?.getAttribute("aria-label")) === "关闭对话框", "焦点进入不可交互的弹窗内容");
    ensure(await dialog.locator("[inert]").count() === 2, "弹窗未隔离提交和内容");
    await key("Escape");
    await dialog.waitFor({ state: "detached" });
  }
  await block.getByRole("button", { name: "错误", exact: true }).click();
  await opener.click();
  ensure(await dialog.getByRole("alert").isVisible(), "缺少错误解释");
  ensure(await dialog.getByRole("button", { name: actionName, exact: true }).isEnabled(), "错误后无法恢复操作");
  await dialog.getByRole("button", { name: actionName, exact: true }).click();
  await dialog.waitFor({ state: "detached" });
  const prefix = suiteId === "quiet-workspace" ? "qw" : "ml";
  ensure(await p.locator(`.${prefix}-button[data-state="loading"]`).first().isEnabled() === false, "加载按钮仍可重复提交");
  ensure(await p.locator(`.${prefix}-button[data-state="disabled"]`).first().isEnabled() === false, "禁用按钮仍可交互");
  await noOverflow(p);
}

export async function consumerFlow({ p, goto }) {
  await goto("/");
  for (const suite of ["quiet-workspace", "midnight-ledger", "clearline-console", "signal-studio"]) {
    await p.getByRole("combobox", {name:"设计套系",exact:true}).selectOption(suite);
    await p.getByRole("button", {name:"查看 内容目录检查",exact:true}).click();
    await p.getByRole("button", {name:"重试任务",exact:true}).click();
    await p.getByRole("heading", {name:"任务结果",exact:true}).waitFor({state:"visible"});
    await p.getByRole("button", {name:"关闭详情",exact:true}).click();
    await p.getByRole("button", {name:"用量统计",exact:true}).click();
    ensure((await p.getByRole("heading",{name:/本会话累计用量/}).textContent()).includes("362"),"独立消费任务用量不一致");
    await noOverflow(p);
  }
}
