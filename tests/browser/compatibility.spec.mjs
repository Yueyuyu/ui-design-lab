import { test, expect } from "@playwright/test";
import { readdirSync } from "node:fs";
import { noOverflow } from "./flows.mjs";
import { overlayFlow, settingsFlow } from "./implementation-flows.mjs";

const suiteIds = readdirSync(new URL("../../systems/", import.meta.url), { withFileTypes: true }).filter(e => e.isDirectory()).map(e => e.name);
test.beforeEach(async ({ page }) => {
  page.__errors = [];
  page.on("pageerror", error => page.__errors.push(error.message));
  page.on("console", message => { if (message.type() === "error") page.__errors.push(message.text()); });
});
test.afterEach(async ({ page }) => { expect(page.__errors).toEqual([]); });

for (const id of suiteIds) test(`${id} 表单保存与浮层键盘生命周期`, async ({ page }) => {
  const driver = { p: page, goto: url => page.goto(url), id };
  await settingsFlow(driver);
  await overlayFlow(driver);
});

for (const width of [320, 390, 720, 859]) test(`${width}px 首页、比较与四套工作流布局`, async ({ page }) => {
  await page.setViewportSize({ width, height: width === 720 ? 450 : 844 });
  for (const route of ["/#/systems", "/#/compare", ...suiteIds.map(id => `/#/systems/${id}/workflows`)]) {
    await page.goto(route);
    await expect(page.getByRole("heading").first()).toBeVisible();
    if (route.endsWith("workflows")) await expect(page.getByRole("searchbox", { name: "筛选任务列表" })).toBeVisible();
    if (route.endsWith("compare")) await expect(page.getByRole("heading", { name: "月度经营复盘", exact: true })).toBeVisible();
    await noOverflow(page);
    await expect(page.locator("vite-error-overlay")).toHaveCount(0);
  }
});

test("减少动态偏好生效，接入步骤使用当前版本且能下载", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/#/compare");
  await expect(page.locator(".comparison-canvas__viewport")).toBeVisible();
  const motion = await page.locator(".comparison-canvas__viewport").evaluate(el => ({ reduce: matchMedia("(prefers-reduced-motion: reduce)").matches, duration: getComputedStyle(el).transitionDuration }));
  expect(motion.reduce).toBe(true);
  expect(parseFloat(motion.duration)).toBeLessThanOrEqual(0.001);
  await page.goto("/#kits");
  await expect(page.getByRole("heading", { name: "接入你的项目" })).toBeVisible();
  await expect(page.locator("#onboarding pre")).toContainText("npm pack");
  await expect(page.locator("#onboarding pre")).toContainText("npm run dev");
  const download = page.waitForEvent("download");
  await page.getByRole("button", { name: "下载接入说明" }).click();
  expect((await download).suggestedFilename()).toBe("integration.md");
});
