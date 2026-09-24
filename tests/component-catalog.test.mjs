import test from 'node:test';
import assert from 'node:assert/strict';
import {cp, mkdtemp, readdir, readFile, writeFile, rm} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {fileURLToPath} from 'node:url';
import {buildComponentCatalog} from '../scripts/lib/component-catalog.mjs';

test('组件文档在 LF 与 CRLF 源码检出下保持相同', async () => {
  const source = fileURLToPath(new URL('../systems/clearline-console/',import.meta.url));
  const temporary = await mkdtemp(join(tmpdir(),'ui-lab-catalog-newlines-'));
  async function useCRLF(directory) {
    for (const entry of await readdir(directory,{withFileTypes:true})) {
      const path = join(directory,entry.name);
      if (entry.isDirectory()) await useCRLF(path);
      else if (/\.(jsx?|ts)$/.test(entry.name)) await writeFile(path,(await readFile(path,'utf8')).replace(/\r\n?/g,'\n').replaceAll('\n','\r\n'));
    }
  }
  try {
    await cp(source,temporary,{recursive:true});
    const original = await buildComponentCatalog(source);
    await useCRLF(join(temporary,'web'));
    assert.deepEqual(await buildComponentCatalog(temporary),original);
    assert.ok(original.every(entry=>!entry.api.includes('\r')&&!entry.sourceCode.includes('\r')));
  } finally {
    // temporary 是本测试在系统临时目录中独占创建的目录。
    await rm(temporary,{recursive:true,force:true});
  }
});
