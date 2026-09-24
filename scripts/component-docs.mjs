import {readFile,writeFile} from 'node:fs/promises';
import {resolve,basename} from 'node:path';
import {buildComponentCatalog,suiteDirectories} from './lib/component-catalog.mjs';

for(const directory of await suiteDirectories(process.cwd())) {
  const manifest=JSON.parse(await readFile(resolve(directory,'suite.json'),'utf8'));
  // 空脚手架尚无 API；已实现组件的 draft 也必须经过导出、类型与七态校验。
  if(manifest.status==='draft' && !manifest.capabilities.components.length) continue;
  const catalog=await buildComponentCatalog(directory);
  const path=resolve(directory,'showcase/catalog.generated.json');
  const content=JSON.stringify(catalog,null,2)+'\n';
  if(process.argv.includes('--write')) await writeFile(path,content);
  else {
    if((await readFile(path,'utf8')).replace(/\r\n?/g,'\n') !== content) throw new Error(`${basename(directory)} 文档已过期，请运行 npm run docs:generate`);
    const componentIds=catalog.filter(item=>item.kind!=='pattern').map(item=>item.id).sort();
    if(JSON.stringify(componentIds)!==JSON.stringify([...manifest.capabilities.components].sort())) throw new Error(`${manifest.id} 组件能力清单与实际导出不一致`);
    for(const entry of catalog.filter(item=>item.kind==='pattern')) if(!manifest.capabilities.patterns.includes(entry.id)) throw new Error(`${manifest.id} 缺少页面能力 ${entry.id}`);
  }
  console.log(`${basename(directory)}：${catalog.filter(item=>item.kind!=='pattern').length} 个组件，${catalog.filter(item=>item.kind==='pattern').length} 个页面组合，导出/类型/状态/源码一致`);
}
