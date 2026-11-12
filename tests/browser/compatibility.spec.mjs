import { test, expect } from "@playwright/test";
import { readdirSync, readFileSync } from "node:fs";
import { noOverflow } from "./flows.mjs";
import { overlayFlow, settingsFlow } from "./implementation-flows.mjs";

const suiteIds = readdirSync(new URL("../../systems/", import.meta.url), { withFileTypes: true }).filter(e => e.isDirectory()).map(e => e.name);
// 通用流程驱动只覆盖实际实现该流程的四套；独立知识流程由 folio.spec 验证。
const workflowSuiteIds = ["quiet-workspace", "midnight-ledger", "clearline-console", "signal-studio"];
const knowledgeSuiteIds = suiteIds.filter(id => JSON.parse(readFileSync(new URL(`../../systems/${id}/suite.json`, import.meta.url))).capabilities.patterns.includes("knowledge-workspace"));
test.beforeEach(async ({ page }) => {
  page.__errors = [];
  page.on("pageerror", error => page.__errors.push(error.message));
  page.on("console", message => { if (message.type() === "error") page.__errors.push(message.text()); });
});
test.afterEach(async ({ page }) => { expect(page.__errors).toEqual([]); });
test("每套都有符合实际能力的工作流验收入口", () => {
  expect([...workflowSuiteIds, ...knowledgeSuiteIds, "orchard-ui", "dialogue-ui", "pulse-desktop"].sort()).toEqual([...suiteIds].sort());
});

test("首页场景卡片在桌面与手机可见，切页、筛选与返回可用", async ({page}) => {
  await page.goto("/#/systems");
  await expect(page.locator(".catalog-card")).toHaveCount(suiteIds.length);
  await page.getByRole("navigation", {name:"首页导航"}).getByRole("link", {name:"使用方式",exact:true}).click();
  await expect(page.getByRole("heading",{name:"使用方式",exact:true})).toBeVisible();
  await page.getByRole("navigation", {name:"首页导航"}).getByRole("link", {name:"设计系统",exact:true}).click();
  for (const width of [1334,924,390]) {
    await page.setViewportSize({width,height:906});
    await noOverflow(page);
    for (const id of suiteIds) {
      const card = page.locator(`[data-suite-id="${id}"]`);
      const image = card.locator(".suite-cover__image");
      await image.scrollIntoViewIfNeeded();
      await expect.poll(() => image.evaluate(img => img.complete && img.naturalWidth > 0)).toBe(true);
      const rect = await card.locator(".suite-cover").boundingBox();
      expect(rect.width / rect.height).toBeCloseTo(1140 / 720,2);
      await expect(card.getByRole("button",{name:/进入 /})).toBeVisible();
    }
  }
  await page.getByRole("textbox",{name:"搜索全部套系"}).fill("Quiet Workspace");
  await expect(page.locator(".catalog-card")).toHaveCount(1);
  await page.getByRole("button",{name:"进入 Quiet Workspace",exact:true}).click();
  await expect(page.getByRole("heading",{name:"组件目录",exact:true})).toBeVisible();
  await page.goBack();
  await expect(page.locator(".catalog-card")).toHaveCount(suiteIds.length);
});

