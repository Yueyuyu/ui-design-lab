import {readFile, mkdir, mkdtemp, cp, writeFile, readdir} from 'node:fs/promises';
import {join} from 'node:path';
import {spawnSync} from 'node:child_process';
import {createHash} from 'node:crypto';
import {starterFiles, root} from './lib/starter-files.mjs';
import {kits} from '../src/gallery/kits.js';

const npmCli = process.env.npm_execpath;
if (!npmCli) throw new Error('请通过 npm run downloads:prepare 生成下载。');
const run = (command, args) => {
  const result = spawnSync(command, args, {cwd: root, encoding: 'utf8'});
  if (result.status !== 0) throw new Error(result.stderr || result.stdout || `${command} 执行失败`);
  return result.stdout;
};
const pkg = JSON.parse(await readFile(join(root, 'package.json'), 'utf8'));
const packed = JSON.parse(run(process.execPath, [npmCli, 'pack', '--ignore-scripts', '--json']))[0];
const packageFile = join(root, packed.filename);
const output = join(root, 'public/downloads');
await mkdir(output, {recursive: true});
await mkdir(join(root, '.local-cache'), {recursive: true});
const staging = await mkdtemp(join(root, '.local-cache/downloads-'));
await cp(packageFile, join(output, packed.filename));
const artifacts = [{filename: packed.filename, kind: 'package'}];
for (const entry of await readdir(join(root, 'systems'), {withFileTypes: true})) {
  if (!entry.isDirectory()) continue;
  const suite = JSON.parse(await readFile(join(root, 'systems', entry.name, 'suite.json'), 'utf8'));
  if (suite.status === 'draft') continue;
  for (const kit of [null, ...kits.filter(item => item.preferred === suite.id)]) {
    const name = `${suite.id}${kit ? `-${kit.id}` : ''}`;
    const target = join(staging, name);
    await starterFiles(target, suite.id, {packageFile, kitId: kit?.id});
    const filename = `ui-design-lab-starter-${name}-${pkg.version}.tgz`;
    run('tar', ['-czf', join(output, filename), '-C', target, '.']);
    artifacts.push({filename, kind: 'starter', suiteId: suite.id, kitId: kit?.id ?? null});
  }
}
for (const artifact of artifacts) {
  const content = await readFile(join(output, artifact.filename));
  artifact.bytes = content.length;
  artifact.sha256 = createHash('sha256').update(content).digest('hex');
}
// 最后写清单，只有全部构建成功的下载才会被网站列出。
await writeFile(join(output, 'manifest.json'), JSON.stringify({version: pkg.version, createdAt: new Date().toISOString(), publishedToNpm: false, artifacts}, null, 2) + '\n');
console.log(`已生成 ${artifacts.length} 个下载文件：${output}`);
