import { chromium } from "@playwright/test";
import { readdir, readFile, writeFile, mkdir } from "node:fs/promises";

// 显式运行 npm run covers 时更新封面；日常 CI 不改写视觉资产。
const browser = await chromium.launch();
try {
  const page = await browser.newPage({ viewport: { width: 800, height: 400 }, deviceScaleFactor: 1 });
  await mkdir("references/thumbnails", { recursive: true });
  for (const entry of await readdir("systems", { withFileTypes: true })) {
    if (!entry.isDirectory()) continue;
    const path = `systems/${entry.name}/suite.json`;
    const suite = JSON.parse(await readFile(path, "utf8"));
    if (suite.status === "draft") continue;
    await page.goto(`http://127.0.0.1:5173/#cover/${suite.id}`);
    await page.locator(`.suite-cover .${suite.prefix}-shell`).waitFor();
    await page.evaluate(() => document.fonts.ready);
    const thumbnail = `references/thumbnails/${suite.id}.png`;
    await page.screenshot({ path: thumbnail });
    suite.selection.thumbnail = thumbnail;
    await writeFile(path, JSON.stringify(suite, null, 2) + "\n");
    console.log(thumbnail);
  }
} finally { await browser.close(); }
