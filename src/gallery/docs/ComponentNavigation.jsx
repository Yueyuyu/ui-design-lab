import {useEffect,useRef,useState} from 'react';
import {groupedComponents,componentHref} from './component-groups.js';
export function ComponentNavigation({entries,suiteId,activeId,mobile=false}) {
 const [query,setQuery]=useState('');
 const groups=groupedComponents(entries,query);
 const navigation=useRef(null);
 useEffect(()=>{
  // 仅滚动组件目录自身，深链接定位不能带动示例页面滚动。
  const frame=requestAnimationFrame(()=>{
   const nav=navigation.current,container=nav?.parentElement;
   if(mobile||!container?.classList.contains('lab-component-browser')) return;
   const current=nav.querySelector('[aria-current="page"]');
   if(!current) return;
   const bounds=container.getBoundingClientRect(),item=current.getBoundingClientRect();
   const inset=nav.querySelector('.doc-component-navigation-search').offsetHeight+8;
   if(item.top<bounds.top+inset||item.bottom>bounds.bottom) container.scrollTop+=item.top-bounds.top-inset;
  });
  return ()=>cancelAnimationFrame(frame);
 },[activeId,query,mobile]);
 return <nav ref={navigation} className="doc-component-navigation" aria-label={mobile?'手机组件导航':'按分类浏览组件'}>
  <div className="doc-component-navigation-search"><label><span>查找组件</span><input type="search" aria-label={mobile?'查找手机组件':'查找侧栏组件'} placeholder="搜索组件…" value={query} onChange={e=>setQuery(e.target.value)}/></label></div>
  <a className="doc-navigation-overview" href={componentHref(suiteId)} aria-current={!activeId?'page':undefined}>全部组件</a>
  {groups.map(group=><section key={group.id}><h3>{group.label}<span>{group.entries.length}</span></h3>{group.entries.map(entry=><a key={entry.id} href={componentHref(suiteId,entry.id)} aria-current={activeId===entry.id?'page':undefined}><span>{entry.title}</span><small>{entry.suffix}</small></a>)}</section>)}
  {!groups.length&&<p role="status">没有匹配的组件</p>}
 </nav>;
}
