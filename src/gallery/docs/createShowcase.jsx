import { ComponentCatalog } from './ComponentCatalog.jsx';
import { ComponentExample } from './ComponentExample.jsx';
import { createDocumentationNavigation } from './navigation.js';
import { FoundationDocs } from './FoundationDocs.jsx';
import { SuiteUsage } from './SuiteUsage.jsx';

function InlineText({text}) {
  return text.split(/(`[^`]+`)/).map((part,index) => part.startsWith('`') ? <code key={index}>{part.slice(1,-1)}</code> : part);
}
function StandardText({text}) {
  // standards 是仓库内受控 Markdown；只呈现文档结构，不执行 HTML 或嵌入脚本。
  return text.replace(/\r\n?/g,'\n').trim().split(/\n\s*\n/).map((block,index) => {
    if(block.startsWith('#')) {const title=block.replace(/^#+\s*/,'');return <h3 key={index}>{title}</h3>;}
    if(block.trim().startsWith('- ')) return <ul key={index}>{block.split('\n').map((line,i)=><li key={i}><InlineText text={line.replace(/^- /,'')}/></li>)}</ul>;
    if(/^\d+\. /.test(block)) return <ol key={index}>{block.split('\n').map((line,i)=><li key={i}><InlineText text={line.replace(/^\d+\. /,'')}/></li>)}</ol>;
    if(block.startsWith('|')) {
      const rows=block.split('\n').map(line=>line.replace(/^\||\|$/g,'').split('|').map(cell=>cell.trim()));
      if(rows.length>1&&rows[1].every(cell=>/^:?-+:?$/.test(cell))) return <div key={index} className="doc-standard-table" role="region" aria-label="规范对照表" tabIndex={0}><table><thead><tr>{rows[0].map((cell,i)=><th key={i} scope="col"><InlineText text={cell}/></th>)}</tr></thead><tbody>{rows.slice(2).map((row,i)=><tr key={i}>{row.map((cell,j)=><td key={j}><InlineText text={cell}/></td>)}</tr>)}</tbody></table></div>;
    }
    return <p key={index}><InlineText text={block}/></p>;
  });
}
function Guidelines({standards,suite}) {
  const labels={'extension':'设计新页面与组件','composition':'组件与页面边界','accessibility':'可访问性','component-states':'状态与反馈','icons':'图标','data-visualization':'数据可视化','data-views':'数据视图','chinese-copy':'中文文案','motion':'动效','status-semantics':'状态语义'};
  return <section className="component-docs doc-standards"><header><span className="doc-eyebrow">{suite.displayName} / GUIDELINES</span><h1>设计与行为规范</h1><p>这里回答“如何组合、何时使用、哪些行为不能省略”。具体参数和每个组件的七态在组件详情中查看。</p></header><nav className="doc-standard-links" aria-label="规范章节">{Object.keys(standards).map(path=>{const name=path.split('/').at(-1).replace('.md','');return <a key={path} href={`#/systems/${suite.id}/guidelines/${name}`}>{labels[name]??name}</a>;})}</nav>{Object.entries(standards).map(([path,text])=>{const name=path.split('/').at(-1).replace('.md','');return <section key={path} id={name}><h2>{labels[name]??name}</h2><StandardText text={text.replace(/^# [^\n]*\n+/,'')}/></section>;})}</section>;
}
function Patterns({entries,kit,suite,section,onNavigate,onNotify,workflow:Workflow}) {
  const patterns=entries.filter(item=>item.kind==='pattern').sort((a,b)=>Number(a.suffix==='Shell')-Number(b.suffix==='Shell'));
  const selected=patterns.find(item=>item.id===section)??patterns[0];
  const C=selected&&kit[selected.exportName];
  const showingFlow=section==='flows'&&Workflow;
  return <section className="component-docs"><header><a href={`#/systems/${suite.id}/patterns`}>← 返回应用示例</a><h1>页面组合与流程文档</h1><p>查看页面如何组合组件，以及连续操作与失败恢复的实现。可独立体验的页面收录在本套应用示例中。</p></header>
    <nav className="doc-filters" aria-label="页面示例">{patterns.map(item=><button key={item.id} aria-pressed={!showingFlow&&selected?.id===item.id} onClick={()=>onNavigate(`patterns/${item.id}`)}>{item.title}</button>)}{Workflow&&<button aria-pressed={!!showingFlow} onClick={()=>onNavigate('patterns/flows')}>连续业务流程</button>}</nav>
    {showingFlow?<Workflow suite={suite} onNotify={onNotify}/>:selected&&<><div className="doc-pattern-intro"><h2>{selected.title}</h2><p>{selected.anatomy}</p><p className="doc-muted">{selected.usage}</p><a href={`#/systems/${suite.id}/components`}>查找组成组件 →</a></div>{['Shell','TerminalPreview'].includes(selected.suffix)?<ComponentExample entry={selected} kit={kit} prefix={suite.componentPrefix}/>:<C storageKey={null} onNotify={onNotify}/>}<h2>组合接口</h2><pre className="doc-code">{selected.api}</pre><a href={`#/systems/${suite.id}/components/${selected.id}`}>查看完整源码与边界 →</a></>}
  </section>;
}
function Playground({base:Base,controls:Controls,states:States,section,onNavigate,...props}) {
  const active=section==='controls'&&Controls?'controls':section==='states'&&States?'states':'settings';
  const Page=active==='controls'?Controls:active==='states'?States:Base;
  return <><nav className="component-docs doc-filters" aria-label="交互试验分类"><button aria-pressed={active==='settings'} onClick={()=>onNavigate('playground')}>设置与保存</button>{Controls&&<button aria-pressed={active==='controls'} onClick={()=>onNavigate('playground/controls')}>控件联调</button>}{States&&<button aria-pressed={active==='states'} onClick={()=>onNavigate('playground/states')}>基础状态试验</button>}</nav><Page {...props} onNavigate={onNavigate}/></>;
}
export function createShowcase({suite,kit,entries,examples={},standards,foundation,base,controls,states,workflow,theme}) {
  function Components(props) {return <ComponentCatalog {...props} suite={suite} entries={entries} kit={kit} examples={examples}/>;}
  const declaredStandards=Object.fromEntries(Object.entries(standards).filter(([path])=>suite.capabilities.standards.includes(path.split("/").at(-1).replace(".md",""))));
  function GuidelinesPage() {return <Guidelines standards={declaredStandards} suite={suite}/>;}
  function PatternPage(props) {return <Patterns {...props} suite={suite} kit={kit} entries={entries} workflow={workflow}/>;}
  function PlaygroundPage(props) {return <Playground {...props} base={base.playground} controls={controls} states={states}/>;}
  function FoundationsPage() {return <FoundationDocs suite={suite} {...foundation}/>;}
  function UsagePage() {return <SuiteUsage suite={suite}/>;}
  const componentEntries=entries.filter(entry=>entry.kind!=='pattern').map(({id,title,suffix,kind,description,exportName})=>({id,title,suffix,kind,description,exportName}));
  const patternEntries=entries.filter(entry=>entry.kind==='pattern').map(({id,title})=>({id,title}));
  return {componentEntries,patternEntries,navigation:createDocumentationNavigation({theme:!!theme}),pages:{...base,foundations:FoundationsPage,components:Components,guidelines:GuidelinesPage,patterns:PatternPage,playground:PlaygroundPage,usage:UsagePage,...(theme?{theme}:{})}};
}
