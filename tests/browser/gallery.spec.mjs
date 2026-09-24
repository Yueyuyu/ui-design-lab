import { test, expect } from "@playwright/test";
import { catalogFlow, comparisonFlow, dialogFlow } from "./flows.mjs";

const driver = (page) => ({ p: page, goto: (url) => page.goto(url), key: (value) => page.keyboard.press(value), clipboard: () => page.evaluate(() => navigator.clipboard.readText()) });
test.beforeEach(async ({ page }) => {
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("console", (message) => { if (message.type() === "error") errors.push(message.text()); });
  page.__appErrors = errors;
});
test.afterEach(async ({ page }) => { expect(page.__appErrors).toEqual([]); });
test("目录选型、全量搜索及直接比较", async ({ page }) => { await catalogFlow(driver(page)); });
test("手机导航、目录和比较入口", async ({ page }) => { await page.setViewportSize({ width: 390, height: 844 }); await catalogFlow(driver(page)); });
test("三个公共导航有独立页面、选中态和可刷新地址", async ({ page }) => {
  await page.goto("/#/systems");
  for (const [label, route, heading] of [["使用方式", "usage", "使用方式"], ["同场景对比", "compare", "月度经营复盘"], ["设计系统", "systems", "探索设计体系"]]) {
    const link = page.getByRole("navigation", { name: "首页导航" }).getByRole("link", { name: label, exact: true });
    await link.click();
    await expect(page).toHaveURL(new RegExp("#\\/" + route + "$"));
    await expect(link).toHaveAttribute("aria-current", "page");
    await expect(page.locator('.lab-public-header [aria-current="page"]')).toHaveCount(1);
    await expect(page.getByRole("heading", { name: heading, exact: true })).toBeVisible();
    await page.reload();
    await expect(page.getByRole("heading", { name: heading, exact: true })).toBeVisible();
  }
  await page.goBack();
  await expect(page).toHaveURL(/#\/compare$/);
});

test("统一目录筛选、空结果恢复及套系预览入口", async ({ page }) => {
  await page.goto("/#/systems");
  await expect(page.locator(".catalog-card").first()).toBeVisible();
  const initialCount = await page.locator(".catalog-card").count();
  await page.getByRole("textbox", { name: "搜索全部套系" }).fill("库存");
  await expect(page.locator(".catalog-card")).toHaveCount(1);
  await expect(page.locator(".catalog-card")).toHaveAttribute("data-suite-id", "clearline-console");
  await page.getByRole("textbox", { name: "搜索全部套系" }).fill("不存在的设计系统");
  await expect(page.getByRole("heading", { name: "没有找到匹配的设计系统" })).toBeVisible();
  await page.getByRole("button", { name: "重置筛选" }).click();
  await expect(page.locator(".catalog-card")).toHaveCount(initialCount);
  await page.getByRole("button", { name: "预览 Quiet Workspace 套系", exact: true }).click();
  await expect(page).toHaveURL(/systems\/quiet-workspace\/components$/);
  await expect(page.getByRole('heading', { name: '组件目录', exact: true })).toBeVisible();
});
test("场景编辑、切换、导出和错误恢复", async ({ page }) => { await comparisonFlow(driver(page)); });
for (const suite of ["quiet-workspace", "midnight-ledger"]) {
  test(`${suite} 长页面模态、焦点、关键状态行为`, async ({ page }) => { await dialogFlow(driver(page), suite); });
}

test("键盘 A/B 切换保留长页面滚动位置", async ({ page }) => {
  await page.goto("/#/compare");
  await page.getByRole("heading", { name: "月度经营复盘", exact: true }).waitFor();
  await page.getByRole("tab", { name: "Midnight Ledger", exact: true }).focus();
  await page.keyboard.press("PageDown");
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBeGreaterThan(100);
  // 等待用户触发的浏览器滚动动画稳定后再比较位置。
  let previous = -1;
  await expect.poll(async () => {
    const y = await page.evaluate(() => window.scrollY);
    const stable = Math.abs(previous - y) < 1;
    previous = y;
    return stable;
  }, { intervals: [100, 200, 300] }).toBe(true);
  const before = await page.evaluate(() => window.scrollY);
  await page.keyboard.press("Enter");
  await expect(page.locator(".comparison-suite-scene")).toHaveAttribute("data-ui-system", "midnight-ledger");
  expect(await page.evaluate(() => window.scrollY)).toBeCloseTo(before, 0);
});
