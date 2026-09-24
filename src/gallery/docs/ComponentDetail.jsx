import {PublicCopyButton} from '../PublicCopyButton.jsx';
import {useState} from 'react';
import {ComponentExample} from './ComponentExample.jsx';
import {ComponentNavigation} from './ComponentNavigation.jsx';
import {componentGroup,componentGroups,componentHref,groupedComponents} from './component-groups.js';
import {copyText} from '../copyText.js';
const stateNames={default:'默认',hover:'悬停',pressed:'按下',focus:'键盘聚焦',disabled:'禁用',loading:'加载',error:'错误',empty:'空数据'};
const chapters=[['preview','交互预览'],['usage','组成与用法'],['api','参数与事件'],['states','状态与键盘行为'],['source','接入与源码']];
function jumpToChapter(id) {const target=document.getElementById(`component-${id}`);target?.scrollIntoView({block:'start'});target?.focus({preventScroll:true});}
export function ComponentDetail({suite,entry,entries,kit,examples={},onNavigate,onNotify}) {
 const [state,setState]=useState('default');
 const group=componentGroup(entry);
 const ordered=groupedComponents(entries).flatMap(group=>group.entries);
 const index=ordered.findIndex(item=>item.id===entry.id);
 const previous=ordered[index-1],next=index<0?null:ordered[index+1];
 const integration=`import { ${entry.exportName} } from 'ui-design-lab/${suite.id}';\nimport 'ui-design-lab/${suite.id}/tokens.css';\nimport 'ui-design-lab/${suite.id}/components.css';\n\nexport function Example(props) {\n  return <section data-ui-system="${suite.id}">\n    <${entry.exportName} {...props} />\n  </section>;\n}`;
 return <div className="doc-detail-layout"><article className="component-docs doc-component-detail">
  <div className="doc-detail-breadcrumb"><a href={componentHref(suite.id)}>组件目录</a><span>/</span><span>{componentGroups.find(item=>item.id===group)?.label??'页面组合'}</span></div>
  <details className="doc-mobile-picker"><summary>选择组件 · {entry.title}</summary><ComponentNavigation entries={entries} suiteId={suite.id} activeId={entry.id} mobile/></details>
  <header><p className="doc-eyebrow">{entry.suffix} / {entry.exportName}</p><h1>{entry.title}</h1><p>{entry.description}</p></header>
  <section className="doc-detail-section"><h2 id="component-preview" tabIndex={-1}>交互预览</h2><p className="doc-muted">直接操作下面的组件，切换状态查看不同反馈。</p>
   {entry.previewStates.length>1&&<label className="doc-toolbar">数据状态<select value={state} onChange={e=>setState(e.target.value)}>{entry.previewStates.map(value=><option key={value} value={value}>{stateNames[value]}</option>)}</select></label>}
   <div className="doc-actions"><PublicCopyButton text={integration} label="复制导入代码"/><a href={`#/usage?suite=${suite.id}&path=existing`}>下载并安装此套系 →</a></div>
   <div className="doc-detail-preview" data-layout={['general','forms'].includes(group)?'control':'content'}><ComponentExample entry={entry} kit={kit} prefix={suite.componentPrefix} custom={examples[entry.exportName]} state={state}/></div>
  </section>
  <section className="doc-detail-section"><h2 id="component-usage" tabIndex={-1}>组成与用法</h2><div className="doc-details-grid"><div><h3>组成</h3><p>{entry.anatomy}</p></div><div><h3>使用边界</h3><p>{entry.usage}</p></div></div></section>
  <section className="doc-detail-section"><h2 id="component-api" tabIndex={-1}>参数与事件</h2><p className="doc-muted">问号表示可选参数；on… 为调用方回调。</p><pre className="doc-code">{entry.api}</pre></section>
  <section className="doc-detail-section"><h2 id="component-states" tabIndex={-1}>状态与键盘行为</h2><dl className="doc-state-list">{Object.entries(entry.states).map(([key,value])=><div key={key}><dt>{stateNames[key]} · {key}</dt><dd>{value}</dd></div>)}</dl></section>
  <section className="doc-detail-section"><h2 id="component-source" tabIndex={-1}>接入与源码</h2><p>按接入指南安装组件包，再传入本组件所需的数据和事件。</p><details><summary>查看导入示例</summary><pre className="doc-code">{integration}</pre></details><div className="doc-actions"><button onClick={async()=>{try{await copyText(entry.sourceCode);onNotify?.('组件源码已复制，相关依赖请通过套系入口接入');}catch{onNotify?.('复制不可用，可展开源码手动复制');}}}>复制组件源码</button><button onClick={()=>onNavigate('usage')}>套系接入指南</button><button onClick={()=>onNavigate('patterns')}>查看页面组合</button></div><details><summary>查看实现 · systems/{suite.id}/{entry.source}</summary><pre className="doc-code">{entry.sourceCode}</pre></details></section>
  <nav className="doc-neighbors" aria-label="相邻组件">{previous?<a href={componentHref(suite.id,previous.id)}><small>上一个</small><span>← {previous.title}</span></a>:<span/>}{next&&<a href={componentHref(suite.id,next.id)}><small>下一个</small><span>{next.title} →</span></a>}</nav>
 </article><nav className="doc-page-outline" aria-label="本页内容"><p>本页内容</p>{chapters.map(([id,title])=><button key={id} onClick={()=>jumpToChapter(id)}>{title}</button>)}</nav></div>;
}
