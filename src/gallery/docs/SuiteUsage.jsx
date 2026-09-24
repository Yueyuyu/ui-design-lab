import {useState} from 'react';
import {Copy,Check} from '@phosphor-icons/react';
import {copyText} from '../copyText.js';
import {suiteUsage} from '../usage-content.js';
import {DownloadArtifact} from '../DownloadArtifact.jsx';
import {onboardingSteps} from '../integration-guide.js';
import './suite-usage.css';

export {suiteImportExample} from '../integration-guide.js';
function CopyAction({text,label}) {
  const [status,setStatus]=useState('');
  const Icon=status==='已复制'?Check:Copy;
  return <span className="usage-copy"><button type="button" aria-label={label} onClick={async()=>{try{await copyText(text);setStatus('已复制');}catch{setStatus('复制失败，请展开内容手动复制');}}}><Icon size={16} aria-hidden="true"/>{status==='已复制'?'已复制':'复制'}</button><span role="status">{status==='已复制'?'':status}</span></span>;
}
export function SuiteUsage({suite}) {
  const steps=onboardingSteps(suite,'existing');
  return <section className="suite-usage"><header><p className="doc-eyebrow">{suite.displayName} / GET STARTED</p><h1>接入指南</h1><p>四步，把{suite.localizedName}用到你的项目里。</p><small>适用于已有 React 18.2 / 19.2 项目 · 当前以本地组件包交付</small><DownloadArtifact suite={suite}/><a href={`#/usage?suite=${suite.id}&path=new`}>新项目：下载独立 Starter →</a></header>
    <ol className="usage-steps">{steps.map((step,index)=><li key={step.title}><span className="usage-step-number">{String(index+1).padStart(2,'0')}</span><div className="usage-step-body"><h2>{step.title}</h2><p>{step.context}</p>{step.collapsed?<details><summary>查看页面代码</summary><pre><code>{step.code}</code></pre></details>:step.code?<pre><code>{step.code}</code></pre>:null}</div>{step.code && <CopyAction text={step.code} label={`复制第 ${index+1} 步`}/>}</li>)}</ol>
    <div className="usage-agent"><div><h2>让 Codex 按这套语言设计</h2><p>复制设计原则与扩展方法，让 Codex 复用现有组件，并为你的需求设计新页面、新组件。</p></div><CopyAction text={suiteUsage(suite).prompt} label="复制 Codex 指令"/></div>
    <details className="usage-advanced"><summary>更多接入细节</summary><p>组件参数、状态和示例在<a href={`#/systems/${suite.id}/components`}>组件目录</a>中查看。作用域：<code>{suite.scope}</code>；版本：{suite.version}。</p><p>包内 systems/{suite.id}/ 包含 DESIGN.md、standards/extension.md、foundations/、其他设计规范、API.md、web/index.d.ts 与本套源码。Codex 先读设计规则，再按真实 API 复用组件；缺少的组件可在你的项目内设计实现。</p><p>现有项目请把示例合并到自己的页面；组件事件与业务数据由接入项目提供。</p></details>
  </section>;
}
