import {useMemo,useState} from 'react';

function flatten(value,path='') {
  return Object.entries(value).flatMap(([name,child])=>{
    const key=path?`${path}.${name}`:name;
    if(!child||typeof child!=='object')return [];
    if('$value' in child)return [{path:key,...child}];
    return flatten(child,key);
  });
}
export function FoundationDocs({suite,tokens,bindings,design}) {
  const [query,setQuery]=useState(''),[kind,setKind]=useState('color');
  const values=useMemo(()=>flatten(tokens),[tokens]);
  const types=[...new Set(values.map(token=>token.$type ?? 'value'))];
  const filtered=values.filter(token=>(kind==='all'||token.$type===kind)&&`${token.path} ${JSON.stringify(token.$value)}`.toLowerCase().includes(query.toLowerCase()));
  const specs=design.split(/^## /m).filter(block=>/^(Typography|Layout|Shapes|Responsive Behavior)\s*\n/.test(block));
  return <section className="component-docs"><header><span className="doc-eyebrow">{suite.displayName} / FOUNDATIONS</span><h1>基础规范</h1><p>从本套系 tokens.json 与 token-bindings.json 读取，数值与 CSS 双向校验。颜色、字体、间距和密度属于基础规则，业务面板属于组件。</p></header>
    <div className="doc-details-grid">{specs.map(block=>{const [title,...lines]=block.split('\n');return <div key={title}><h2>{{Typography:'排版',Layout:'布局',Shapes:'形状', 'Responsive Behavior':'响应式'}[title.trim()]??title}</h2><p>{lines.join('\n')}</p></div>;})}</div>
    <div className="doc-toolbar"><input type="search" aria-label="搜索 Token" value={query} onChange={event=>setQuery(event.target.value)} placeholder="搜索 Token 名称或值…"/><label>Token 类型 <select value={kind} onChange={event=>setKind(event.target.value)}><option value="all">全部</option>{types.map(type=><option key={type} value={type}>{type}</option>)}</select></label><span>{filtered.length} / {values.length}</span></div>
    <div className="doc-card-grid">{filtered.map(token=>{const names=Object.entries(bindings).flatMap(([group,entries])=>Object.entries(entries).filter(([,path])=>path===token.path).map(([name])=>`${name} · ${group}`));return <article className="doc-token" key={token.path}>{token.$type==='color'&&<div className="doc-token-swatch" style={{background:token.$value}}/>}<h3>{token.path}</h3><code>{Array.isArray(token.$value)?token.$value.join(', '):String(token.$value)}</code><p>{names.join('\n')}</p></article>;})}</div>
    {!filtered.length&&<p role="status">没有匹配的 Token。</p>}
    <h2>作用域与变体</h2><pre className="doc-code">{suite.scope}</pre><p>模式：{suite.modes.join(' / ')}；密度：{suite.densities.join(' / ')}。密度变体仍属于本套系，不计为新的 UI 套系。</p>
  </section>;
}
