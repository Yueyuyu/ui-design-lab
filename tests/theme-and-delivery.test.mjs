import test from "node:test";
import assert from "node:assert/strict";
import { readFile, mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { parse } from "@babel/parser";
import { defaults, validateTheme, themeCSS, contrast } from "../src/gallery/workbench/theme-config.js";
import { businessExample } from "../src/gallery/workbench/usage-example.js";
import { starterFiles } from "../scripts/lib/starter-files.mjs";
import { ledgerFormat } from "../systems/midnight-ledger/web/format.js";

for (const id of ["quiet-workspace", "midnight-ledger", "clearline-console", "signal-studio"]) {
  const suite = JSON.parse(await readFile(new URL(`../systems/${id}/suite.json`, import.meta.url), "utf8"));
  test(id + " 主题往返与不安全输入拒绝", () => {
    const value = defaults(suite);
    assert.deepEqual(validateTheme(JSON.parse(JSON.stringify(value)), suite), value);
    assert.ok(themeCSS(value).includes(`[data-ui-system="${id}"]`));
    assert.throws(() => validateTheme({ ...value, suiteVersion: "unknown" }, suite));
    assert.throws(() => validateTheme({ ...value, values: { ...value.values, "--foreign-token": "red" } }, suite));
    const color = suite.themeControls.find(c => c.type === "color");
    assert.throws(() => validateTheme({ ...value, values: { ...value.values, [color.token]: "red; background:url(example)" } }, suite));
    parse(businessExample(suite), { sourceType: "module", plugins: ["jsx"] });
  });
}

test("指标格式保留符号、精度及未知含义", () => {
  assert.equal(ledgerFormat(NaN), "—");
  assert.equal(ledgerFormat(.125, { kind: "percent", digits: 1 }), "12.5%");
  assert.equal(ledgerFormat(-10, { digits: 0, sign: true }), "-10");
  assert.equal(ledgerFormat(12, { digits: 0, sign: true }), "+12");
  assert.equal(contrast("#000000", "#ffffff"), 21);
});

test("Starter 独立四套导入并拒绝覆盖已有目录", async () => {
  const parent = await mkdtemp(join(tmpdir(), "ui-lab-starter-test-"));
  try {
    const target = join(parent, "new-project");
    const archive = join(parent, "fixture-package.tgz");
    await writeFile(archive, "测试包复制，不用于安装");
    const ids = await starterFiles(target, undefined, { packageFile: archive });
    assert.equal(ids.length, 4);
    const entry = await readFile(join(target, "src/main.jsx"), "utf8");
    for (const id of ids) assert.ok(entry.includes(`ui-design-lab/${id}`));
    assert.ok(!entry.includes("src/gallery"));
    const manifest = JSON.parse(await readFile(join(target, "package.json"), "utf8"));
    assert.equal(manifest.dependencies["ui-design-lab"], "file:vendor/fixture-package.tgz");
    assert.equal(await readFile(join(target, "vendor/fixture-package.tgz"), "utf8"), "测试包复制，不用于安装");
    await assert.rejects(starterFiles(join(parent, "missing"), undefined, { packageFile: join(parent, "missing.tgz") }), /组件包不存在/);
    await writeFile(join(target, "keep.txt"), "保留");
    await assert.rejects(starterFiles(target), /目标目录已存在/);
    assert.equal(await readFile(join(target, "keep.txt"), "utf8"), "保留");
  } finally {
    // parent 是本测试 mkdtemp 独占创建的临时目录。
    await rm(parent, { recursive: true, force: true });
  }
});
