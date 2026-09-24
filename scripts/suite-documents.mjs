import { readFile, writeFile, readdir, access } from 'node:fs/promises';
import { resolve } from 'node:path';
import { kits } from '../src/gallery/kits.js';

const suites = [];
for (const directory of await readdir('systems', { withFileTypes: true })) {
  if (directory.isDirectory()) suites.push(JSON.parse(await readFile(resolve('systems', directory.name, 'suite.json'), 'utf8')));
}
suites.sort((a, b) => a.order - b.order);
const start = '<!-- suites:start -->', end = '<!-- suites:end -->';
const tables = {
  'DESIGN_SYSTEMS.md': ['| Suite ID | 名称 | 前缀 | 状态 | 入口 |', '|---|---|---|---|---|', ...suites.map(s => `| \`${s.id}\` | ${s.displayName} / ${s.localizedName} | \`${s.prefix}\` | ${s.status} | [suite.json](systems/${s.id}/suite.json) |`)],
  'COMPATIBILITY.md': ['| 套系 | Suite ID | 套系版本 | 状态 | 包入口 |', '|---|---|---|---|---|', ...suites.filter(s => s.status !== 'draft').map(s => `| ${s.displayName} / ${s.localizedName} | \`${s.id}\` | ${s.version} | ${s.status} | \`ui-design-lab/${s.id}\` |`)],
};
for (const [path, lines] of Object.entries(tables)) {
  const current = (await readFile(path, 'utf8')).replaceAll('\r\n', '\n');
  const generated = start + '\n' + lines.join('\n') + '\n' + end;
  if (!current.includes(start) || !current.includes(end)) throw new Error(path + ' 缺少套系清单生成标记');
  const next = current.slice(0, current.indexOf(start)) + generated + current.slice(current.indexOf(end) + end.length);
  if (process.argv.includes('--write')) await writeFile(path, next);
  else if (current !== next) throw new Error(path + ' 已过期；运行 npm run docs:generate');
}
const packageManifest = JSON.parse(await readFile('package.json', 'utf8'));
for (const suite of suites.filter(s => s.status !== 'draft' && s.status !== 'deprecated')) {
  if (!kits.some(kit => kit.preferred === suite.id)) throw new Error(suite.id + ' 缺少公共场景入口');
  if (!packageManifest.exports['./' + suite.id]) throw new Error(suite.id + ' 缺少包导出');
  if (suite.starter) {
    const types = await readFile(resolve('systems', suite.id, 'web/index.d.ts'), 'utf8');
    if (!types.includes('function ' + suite.starter.component + '(')) throw new Error(suite.id + ' Starter 入口没有公开类型');
  }
}
for (const kit of kits) {
  if (!suites.some(s => s.id === kit.preferred) || !kit.route.startsWith('#/systems/' + kit.preferred + '/')) throw new Error(kit.id + ' 场景与套系路由不匹配');
  await access(resolve('src/gallery/kit-previews', kit.id + '.png'));
}
console.log('套系索引、兼容性、场景入口与包导出一致（' + suites.length + ' 套，' + kits.length + ' 个场景）');
