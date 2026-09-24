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
import { readdirSync, readFileSync } from "node:fs";

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

test("Starter 按各套真实入口导入并拒绝覆盖已有目录", async () => {
  const parent = await mkdtemp(join(tmpdir(), "ui-lab-starter-test-"));
  try {
    const target = join(parent, "new-project");
    const archive = join(parent, "fixture-package.tgz");
    await writeFile(archive, "测试包复制，不用于安装");
    const ids = await starterFiles(target, undefined, { packageFile: archive });
    const expectedIds = readdirSync(new URL('../systems/', import.meta.url), {withFileTypes:true}).filter(entry=>entry.isDirectory()).map(entry=>entry.name).filter(id => JSON.parse(readFileSync(new URL(`../systems/${id}/suite.json`, import.meta.url))).status !== 'draft');
    assert.deepEqual([...ids].sort(), expectedIds.sort());
    const entry = await readFile(join(target, "src/main.jsx"), "utf8");
    for (const id of ids) assert.ok(entry.includes(`ui-design-lab/${id}`));
    assert.ok(!entry.includes("src/gallery"));
    if (ids.includes('folio-workspace')) { assert.ok(entry.includes('.FolioWorkspace')); assert.ok(!entry.includes('.FolioDataTable')); }
    parse(entry, { sourceType: 'module', plugins: ['jsx'] });
    if (ids.includes('folio-workspace')) {
      const folioTarget=join(parent,'folio-only');
      await starterFiles(folioTarget, 'folio-workspace', {packageFile:archive});
      const folioEntry=await readFile(join(folioTarget,'src/main.jsx'),'utf8');
      parse(folioEntry, {sourceType:'module',plugins:['jsx']});
      assert.ok(folioEntry.includes('.FolioWorkspace'));
      assert.ok(!folioEntry.includes('WorkflowDemo'));
      assert.ok(!folioEntry.includes('setKind'));
      await assert.rejects(readFile(join(folioTarget,'src/workbench/demo-data.js')), {code:'ENOENT'});
      const folioReadme=await readFile(join(folioTarget,'README.md'),'utf8');
      assert.ok(folioReadme.includes('\n4. 在 src/main.jsx'));
    }
    const manifest = JSON.parse(await readFile(join(target, "package.json"), "utf8"));
    for (const [id, kitId, component] of [['clearline-console','projects','ClearProjectWorkspace'],['signal-studio','content','SignalContentBoard']]) {
      const workspace = join(parent, id);
      await starterFiles(workspace, id, { packageFile: archive, kitId });
      const entry = await readFile(join(workspace, 'src/main.jsx'), 'utf8');
      parse(entry, { sourceType:'module', plugins:['jsx'] });
      assert.ok(entry.includes('.' + component));
      assert.ok(!entry.includes('WorkflowDemo'));
      assert.ok((await readFile(join(workspace, 'integration.md'), 'utf8')).includes('AbortSignal'));
    }
    const research = join(parent, 'research-starter');
    await starterFiles(research, 'quiet-workspace', { packageFile: archive, kitId:'research' });
    assert.ok((await readFile(join(research, 'src/main.jsx'), 'utf8')).includes('useState("research")'));
    await assert.rejects(starterFiles(join(parent, 'wrong-kit'), 'folio-workspace', {packageFile:archive,kitId:'projects'}), /场景与套系不匹配/);
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
