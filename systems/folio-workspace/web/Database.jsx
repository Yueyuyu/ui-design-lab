import { useId } from 'react';
import { Table, Kanban, ListBullets, Plus, FileText, MagnifyingGlass } from '@phosphor-icons/react';
import { FolioButton, FolioStatus } from './Primitives.jsx';
import { filterFolioRecords, folioStatuses } from './model.js';
const views = [['table', '表格', Table], ['board', '看板', Kanban], ['list', '列表', ListBullets]];
export function FolioViewTabs({ value, onChange, panelId }) {
  return <div className="fw-view-tabs" role="tablist" aria-label="数据库视图">{views.map(([id, label, Icon], index) => <button type="button" key={id} id={`${panelId}-${id}`} role="tab" aria-selected={value === id} aria-controls={panelId} tabIndex={value === id ? 0 : -1} onClick={() => onChange(id)} onKeyDown={e => {
    if (['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(e.key)) {
      e.preventDefault();
      const next = e.key === 'Home' ? 0 : e.key === 'End' ? views.length - 1 : (index + (e.key === 'ArrowRight' ? 1 : -1) + views.length) % views.length;
      onChange(views[next][0]); e.currentTarget.parentElement.children[next].focus();
    }
  }}><Icon size={16} />{label}</button>)}</div>;
}
export function FolioDatabase({ records, view, config, onViewChange, onConfigChange, onOpen, onCreate, disabled = false, activeId, draftIds = [] }) {
  const panelId = useId();
  const filtered = filterFolioRecords(records, config);
  const titleButton = record => <FolioButton className="fw-record-link" onClick={e => onOpen(record.id, e.currentTarget)} aria-label={`打开 ${record.title}`}><FileText size={16} /><span>{record.title}</span>{draftIds.includes(record.id) && <small>草稿</small>}</FolioButton>;
  return <section className="fw-database" aria-label="研究集合"><div className="fw-database-title"><h2>研究集合 <span>{records.length}</span></h2><FolioButton tone="solid" disabled={disabled} onClick={e => onCreate(e.currentTarget)}><Plus size={15} />新建记录</FolioButton></div>
    <FolioViewTabs value={view} onChange={onViewChange} panelId={panelId} />
    <div className="fw-database-controls"><label className="fw-search"><MagnifyingGlass size={15} /><input type="search" value={config.query} onChange={e => onConfigChange({ query: e.target.value })} placeholder="搜索记录…" aria-label="搜索记录" /></label><label>状态<select aria-label="筛选状态" value={config.status} onChange={e => onConfigChange({ status: e.target.value })}>{['全部', ...folioStatuses].map(status => <option key={status}>{status}</option>)}</select></label><label>排序<select aria-label="记录排序" value={config.sort} onChange={e => onConfigChange({ sort: e.target.value })}><option value="manual">创建顺序</option><option value="title">标题</option></select></label></div>
    <div id={panelId} role="tabpanel" aria-labelledby={`${panelId}-${view}`} tabIndex={0} className="fw-database-view" data-view={view}>
      {!filtered.length ? <div className="fw-empty"><FileText size={24} /><strong>{records.length ? '没有匹配的记录' : '从第一条发现开始'}</strong><p>{records.length ? '当前筛选只属于这个视图。' : '把一个问题、一段观察或下一步写下来。'}</p>{records.length ? <FolioButton onClick={() => onConfigChange({ query: '', status: '全部' })}>清除筛选</FolioButton> : <FolioButton disabled={disabled} onClick={e => onCreate(e.currentTarget)}>创建第一条记录</FolioButton>}</div>
        : view === 'table' ? <div className="fw-table-scroll"><table><caption className="fw-sr-only">研究记录表格</caption><thead><tr><th>名称</th><th>状态</th><th>分类</th></tr></thead><tbody>{filtered.map(record => <tr key={record.id} data-selected={activeId === record.id}><td>{titleButton(record)}</td><td><FolioStatus value={record.status} /></td><td className="fw-muted">{record.category || '未分类'}</td></tr>)}</tbody></table></div>
        : view === 'board' ? <div className="fw-board">{folioStatuses.map(status => <section key={status}><header><FolioStatus value={status} /><span>{filtered.filter(record => record.status === status).length}</span></header>{filtered.filter(record => record.status === status).map(record => <article key={record.id} data-selected={activeId === record.id}>{titleButton(record)}<span className="fw-muted">{record.category || '未分类'}</span></article>)}</section>)}</div>
        : <ul className="fw-record-list">{filtered.map(record => <li key={record.id} data-selected={activeId === record.id}>{titleButton(record)}<FolioStatus value={record.status} /><span className="fw-muted">{record.category || '未分类'}</span></li>)}</ul>}
    </div><div className="fw-database-footer"><span>{filtered.length} 条记录</span><span>同一集合 · 视图独立筛选</span></div>
  </section>;
}
