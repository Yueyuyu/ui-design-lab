import { X } from '@phosphor-icons/react';
import { useState } from 'react';
import { ClearButton, ClearSelect } from './primitives.jsx';
import { ClearTabs } from './Navigation.jsx';
import { ClearDataTable } from './DataTable.jsx';

export function ClearProjectTable({ rows, selectedId, onSelect, loading, error, onRetry }) {
  return <ClearDataTable caption="Project directory" selectable={false} rows={rows} loading={loading} error={error} onRetry={onRetry} pageSize={6} selection={selectedId ? [selectedId] : []} onSelectionChange={ids => onSelect?.(rows.find(row => row.id === ids.at(-1)) ?? null)} columns={[
    {key:'name',label:'Project name',render:(value,row) => onSelect ? <button type="button" className="cc-project-link" disabled={loading || !!error} onClick={() => onSelect(row)}>{value}</button> : value},
    {key:'id',label:'Key'}, {key:'status',label:'Status',render:value => <span className="cc-project-status" data-status={value}>{value}</span>},
    {key:'owner',label:'Owner'}, {key:'date',label:'Updated'}
  ]}/>;
}
export function ClearProjectDetails({ project, onStatusChange, onClose, disabled = false }) {
  const [tab,setTab] = useState('details');
  if(!project) return <aside className="cc-project-detail"><p>选择一个项目查看详情。</p></aside>;
  return <aside className="cc-project-detail"><header><h3>{project.name}</h3>{onClose && <ClearButton variant="ghost" aria-label="关闭项目详情" onClick={onClose}><X size={18} aria-hidden="true"/></ClearButton>}</header>
    <ClearTabs value={tab} onChange={setTab} items={[
      {id:'details',label:'Details',content:<dl><dt>Project key</dt><dd>{project.id}</dd><dt>Owner</dt><dd>{project.owner}</dd><dt>Status</dt><dd><ClearSelect aria-label="项目状态" value={project.status} disabled={disabled || !onStatusChange} onChange={event => onStatusChange?.(event.target.value)} options={['Planning','In progress','On track','At risk'].map(value => ({value,label:value}))}/></dd><dt>Updated</dt><dd>{project.date}</dd><dt>Description</dt><dd>{project.description ?? '尚未填写项目说明'}</dd></dl>},
      {id:'activity',label:'Activity',content:<p>{project.owner} · 当前状态 {project.status}。此处为当前记录摘要，历史事件由业务方提供。</p>}
    ]}/>
  </aside>;
}
