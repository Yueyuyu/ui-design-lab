import {useState} from 'react';
import {ArrowUpRight} from '@phosphor-icons/react';
import {ComponentExample} from './ComponentExample.jsx';
import {ComponentMasonry} from './ComponentMasonry.jsx';
import {groupedComponents,componentHref,componentGroup} from './component-groups.js';
// 表格和编辑器跨列，普通面板仍作为独立方块展示，保留内容自然高度。
const widePreviews=new Set(['DateRange','Table','DataTable','ProjectTable','Database','BlockEditor']);
// 已经有自身面板结构的组件直接展示，轻量控件才需要 Gallery 提供承托面。
const selfContainedPreviews=new Set(['AssetSummary','PerformancePanel','HoldingsPanel','PnlCalendar','MonthlyReturns','ExposurePanel','StrategyPanel','TaskLight','StoryCard','ProjectDetails','RecordDetail','Database','Card','Panel','Notification','Callout','SettingsGroup','Composer','AppLauncher','CommandMenu','IconPicker']);
function ComponentPreview({suite,entry,kit,examples}) {
 const wide=widePreviews.has(entry.suffix);
 return <li className="doc-index-item" data-component={entry.id} data-category={componentGroup(entry)} data-layout={wide?'wide':'control'} data-presentation={selfContainedPreviews.has(entry.suffix)?'component':'surface'}>
  <div className="doc-index-preview" role="group" aria-label={`${entry.title}预览`}><ComponentExample entry={entry} kit={kit} prefix={suite.componentPrefix} custom={examples[entry.exportName]} catalog/></div>
  <footer className="doc-index-caption"><a className="doc-index-link" href={componentHref(suite.id,entry.id)} title={`查看${entry.title}的用法与代码`}><strong>{entry.title}</strong><ArrowUpRight size={14} aria-hidden="true"/></a></footer>
 </li>;
}
export function ComponentIndex({suite,entries,kit,examples={}}) {
 const [query,setQuery]=useState('');
 const [category,setCategory]=useState('all');
 const groups=groupedComponents(entries,query);
 const allGroups=groupedComponents(entries);
 const visible=groups.filter(group=>category==='all'||category===group.id);
 const count=entries.filter(entry=>entry.kind!=='pattern').length;
 return <section className="component-docs doc-component-index"><header className="doc-index-heading"><h1>组件目录</h1><div className="doc-toolbar"><input type="search" aria-label="搜索组件" value={query} onChange={e=>setQuery(e.target.value)} placeholder="搜索组件…"/><span>{count} 个组件</span></div></header>
  <nav className="doc-filters" aria-label="组件分类"><button aria-pressed={category==='all'} onClick={()=>setCategory('all')}>全部</button>{allGroups.map(group=><button key={group.id} aria-pressed={category===group.id} onClick={()=>setCategory(group.id)}>{group.label}<span>{group.entries.length}</span></button>)}</nav>
  {visible.length>0 && <section className="doc-index-group" data-category={category}><ComponentMasonry>{visible.flatMap(group=>group.entries).map(entry=><ComponentPreview key={entry.id} suite={suite} entry={entry} kit={kit} examples={examples}/>)}</ComponentMasonry></section>}
  {!visible.length&&<p role="status">没有匹配的组件，请尝试其他关键词或分类。</p>}
 </section>;
}
