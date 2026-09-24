import { readFile, readdir, mkdir, writeFile, appendFile } from "node:fs/promises";
import { resolve } from "node:path";
import { build } from "vite";
import react from "@vitejs/plugin-react";

const entries = {};
for (const dir of await readdir("systems", { withFileTypes: true })) {
  if (!dir.isDirectory()) continue;
  const manifest = JSON.parse(await readFile(resolve("systems", dir.name, "suite.json"), "utf8"));
  if (manifest.status === "draft") continue;
  entries[manifest.id] = resolve("systems", manifest.id, manifest.components);
}
await build({
  configFile: false,
  // 库包只分发组件；网站下载目录不能再次进入自身的安装包。
  publicDir: false,
  plugins: [react()],
  build: {
    outDir: "dist/package", emptyOutDir: true,
    lib: { entry: entries, formats: ["es"], fileName: (_format, name) => name + ".js" },
    rollupOptions: { external: (id) => /^(react|react-dom|@phosphor-icons\/react)(\/|$)/.test(id) },
  },
});
// 根入口只重导出已构建套系，保持每个套系的独立子路径可被 tree-shake。
const namespace = (id) => id.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase());
await mkdir("dist/package", { recursive: true });
await writeFile("dist/package/index.js", Object.keys(entries).map((id) => `export * as ${namespace(id)} from "./${id}.js";`).join("\n") + "\n");
await writeFile("dist/package/index.d.ts", Object.keys(entries).map((id) => `export * as ${namespace(id)} from "../../systems/${id}/web/index.js";`).join("\n") + "\n");
const suiteIds = Object.fromEntries(Object.keys(entries).map((id) => [namespace(id), id]));
await appendFile("dist/package/index.js", `export const suiteIds = Object.freeze(${JSON.stringify(suiteIds)});\n`);
await appendFile("dist/package/index.d.ts", `export declare const suiteIds: Readonly<${JSON.stringify(suiteIds)}>;\n`);
// 分发路径与本次构建来源相同，草案或已移除套系不残留公开入口。
const packagePath = resolve("package.json");
const packageJson = JSON.parse(await readFile(packagePath, "utf8"));
packageJson.exports = { ".": { types: "./dist/package/index.d.ts", import: "./dist/package/index.js" } };
for (const id of Object.keys(entries)) {
  packageJson.exports["./" + id] = { types: "./systems/" + id + "/web/index.d.ts", import: "./dist/package/" + id + ".js" };
  packageJson.exports["./" + id + "/tokens.css"] = "./systems/" + id + "/foundations/tokens.css";
  packageJson.exports["./" + id + "/components.css"] = "./systems/" + id + "/web/components.css";
  // 图像保持独立资源，按显式发布清单导出；不内联进组件 JS。
  const assets = await readdir(resolve('systems', id, 'assets'), { withFileTypes: true }).catch(error => {
    if (error.code === 'ENOENT') return [];
    throw error;
  });
  for (const asset of assets) {
    if (!asset.isFile()) continue;
    const extension = asset.name.split('.').at(-1);
    if (!packageJson.files.some(pattern => pattern === `systems/*/assets/*.${extension}` || pattern === `systems/${id}/assets/*.${extension}`)) continue;
    packageJson.exports[`./${id}/assets/${asset.name}`] = `./systems/${id}/assets/${asset.name}`;
  }
}
await writeFile(packagePath, JSON.stringify(packageJson, null, 2) + "\n");
console.log("组件包已构建：" + Object.keys(entries).join(", "));
