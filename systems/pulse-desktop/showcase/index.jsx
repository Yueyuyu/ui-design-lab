import { useState } from 'react';
import { createDocumentationNavigation } from '../../../src/gallery/docs/navigation.js';
import { PulsePlayground } from './PulsePlayground.jsx';
import { PulseDesktopDock, PulseQuotaRing, PulseTaskRow } from '../web/index.js';
import { demoTasks } from './demo-data.js';
import tokens from '../foundations/tokens.json';
import states from '../foundations/interaction-states.json';
import design from '../DESIGN.md?raw';
import api from '../API.md?raw';
import catalog from './catalog.generated.json';
import '../foundations/tokens.css';
import '../web/components.css';
import './showcase.css';
const standards = import.meta.glob('../standards/*.md', { query:'?raw', import:'default', eager:true });
function Foundations() { return <section className="pd-document"><h1>独立的桌面视觉语言</h1><p>不引用其他套系。颜色来自本套 Token；背景只在 Gallery 中出现。</p><div className="pd-token-grid">{Object.entries(tokens.color).map(([name, token]) => <div key={name}><i style={{background:token.$value}}/><strong>{name}</strong><br/>{token.$value}</div>)}</div><pre>{design}</pre></section>; }
function Components({section}) {
  const [mode,setMode]=useState('compact'),[pinned,setPinned]=useState(false),[tasks,setTasks]=useState(demoTasks),[notice,setNotice]=useState('');
  const selected=catalog.find(entry=>entry.id===section);
  const title=(id,name)=><h2><a href={`#/systems/pulse-desktop/components/${id}`}>{name}</a></h2>;
  return <section className="pd-document">
    {selected&&<a href="#/systems/pulse-desktop/components">← 全部组件</a>}
    <h1>{selected?.title??'三个组件，一套桌面语言。'}</h1><p>{selected?.description??'当前为本地模块与类型合同，尚未进入公开包分发。'}</p>
    {selected&&<p>{selected.anatomy}。{selected.usage}</p>}
    <div className="pd-component-grid">
      {(!selected||selected.id==='quota-ring')&&<div>{title('quota-ring','额度环')}{[69,35,12,null].map(value=><span key={String(value)} style={{display:'inline-block',marginRight:12}}><PulseQuotaRing remaining={value}/><br/>{value === null ? '未知' : `${value}%`}</span>)}</div>}
      {(!selected||selected.id==='task-row')&&<div style={{width:310}}>{title('task-row','任务行')}<PulseTaskRow task={tasks[0]} onOpen={()=>setNotice('示例：选择任务，不打开真实对话')} onWatch={()=>setTasks(current=>current.map((t,i)=>i? t : {...t,watched:!t.watched}))}/></div>}
      {(!selected||selected.id==='desktop-dock')&&<div>{title('desktop-dock','桌面浮层')}<PulseDesktopDock mode={mode} remaining={69} tasks={tasks} pinned={pinned} onModeChange={setMode} onPinnedChange={setPinned} onOpenTask={()=>setNotice('示例：选择任务')} onWatchTask={id=>setTasks(current=>current.map(t=>t.id===id?{...t,watched:!t.watched}:t))}/></div>}
    </div><p role="status">{notice}</p><h2>七态合同</h2>
    {Object.entries(states.components).filter(([name])=>!selected||name===selected.id).map(([name,contract])=><section key={name}><h3>{name}</h3><dl>{Object.entries(contract).map(([state,text])=><div key={state}><dt><strong>{state}</strong></dt><dd>{text}</dd></div>)}</dl></section>)}
    {selected&&<><h2>类型接口</h2><pre>{selected.api}</pre><details><summary>查看源码 · {selected.source}</summary><pre>{selected.sourceCode}</pre></details></>}
  </section>;
}
function Guidelines(){return <section className="pd-document"><h1>行为与边界</h1>{Object.entries(standards).map(([path,text])=><pre key={path}>{text}</pre>)}</section>;}
function Usage(){return <section className="pd-document"><h1>桌面实时接入，Lab 保留示例。</h1><p>Web 入口：systems/pulse-desktop/web/index.js。Companion 的 start-pulse.ps1 启动真实桌面，复用额度、任务、关注、通知和跳转；这里的 Gallery 与 Playground 不连接账号。</p><p>沿用 <a href="https://github.com/qunqin24/Pulse" target="_blank" rel="noreferrer">Pulse</a> 的视觉与动效，无官方关联。旧安装及启动项保留；本机运行接入不等于公开发行。</p><pre>{api}</pre></section>;}
export const navigation = createDocumentationNavigation();
export const pages = { overview:PulsePlayground, playground:PulsePlayground, foundations:Foundations, components:Components, guidelines:Guidelines, patterns:PulsePlayground, usage:Usage };
export const componentEntries = catalog.map(({id,title,suffix,kind,description,exportName})=>({id,title,suffix,kind,description,exportName}));
