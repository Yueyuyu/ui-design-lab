import { readFile, readdir, mkdir, writeFile, cp, access } from "node:fs/promises";
import { resolve, basename } from "node:path";
import { fileURLToPath } from "node:url";
export const root = resolve(fileURLToPath(new URL("../../", import.meta.url)));
export async function starterFiles(target, selectedId, {
  existing = false,
  packageFile
} = {}) {
  if (!existing) {
    try {
      await access(target);
      throw Error("目标目录已存在，请选择新目录以保留已有文件。");
    } catch (error) {
      if (error.code !== "ENOENT") throw error;
    }
  }
  const manifests = [];
  for (const entry of await readdir(resolve(root, "systems"), {
    withFileTypes: true
  })) {
    if (!entry.isDirectory()) continue;
    const m = JSON.parse(await readFile(resolve(root, "systems", entry.name, "suite.json"), "utf8"));
    if (m.status !== "draft") manifests.push(m);
  }
  if (selectedId && !manifests.some(m => m.id === selectedId)) throw Error("套系不存在或仍为草案：" + selectedId);
  const chosen = selectedId ? manifests.filter(m => m.id === selectedId) : manifests;
  const packageManifest = JSON.parse(await readFile(resolve(root, "package.json"), "utf8"));
  const archive = resolve(packageFile ?? resolve(root, `ui-design-lab-${packageManifest.version}.tgz`));
  try { await access(archive); }
  catch { throw new Error("组件包不存在，请先在 UI Design Lab 运行 npm pack：" + archive); }
  // 随项目携带组件包，避免交付后仍引用开发机器的绝对路径。
  await mkdir(resolve(target, "vendor"), { recursive: true });
  await cp(archive, resolve(target, "vendor", basename(archive)));
  await mkdir(resolve(target, "src/workbench"), {
    recursive: true
  });
  for (const name of ["WorkflowDemo.jsx", "demo-data.js", "useTaskSimulation.js"]) await cp(resolve(root, "src/gallery/workbench", name), resolve(target, "src/workbench", name));
  for (const name of ["SettingsPlayground.jsx", "useSavedForm.js"]) await cp(resolve(root, "src/gallery", name), resolve(target, "src", name));
  const generics = ["Button", "Field", "Select", "Toggle", "Textarea", "Checkbox", "DateRange", "Shell", "DataTable", "Drawer", "Popover", "Progress"];
  const imports = chosen.map((m, i) => 'import * as Kit' + i + ' from "ui-design-lab/' + m.id + '";\nimport "ui-design-lab/' + m.id + '/tokens.css";\nimport "ui-design-lab/' + m.id + '/components.css";').join("\n");
  const configs = chosen.map((m, i) => {
    const N = m.componentPrefix ?? (m.prefix === "qw" ? "Quiet" : "Ledger");
    return '{id:"' + m.id + '",name:"' + m.displayName + '",ui:{' + generics.map(k => k + ':Kit' + i + '.' + N + k).join(",") + ',Panel:Kit' + i + '.' + N + (m.prefix === "qw" ? "Card" : "Panel") + ',Chart:Kit' + i + '.' + N + 'BarChart' + (m.prefix === "qw" ? ',Quota:Kit' + i + '.QuietQuotaPill,TaskLight:Kit' + i + '.QuietTaskLight,FileUpload:Kit' + i + '.QuietFileUpload,Tree:Kit' + i + '.QuietTree' : "") + (m.prefix === "ml" ? ",format:Kit" + i + ".ledgerFormat" : "") + "}}";
  }).join(",");
  const main = 'import {useState} from "react";\nimport {createRoot} from "react-dom/client";\nimport {WorkflowDemo} from "./workbench/WorkflowDemo.jsx";\nimport "./style.css";\n' + imports + '\nconst systems=[' + configs + '];\nfunction App(){const [id,setId]=useState(systems[0].id),[kind,setKind]=useState("tasks");const suite=systems.find(s=>s.id===id);return <main><h1>独立项目工作台</h1><p>安装的 ESM 组件包 · 无 Gallery 依赖 · 明确的本地模拟接口</p><label>设计套系<select value={id} onChange={e=>setId(e.target.value)}>{systems.map(s=><option key={s.id} value={s.id}>{s.name}</option>)}</select></label><label>业务场景<select value={kind} onChange={e=>setKind(e.target.value)}><option value="tasks">任务与用量</option><option value="research">研究与内容</option><option value="reports">运营报表</option></select></label><section data-ui-system={id} data-density="comfortable"><WorkflowDemo key={id+kind} ui={suite.ui} suiteId={id} kind={kind}/></section></main>;}\ncreateRoot(document.getElementById("root")).render(<App/>);\n';
  await writeFile(resolve(target, "src/main.jsx"), main);
  await writeFile(resolve(target, "src/style.css"), 'body{margin:0;background:#f3f5f2;font:14px/1.6 system-ui;color:#26332c}body>div>main{max-width:1300px;margin:auto;padding:24px}select,input,textarea,button{font:inherit}select{margin:8px;padding:8px}.workflow-demo{margin-top:24px}.workbench-actions{display:flex;gap:10px;flex-wrap:wrap;margin:16px 0}.research-layout{display:grid;grid-template-columns:220px 1fr;gap:20px}.settings-playground form{display:grid;gap:16px}.playground-actions{display:flex;gap:10px}.workbench-boundary{font-size:13px} @media(max-width:700px){.research-layout{grid-template-columns:1fr}body>div>main{padding:12px}}');
  await writeFile(resolve(target, "index.html"), '<!doctype html><html lang="zh-CN"><head><meta charset="utf-8"/><meta name="viewport" content="width=device-width, initial-scale=1.0"/><title>UI Design Lab 独立工作台</title></head><body><div id="root"></div><script type="module" src="/src/main.jsx"></script></body></html>');
  await writeFile(resolve(target, "vite.config.mjs"), 'import {defineConfig} from "vite";\nimport react from "@vitejs/plugin-react";\nexport default defineConfig({plugins:[react()]});\n');
  await writeFile(resolve(target, "package.json"), JSON.stringify({
    name: "ui-design-lab-starter",
    version: "1.0.0",
    private: true,
    type: "module",
    scripts: {
      dev: "vite --host 127.0.0.1",
      build: "vite build"
    },
    dependencies: {
      react: "19.2.0",
      "react-dom": "19.2.0",
      "ui-design-lab": "file:vendor/" + basename(archive)
    },
    devDependencies: {
      vite: "6.4.2",
      "@vitejs/plugin-react": "5.0.4",
      typescript: "^5.9.3",
      "@types/react": "^19.2.0",
      "@types/react-dom": "^19.2.0"
    }
  }, null, 2) + "\n");
  await cp(resolve(root, "LICENSE"), resolve(target, "LICENSE"));
  await cp(resolve(root, "NOTICE.md"), resolve(target, "NOTICE.md"));
  await writeFile(resolve(target, "README.md"), `# 独立工作台\n\nUI Design Lab ${packageManifest.version} · Node.js 22+ · React 19.2\n\n组件包已随 vendor/ 交付，可将整个目录复制到其他机器。\n\n1. 在本目录执行 npm install。\n2. 执行 npm run dev，打开终端显示的地址。\n3. 修改 src/workbench/demo-data.js 中的任务名，再查看列表与详情。\n4. 修改 src/workbench/WorkflowDemo.jsx 的列定义，增加业务字段。\n5. 执行 npm run build，部署 dist/。\n\n接口边界见 WorkflowDemo 的本地模拟实现；没有生产认证、持久存储或支付。组件来自已安装的 ui-design-lab 子路径，数据与页面文件由你的项目持有。保留 LICENSE 和 NOTICE.md。\n`);
  return chosen.map(m => m.id);
}
