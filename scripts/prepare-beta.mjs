import { readFile, mkdir, mkdtemp, cp, writeFile, readdir } from "node:fs/promises";
import { resolve, join } from "node:path";
import { spawnSync } from "node:child_process";
import { createHash } from "node:crypto";
import { starterFiles, root } from "./lib/starter-files.mjs";

const npmCli = process.env.npm_execpath;
if (!npmCli) throw new Error("请通过 npm run release:prepare 生成候选交付包。");
function run(command, args, cwd = root) {
  const result = spawnSync(command, args, { cwd, encoding: "utf8" });
  if (result.status !== 0) throw new Error(result.stderr || result.stdout || `${command} 执行失败`);
  return result.stdout;
}
const npm = (args, cwd) => run(process.execPath, [npmCli, ...args], cwd);
const manifest = JSON.parse(await readFile(join(root, "package.json"), "utf8"));
if (!manifest.private || !manifest.version.includes("-beta.")) throw new Error("候选交付要求 private 包与明确的 Beta 版本。");
const packed = JSON.parse(npm(["pack", "--ignore-scripts", "--json"]))[0];
const packageFile = join(root, packed.filename);
await mkdir(join(root, "dist/releases"), { recursive: true });
// 每次生成独立候选目录，避免覆盖用户已经送测的版本。
const output = await mkdtemp(join(root, `dist/releases/${manifest.version}-`));
await cp(packageFile, join(output, packed.filename));
await mkdir(join(root, ".local-cache"), { recursive: true });
const staging = await mkdtemp(join(root, ".local-cache/beta-staging-"));
const ids = [];
for (const entry of await readdir(join(root, "systems"), { withFileTypes: true })) {
  if (!entry.isDirectory()) continue;
  const suite = JSON.parse(await readFile(join(root, "systems", entry.name, "suite.json"), "utf8"));
  if (suite.status === "draft") continue;
  ids.push(suite.id);
  const target = join(staging, suite.id);
  await starterFiles(target, suite.id, { packageFile });
  const filename = `ui-design-lab-starter-${suite.id}-${manifest.version}.tgz`;
  run("tar", ["-czf", join(output, filename), "-C", target, "."]);
}
run("tar", ["-czf", join(output, `ui-design-lab-site-${manifest.version}.tgz`), "-C", join(root, "dist/client"), "."]);
await mkdir(join(output, "docs"));
for (const file of ["LICENSE", "NOTICE.md", "QUICKSTART.md", "COMPATIBILITY.md", "RELEASE.md"]) await cp(join(root, file), join(output, file));
for (const file of ["BETA-TRIAL.md", "BETA-NOTES.md", "SCENARIO-DELIVERY.md", "COMMERCIAL.md"]) await cp(join(root, "docs", file), join(output, "docs", file));
await cp(join(root, "docs/templates"), join(output, "docs/templates"), { recursive: true });
await writeFile(join(output, "START-HERE.md"), `# UI Design Lab ${manifest.version}\n\n这是本地生成的 Beta 候选交付，不代表已公开发布。\n\n## 开始试用\n\n选择 ui-design-lab-starter-<套系>-${manifest.version}.tgz，将它解压到空目录。\n在解压后的目录执行 npm install，再执行 npm run dev。组件包位于 vendor/，无需获取原开发机器的文件。\n修改 src/workbench/demo-data.js 中的任务名称，再修改 WorkflowDemo.jsx 的列定义。完成后运行 npm run build。\n\n## 文件用途\n\n- ${packed.filename}：供已有 React 19 项目安装。\n- starter-*.tgz：各套独立项目及随附组件包。\n- site-*.tgz：Gallery 静态站，解压后交给静态托管。\n- docs/BETA-TRIAL.md：试用任务与反馈方式。\n- docs/templates：空白试用与订单记录，不代表已有用户或收入。\n- SHA256SUMS.txt：核对实际交付文件的完整性。\n\n运行要求：Node.js 22+、React 19.2。数据和业务服务为本地模拟，详见交付边界与授权。\n`);
const records = [];
async function digest(dir, prefix = "") {
  for (const item of await readdir(dir, { withFileTypes: true })) {
    const name = prefix + item.name;
    if (item.isDirectory()) await digest(join(dir, item.name), name + "/");
    else records.push({ path: name, sha256: createHash("sha256").update(await readFile(join(dir, item.name))).digest("hex") });
  }
}
await digest(output);
await writeFile(join(output, "release-manifest.json"), JSON.stringify({ version: manifest.version, channel: "beta", createdAt: new Date().toISOString(), suites: ids, published: false, files: records }, null, 2) + "\n");
records.push({ path: "release-manifest.json", sha256: createHash("sha256").update(await readFile(join(output, "release-manifest.json"))).digest("hex") });
await writeFile(join(output, "SHA256SUMS.txt"), records.map(r => `${r.sha256}  ${r.path}`).join("\n") + "\n");
console.log("Beta 候选交付目录：" + output);
