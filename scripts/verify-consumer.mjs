import { mkdtemp, cp, readFile, writeFile, appendFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { resolve } from "node:path";
import { spawnSync } from "node:child_process";

// 在仓库之外验证 tarball，避免父目录 node_modules 掩盖遗漏的包文件或依赖。
const npmCli = process.env.npm_execpath;
if (!npmCli) throw new Error("请通过 npm run test:consumer 执行，以复用当前 npm。");
function npm(args, cwd) {
  const result = spawnSync(process.execPath, [npmCli, ...args], { cwd, encoding: "utf8" });
  if (result.status !== 0) throw new Error(result.stderr || result.stdout);
  return result.stdout;
}
const root = process.cwd();
const packed = JSON.parse(npm(["pack", "--ignore-scripts", "--json"], root))[0];
const names = packed.files.map((entry) => entry.path);
if (!names.some((name) => name.startsWith("dist/package/")) || names.some((name) => /^(references|src|node_modules)\//.test(name))) throw new Error("分发文件范围不正确");
const packageManifest = JSON.parse(await readFile(resolve(root, "package.json"), "utf8"));
function checkExports(value) {
  if (typeof value === "string" && !names.includes(value.replace(/^\.\//, ""))) throw new Error("导出文件缺失：" + value);
  if (value && typeof value === "object") Object.values(value).forEach(checkExports);
}
checkExports(packageManifest.exports);
const consumerDir = await mkdtemp(resolve(tmpdir(), "ui-design-lab-consumer-"));
await cp(resolve(root, "examples/consumer"), consumerDir, { recursive: true, filter: (path) => !/[\\/](node_modules|dist)([\\/]|$)/.test(path) });
const manifestPath = resolve(consumerDir, "package.json");
const manifest = JSON.parse(await readFile(manifestPath, "utf8"));
manifest.dependencies["ui-design-lab"] = "file:" + resolve(root, packed.filename).replaceAll("\\", "/");
await writeFile(manifestPath, JSON.stringify(manifest, null, 2));
npm(["install", "--ignore-scripts", "--no-audit", "--no-fund"], consumerDir);
console.log(npm(["run", "test:types"], consumerDir));
console.log(npm(["run", "build"], consumerDir));
console.log("独立安装和构建通过：" + consumerDir);

if (process.env.GITHUB_ENV) await appendFile(process.env.GITHUB_ENV, "UI_LAB_CONSUMER_DIR=" + consumerDir + "\n");
