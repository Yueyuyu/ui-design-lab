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
