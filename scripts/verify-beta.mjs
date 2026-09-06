import { readFile, writeFile, mkdtemp, mkdir } from "node:fs/promises";
import { resolve, join, relative, isAbsolute } from "node:path";
import { tmpdir } from "node:os";
import { createHash } from "node:crypto";
import { spawnSync } from "node:child_process";

const directory = process.argv.find(arg => arg.startsWith("--dir="))?.slice(6);
if (!directory || !process.env.npm_execpath) throw new Error("使用 npm run test:beta -- --dir=候选交付目录");
const release = resolve(directory);
const manifest = JSON.parse(await readFile(join(release, "release-manifest.json"), "utf8"));
const checksumLines = (await readFile(join(release, "SHA256SUMS.txt"), "utf8")).trim().split(/\r?\n/);
for (const line of checksumLines) {
  const match = /^([a-f0-9]{64})  (.+)$/.exec(line);
  if (!match) throw new Error("校验清单格式错误");
  const location = resolve(release, match[2]);
  const within = relative(release, location);
  if (within.startsWith("..") || isAbsolute(within)) throw new Error("校验路径超出候选目录");
  if (createHash("sha256").update(await readFile(location)).digest("hex") !== match[1]) throw new Error("文件已变化：" + match[2]);
}
const verifiedNames = new Set(checksumLines.map(line => line.slice(66)));
function run(command, args, cwd) {
  const result = spawnSync(command, args, { cwd, encoding: "utf8" });
  if (result.status !== 0) throw new Error(result.stderr || result.stdout || "验证命令失败");
  return result.stdout;
}
const results = [];
for (const id of manifest.suites) {
  if (!/^[a-z][a-z0-9-]+$/.test(id)) throw new Error("无效套系 ID");
  const filename = `ui-design-lab-starter-${id}-${manifest.version}.tgz`;
  if (!verifiedNames.has(filename)) throw new Error("Starter 缺少文件校验：" + filename);
  const archive = join(release, filename);
  const entries = run("tar", ["-tzf", archive], release).trim().split(/\r?\n/);
  if (entries.some(path => isAbsolute(path) || path.split(/[\\/]/).includes(".."))) throw new Error("Starter 含越界归档路径");
  const target = await mkdtemp(join(tmpdir(), `ui-lab-beta-${id}-`));
  run("tar", ["-xzf", archive, "-C", target], release);
  const pkg = JSON.parse(await readFile(join(target, "package.json"), "utf8"));
  if (pkg.dependencies["ui-design-lab"] !== `file:vendor/ui-design-lab-${manifest.version}.tgz`) throw new Error("Starter 仍依赖外部路径");
  run(process.execPath, [process.env.npm_execpath, "install", "--ignore-scripts", "--no-audit", "--no-fund"], target);
  const dataFile = join(target, "src/workbench/demo-data.js");
  const original = await readFile(dataFile, "utf8");
  if (!original.includes("季度客户洞察")) throw new Error("待修改的示例任务不存在");
  await writeFile(dataFile, original.replace("季度客户洞察", `Beta 字段验收 ${id}`));
  run(process.execPath, [process.env.npm_execpath, "run", "build"], target);
  results.push({ suiteId: id, directory: target, changedTask: `Beta 字段验收 ${id}`, installed: true, built: true });
  console.log(`${id}：校验、仓库外解压、相对依赖安装、修改字段与构建通过`);
}
await mkdir(".local-cache", { recursive: true });
await writeFile(".local-cache/beta-consumers.json", JSON.stringify({ release, version: manifest.version, checkedAt: new Date().toISOString(), filesVerified: checksumLines.length, consumers: results }, null, 2) + "\n");
console.log("可复查的独立目录：.local-cache/beta-consumers.json");
