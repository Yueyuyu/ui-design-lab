import { chromium } from "@playwright/test";
import { readdir, readFile, writeFile, mkdir } from "node:fs/promises";

// 显式运行 npm run covers 时更新封面；日常 CI 不改写视觉资产。
const browser = await chromium.launch();
const selectedId = process.argv.find(arg => arg.startsWith('--suite='))?.slice(8);
try {
  const page = await browser.newPage({ viewport: { width: 1140, height: 720 }, deviceScaleFactor: 1 });
  await mkdir("references/thumbnails", { recursive: true });
  for (const entry of await readdir("systems", { withFileTypes: true })) {
    if (!entry.isDirectory()) continue;
    const path = `systems/${entry.name}/suite.json`;
    const suite = JSON.parse(await readFile(path, "utf8"));
    if (selectedId && suite.id !== selectedId) continue;
    // 显式选中可捕获 draft 的真实组件，作为状态升级前的验收材料。
    if (suite.status === "draft" && suite.id !== selectedId) continue;
    await page.goto(`http://127.0.0.1:5173/#cover/${suite.id}`);
    await page.locator(".suite-cover [data-cover-scene]").waitFor();
    await page.evaluate(() => document.fonts.ready);
    await page.locator('.suite-cover img').evaluateAll(images => Promise.all(images.map(img => img.decode())));
    const thumbnail = `references/thumbnails/${suite.id}.png`;
    await page.screenshot({ path: thumbnail });
    suite.selection.thumbnail = thumbnail;
    await writeFile(path, JSON.stringify(suite, null, 2) + "\n");
    console.log(thumbnail);
  }
} finally { await browser.close(); }
