import { test, expect } from "@playwright/test";

const file = (name = "notes.txt", size = 12) => ({ name, mimeType: name.endsWith(".txt") ? "text/plain" : "application/octet-stream", buffer: Buffer.alloc(size, 65) });
test.beforeEach(async ({ page }) => { await page.goto("/tests/browser/fixtures/upload.html"); });

test("文件选择器：失败重试、重复选择与文件约束", async ({ page }) => {
  await page.getByLabel("首次失败", { exact: true }).check();
  const chooserEvent = page.waitForEvent("filechooser");
  await page.getByLabel("上传文件", { exact: true }).click();
  await (await chooserEvent).setFiles(file());
  const row = page.locator("li").filter({ hasText: "notes.txt" }).first();
  await expect(row).toContainText("模拟存储失败");
  await row.getByRole("button", { name: "重试上传" }).click();
  await expect(row).toContainText("已完成");
  await expect(page.getByLabel("完成次数")).toHaveText("1");
  await page.getByLabel("上传文件", { exact: true }).setInputFiles(file());
  await expect(page.getByLabel("完成次数")).toHaveText("2");
  await page.getByLabel("上传文件", { exact: true }).setInputFiles([file("blocked.bin"), file("large.txt", 1024 * 1024 + 1)]);
  await expect(page.locator("li").filter({ hasText: "blocked.bin" })).toContainText("类型不受支持");
  await expect(page.locator("li").filter({ hasText: "large.txt" })).toContainText("超过 1 MB");
  await expect(page.getByLabel("完成次数")).toHaveText("2");
});

test("拖放事件：禁用拒绝、取消拒绝迟到结果、重试完成一次", async ({ page }) => {
  await page.getByLabel("忽略取消信号", { exact: true }).check();
  const transfer = await page.evaluateHandle(() => {
    const value = new DataTransfer();
    value.items.add(new File(["拖放测试资料"], "dropped.txt", { type: "text/plain" }));
    return value;
  });
  await page.getByLabel("禁用上传", { exact: true }).check();
  await page.locator(".qw-upload-drop").dispatchEvent("drop", { dataTransfer: transfer });
  await expect(page.locator("li")).toHaveCount(0);
  await page.getByLabel("禁用上传", { exact: true }).uncheck();
  await page.locator(".qw-upload-drop").dispatchEvent("drop", { dataTransfer: transfer });
  await page.getByRole("button", { name: "取消上传" }).click();
  await expect(page.locator("li")).toContainText("已取消");
  // 等到忽略取消的模拟适配器返回，确认迟到成功不会调用 onComplete。
  await page.waitForTimeout(1000);
  await expect(page.getByLabel("完成次数")).toHaveText("0");
  await page.getByRole("button", { name: "重试上传" }).click();
  await expect(page.locator("li")).toContainText("已完成");
  await expect(page.getByLabel("完成次数")).toHaveText("1");
  await transfer.dispose();
});

test("研究场景：文件导入完成后出现在资料目录", async ({ page }) => {
  await page.goto("/#/systems/quiet-workspace/workflows?kit=research");
  await page.getByRole("button", { name: "导入资料", exact: true }).click();
  await page.getByLabel("上传文件", { exact: true }).setInputFiles(file("beta-research.txt"));
  await expect(page.locator(".workflow-demo").getByText("已导入 beta-research.txt 的演示记录", { exact: true })).toBeVisible();
  await page.getByRole("button", { name: "项目与资料", exact: true }).click();
  await page.getByRole("navigation", { name: "资料目录" }).getByText("导入资料", { exact: true }).click();
  await expect(page.getByRole("button", { name: "beta-research.txt", exact: true })).toBeVisible();
});
