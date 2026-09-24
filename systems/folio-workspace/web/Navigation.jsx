import { useState } from 'react';
import { CaretDown, CaretRight, FileText, Plus, MagnifyingGlass, BookOpen } from '@phosphor-icons/react';
import { FolioButton } from './Primitives.jsx';
export function FolioPageTree({ pages, activeId, onSelect, onCreate, disabled = false }) {
  const [collapsed, setCollapsed] = useState([]);
  const [query, setQuery] = useState('');
  const renderPage = page => {
    const children = pages.filter(item => item.parentId === page.id);
    const expanded = !collapsed.includes(page.id);
    return <li key={page.id}><div className="fw-tree-row" data-active={activeId === page.id}>
      {children.length > 0 ? <FolioButton aria-label={`${expanded ? '折叠' : '展开'} ${page.title || '未命名页面'}`} aria-expanded={expanded} onClick={() => setCollapsed(list => expanded ? [...list, page.id] : list.filter(id => id !== page.id))}><CaretDown size={13} style={{ transform: expanded ? undefined : 'rotate(-90deg)' }} /></FolioButton> : <span className="fw-tree-spacer" />}
      <FolioButton className="fw-tree-link" aria-current={activeId === page.id ? 'page' : undefined} onClick={() => onSelect(page.id)}><FileText size={16} /><span>{page.title || '未命名页面'}</span></FolioButton>
    </div>{expanded && children.length > 0 && <ul>{children.map(renderPage)}</ul>}</li>;
  };
  const matches = pages.filter(page => page.title.toLocaleLowerCase().includes(query.toLocaleLowerCase()));
  return <nav className="fw-page-tree" aria-label="工作区页面"><div className="fw-workspace-name"><BookOpen size={22} /><strong>Folio<span>页集 · 私人工作区</span></strong></div><label className="fw-search"><MagnifyingGlass size={16} /><input type="search" aria-label="搜索页面" value={query} onChange={e => setQuery(e.target.value)} placeholder="搜索页面…" /></label><div className="fw-tree-label">工作区<FolioButton aria-label="新建页面" disabled={disabled} onClick={() => onCreate(null)}><Plus size={16} /></FolioButton></div>
    {query ? <ul>{matches.map(page => <li key={page.id}><FolioButton className="fw-tree-link" onClick={() => onSelect(page.id)}><FileText size={16} /><span>{page.title || '未命名页面'}</span></FolioButton></li>)}</ul> : <ul>{pages.filter(page => page.parentId === null).map(renderPage)}</ul>}
    {query && !matches.length && <p className="fw-muted">没有匹配的页面</p>}<FolioButton className="fw-child-page" disabled={disabled} onClick={() => { setCollapsed(list => list.filter(id => id !== activeId)); onCreate(activeId); }}><Plus size={15} /> 添加子页面</FolioButton><div className="fw-tree-footer"><span>一个安放想法的地方</span><small>在页面之间整理内容与记录</small></div></nav>;
}
export function FolioBreadcrumbs({ pages, activeId, onSelect }) {
  const path = [];
  let page = pages.find(item => item.id === activeId);
  while (page) { path.unshift(page); page = pages.find(item => item.id === page.parentId); }
  return <nav className="fw-breadcrumbs" aria-label="页面路径"><span>手记</span>{path.map((item, index) => <span key={item.id}><CaretRight size={12} /><FolioButton aria-current={index === path.length - 1 ? 'page' : undefined} onClick={() => onSelect(item.id)}>{item.title || '未命名页面'}</FolioButton></span>)}</nav>;
}
