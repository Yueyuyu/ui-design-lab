import { useState } from "react";
export function QuietTree({nodes,value,onChange,label="资料目录",disabled=false}) {
 const [query,setQuery]=useState("");
 const match=node=>node.label.toLowerCase().includes(query.toLowerCase())||node.children?.some(match);
 const render=list=><ul>{list.filter(match).map(node=><li key={node.id}>{node.children?<details open={query?true:undefined}><summary>{node.label}</summary>{render(node.children)}</details>:<button type="button" disabled={disabled} aria-current={value===node.id?"page":undefined} onClick={()=>onChange?.(node.id)}>{node.label}</button>}</li>)}</ul>;
 return <nav className="qw-tree" aria-label={label}><label>搜索目录<input type="search" value={query} onChange={e=>setQuery(e.target.value)}/></label>{nodes.some(match)?render(nodes):<p role="status">没有匹配的资料。</p>}</nav>;
}
