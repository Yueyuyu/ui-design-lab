import {build} from 'vite';
import react from '@vitejs/plugin-react';
import {cp,readFile,mkdir,writeFile} from 'node:fs/promises';
import {resolve} from 'node:path';
import {createHash} from 'node:crypto';

const root=resolve('systems/pulse-desktop/desktop');
const vendor=resolve('.local-cache/pulse-bot');
const out=resolve('.local-cache/pulse-desktop');
const required=['grok-bot-engine.js','original-data.js','catalog.js','template.js','materials.js',...['geometry','math','physics-system','simulation-clock','state-behavior-system','svg-renderer','morph-system','particle-system','material-system'].map(s=>'runtime/'+s+'.js')];
const hashes={};
for(const file of required) {
  const bytes=await readFile(resolve(vendor,file)).catch(()=>{throw new Error('本机 Pulse 资源缺失：'+file+'。授权未明确，不能从公开分发包自动取得。');});
  hashes[file]=createHash('sha256').update(bytes).digest('hex');
}
// 输出固定在被忽略的 .local-cache 内；普通 Gallery 构建从不复制这些文件。
await build({configFile:false,root,base:'./',mode:'pulse-local',publicDir:false,plugins:[react()],build:{outDir:out,emptyOutDir:true}});
await mkdir(resolve(out,'pulse-local'),{recursive:true});
for(const file of required) await cp(resolve(vendor,file),resolve(out,'pulse-local',file),{recursive:true,force:true});
await writeFile(resolve(out,'LOCAL-ONLY.json'),JSON.stringify({privatePreview:true,pulse:'2e17225ece661138de9ce9c73b322c7c1b16d753',bot:'6c27d9640c37e02e1eab0c4f7d98fa01196c66b8',rights:'unsettled; do not redistribute',hashes},null,2));
console.log('本机桌面资源：'+out);

