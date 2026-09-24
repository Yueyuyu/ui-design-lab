import {DownloadArtifact} from './DownloadArtifact.jsx';
import {ArrowRight,DownloadSimple,TerminalWindow} from '@phosphor-icons/react';
import {recordEvent} from './telemetry.js';
import {downloadText} from './workbench/demo-data.js';
import {betaVersion} from './release-info.js';
import {onboardingSteps,suiteImportExample} from './integration-guide.js';
import {deliveryScope} from './delivery-scope.js';
import {PublicCopyButton} from './PublicCopyButton.jsx';
export function ProjectOnboarding({suite,path,kit,onPathChange}) {
 const steps=onboardingSteps(suite,path,kit);
 const download=()=>{
  recordEvent('onboarding_start',{suiteId:suite.id,path});
  downloadText('integration.md',`# ${suite.displayName} 接入指南\n\n版本：${betaVersion}\n\n${kit ? `目标场景：${kit.title}\n\n` : ''}${steps.map((step,index)=>`## ${index+1}. ${step.title}\n\n${step.context}\n\n执行位置：${step.location}\n\n\`\`\`${step.language??'sh'}\n${step.code ?? '使用本页下载按钮获取文件。'}\n\`\`\``).join('\n\n')}\n\n${path==='new'?`## 组件页面示例\n\n\`\`\`jsx\n${suiteImportExample(suite)}\n\`\`\`\n\n`:''}${deliveryScope}`);
 };
 return <section id="onboarding" className="onboarding-layout">
  <aside className="onboarding-setup"><h2>接入你的项目</h2><p>当前套系：{suite.localizedName}。选择项目类型，查看对应步骤。</p><span className="onboarding-label">项目类型</span><div className="public-segment" aria-label="项目类型">{[{id:'new',label:'新建项目'},{id:'existing',label:'已有项目'}].map(item=><button key={item.id} type="button" aria-pressed={path===item.id} onClick={()=>onPathChange(item.id)}>{item.label}</button>)}</div><dl className="onboarding-environment"><div><dt>运行环境</dt><dd>Node.js 22+ · {path === 'new' ? 'React 19.2（已配置）' : 'React 18.2 / 19.2'}</dd></div><div><dt>组件包版本</dt><dd>{betaVersion}</dd></div></dl><DownloadArtifact suite={suite} path={path} kit={kit}/><details className="onboarding-source"><summary>从源码构建（开发者）</summary><a href="https://github.com/Yueyuyu/ui-design-lab" target="_blank" rel="noreferrer">获取项目源码 ↗</a><pre>npm ci{'\n'}npm pack</pre></details><button className="public-button" type="button" onClick={download}><DownloadSimple size={16}/>下载接入说明</button><a className="public-text-link" href={`#/systems/${suite.id}/components`}>查看本套组件<ArrowRight size={14}/></a></aside>
  <ol className="onboarding-steps" aria-label="安装步骤">{steps.map((step,index)=><li key={`${suite.id}-${path}-${index}`}><span className="onboarding-number">{String(index+1).padStart(2,'0')}</span><div className="onboarding-step-content"><header><h3>{step.title}</h3>{step.code && <PublicCopyButton text={step.code} label={`复制第 ${index+1} 步`}/>}</header><p>{step.context}</p>{step.code && <div className="onboarding-code"><div className="onboarding-code-location"><TerminalWindow size={14}/>{step.location}</div>{step.collapsed?<details><summary>查看页面代码</summary><pre><code>{step.code}</code></pre></details>:<pre><code>{step.code}</code></pre>}</div>}</div></li>)}</ol>
 </section>;
}
