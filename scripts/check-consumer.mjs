import { access, readFile, readdir } from 'node:fs/promises';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const args = process.argv.slice(2);
const option = name => args.find(arg => arg.startsWith('--' + name + '='))?.slice(name.length + 3);
const id = option('suite');
if (!id || !/^[a-z][a-z0-9]*(?:-[a-z0-9]+)*$/.test(id)) throw new Error('请提供 --suite=套系ID，可选 --source=src');
const root = fileURLToPath(new URL('../', import.meta.url));
const manifest = JSON.parse(await readFile(resolve(root, 'systems', id, 'suite.json'), 'utf8'));
const pkg = JSON.parse(await readFile(resolve(root, 'package.json'), 'utf8'));
for (const path of [manifest.components, manifest.tokensCss, manifest.tokens, manifest.tokenBindings, './web/components.css', './web/index.d.ts', './API.md', './DESIGN.md', ...manifest.capabilities.standards.map(name => './standards/' + name + '.md')]) await access(resolve(root, 'systems', id, path));
const entry = pkg.exports['./' + id];
if (!entry) throw new Error('套系没有公开包入口');
await access(resolve(root, entry.import));
await access(resolve(root, entry.types));
let imports = 0;
async function scan(directory) {
  for (const file of await readdir(directory, { withFileTypes: true })) {
    if (['node_modules', 'dist', '.git'].includes(file.name)) continue;
    const path = resolve(directory, file.name);
    if (file.isDirectory()) await scan(path);
    else if (/\.(?:[jt]sx?|css)$/.test(file.name)) {
      const text = await readFile(path, 'utf8');
      for (const match of text.matchAll(/(?:from\s*|import\s*(?:\(\s*)?|@import\s*)['"]ui-design-lab\/([^/'"]+)([^'"]*)['"]/g)) {
        if (match[1] !== id) throw new Error(path + ' 混入另一套系：' + match[1]);
        if (!pkg.exports['./' + match[1] + match[2]]) throw new Error(path + ' 使用不存在的公开入口');
        imports++;
      }
    }
  }
}
await scan(resolve(option('source') ?? 'src'));
if (!imports) throw new Error('未找到所选套系的静态导入；请检查 --source 或人工核对动态导入');
console.log(`${manifest.displayName} ${manifest.version}：包文件与 ${imports} 处静态导入通过。继续运行项目类型、构建、交互检查，并核对 ${manifest.scope}。`);
