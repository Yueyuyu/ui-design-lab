import { test } from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, mkdir, cp, readFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { resolve, relative } from "node:path";
import { spawnSync } from "node:child_process";
import { createServer } from "vite";

test("脚手架产生有效草案，第三套系可自动发现且明确不支持比较", async () => {
  const root = process.cwd();
  const temporary = await mkdtemp(resolve(tmpdir(), "ui-design-lab-scaffold-"));
  let server;
  try {
    await mkdir(resolve(temporary, "systems"));
    await cp(resolve(root, "schemas"), resolve(temporary, "schemas"), { recursive: true });
    await mkdir(resolve(temporary, "src/registry"), { recursive: true });
    await cp(resolve(root, "src/registry/suites.js"), resolve(temporary, "src/registry/suites.js"));
    const run = (script, args = []) => {
      const result = spawnSync(process.execPath, [resolve(root, script), ...args], { cwd: temporary, encoding: "utf8" });
      assert.equal(result.status, 0, result.stderr || result.stdout);
      return result.stdout;
    };
    for (const [id, prefix] of [["alpha-workspace", "aa"], ["beta-ledger", "bb"], ["gamma", "cc"]]) {
      run("scripts/create-suite.mjs", [id, "--name=" + id, "--zh=测试套系", "--prefix=" + prefix]);
    }
    assert.match(run("scripts/validate-suites.mjs"), /3 套/);
    const manifest = JSON.parse(await readFile(resolve(temporary, "systems/gamma/suite.json"), "utf8"));
    assert.equal(manifest.status, "draft");
    assert.equal(manifest.comparison, null);
    server = await createServer({ root: temporary, configFile: false, server: { middlewareMode: true }, appType: "custom" });
    const registry = await server.ssrLoadModule("/src/registry/suites.js");
    assert.equal(registry.suites.length, 3);
    assert.equal(registry.getSuiteById("gamma").loadComparison, null);
    assert.equal(typeof registry.getSuiteById("gamma").loadShowcase, "function");
  } finally {
    await server?.close();
    // 只清理由本测试创建、且仍位于系统临时目录下的目录。
    const within = relative(resolve(tmpdir()), temporary);
    assert.ok(!within.startsWith("..") && within.startsWith("ui-design-lab-scaffold-"));
    await rm(temporary, { recursive: true, force: true });
  }
});