test("组件封面导出保留 1140×720 固定画幅和完整结构", async ({page}) => {
  const scenes = {
    "folio-workspace": { name: "folio-components", regions: ".fw-cover-collection > *" },
    "quiet-workspace": { name: "quiet-components", regions: ".qw-cover-collection > *" },
    "midnight-ledger": { name: "ledger-components", regions: ".ml-cover-collection > *" },
    "clearline-console": { name: "clear-components", regions: ".cc-cover-collection > *" },
    "signal-studio": { name: "signal-components", regions: ".ss-cover-collection > *" },
    "orchard-ui": { name: "orchard-ui", regions: ".ou-collection > .ou-collection-column" },
    "dialogue-ui": { name: "dialogue-components", regions: ".du-cover-collection > *" },
  };
  // 导出页是固定尺寸截图入口；手机响应式由上面的首页场景卡片测试负责。
  const width = 1334;
  {
    await page.setViewportSize({ width, height: 906 });
    await noOverflow(page);
    for (const [id, scene] of Object.entries(scenes)) {
      await page.goto(`/#/cover/${id}`);
      const cover = page.locator(".cover-export .suite-cover");
      await expect(cover.locator("[data-cover-scene]")).toHaveAttribute("data-cover-scene", scene.name);
      // ResizeObserver 缩放完成后，关键内容应完整处于公共画幅和各自面板内。
      await expect.poll(() => cover.evaluate((el, regions) => {
        const bounds = el.getBoundingClientRect();
        const elements = [...el.querySelectorAll(regions)];
        return elements.length > 0 && elements.every(region => {
          const rect = region.getBoundingClientRect();
          const panel = region.closest('.ml-panel')?.getBoundingClientRect() ?? bounds;
          return rect.width > 0 && rect.height > 0 && rect.top >= bounds.top - 1 && rect.left >= bounds.left - 1 && rect.bottom <= Math.min(bounds.bottom, panel.bottom) + 1 && rect.right <= Math.min(bounds.right, panel.right) + 1;
        });
      }, scene.regions), { message: `${id} 在 ${width}px 下关键内容不可裁切` }).toBe(true);
      const rect = await cover.boundingBox();
      expect(rect.width / rect.height).toBeCloseTo(1140 / 720, 2);
    }
  }
});

for (const id of workflowSuiteIds) test(`${id} 表单保存与浮层键盘生命周期`, async ({ page }) => {
  const driver = { p: page, goto: url => page.goto(url), id };
  await settingsFlow(driver);
  await overlayFlow(driver);
});

for (const id of workflowSuiteIds) test(`${id} 选择框和滑块保持原生键盘语义`, async ({ page }) => {
  await page.goto(`/#/systems/${id}/playground`);
  const scenario=page.getByRole('combobox',{name:'场景状态',exact:true});
  if(await page.evaluate(()=>CSS.supports('appearance','base-select'))) expect(await scenario.evaluate(node=>getComputedStyle(node).appearance)).toBe('base-select');
  await scenario.selectOption('loading');
  await expect(page.getByRole('button',{name:'保存设置',exact:true})).toBeDisabled();
  await scenario.selectOption('default');
  await expect(page.getByRole('button',{name:'保存设置',exact:true})).toBeEnabled();
  await page.goto(`/#/systems/${id}/components/slider`);
  const slider=page.getByRole('slider',{name:'预览比例',exact:true});
  await slider.focus();await slider.press('ArrowRight');await expect(slider).toHaveValue('45');
  await slider.press('End');await expect(slider).toHaveValue('100');
  await slider.press('Home');await expect(slider).toHaveValue('0');
});

for (const width of [320, 390, 720, 859]) test(`${width}px 首页、比较与套系工作流布局`, async ({ page }) => {
  await page.setViewportSize({ width, height: width === 720 ? 450 : 844 });
  for (const route of ["/#/systems", "/#/usage", "/#/compare", ...workflowSuiteIds.map(id => `/#/systems/${id}/workflows`), ...knowledgeSuiteIds.map(id => `/#/systems/${id}/overview`)]) {
    await page.goto(route);
    await expect(page.getByRole("heading").first()).toBeVisible();
    if (route.endsWith("workflows")) await expect(page.getByRole("searchbox", { name: "筛选任务列表" })).toBeVisible();
    if (route.endsWith("compare")) await expect(page.getByRole("heading", { name: "月度经营复盘", exact: true })).toBeVisible();
    await noOverflow(page);
    if (width === 320 && route.endsWith("compare")) {
      // 用较宽的回退字体覆盖平台字体差异，套系选择器仍应留在页面内。
      await page.locator(".comparison-controls").evaluate(el => { el.style.fontFamily = "monospace"; });
      await noOverflow(page);
    }
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
  await page.goto("/#/usage");
  await page.getByRole("button", {name:"手动接入", exact:true}).click();
  await expect(page.getByRole("heading", { name: "接入你的项目" })).toBeVisible();
  await expect(page.locator(".onboarding-source pre")).toContainText("npm pack");
  await expect(page.locator(".onboarding-steps")).toContainText("npm run dev");
  const download = page.waitForEvent("download");
  await page.getByRole("button", { name: "下载接入说明" }).click();
  expect((await download).suggestedFilename()).toBe("integration.md");
});
