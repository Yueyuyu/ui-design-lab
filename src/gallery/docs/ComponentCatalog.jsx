import {ComponentIndex} from './ComponentIndex.jsx';
import {ComponentDetail} from './ComponentDetail.jsx';
import './component-docs.css';
import './component-browser.css';
export function ComponentCatalog({suite,entries,section,...props}) {
 if(!section) return <ComponentIndex suite={suite} entries={entries} kit={props.kit} examples={props.examples}/>;
 const entry=entries.find(item=>item.id===section);
 if(!entry) return <section className="component-docs"><h1>没有找到这个组件</h1><p>该名称不在当前套系的公开导出目录中。</p><button className="doc-back" onClick={()=>props.onNavigate('components')}>返回组件目录</button></section>;
 return <ComponentDetail key={entry.id} suite={suite} entries={entries} entry={entry} {...props}/>;
}
