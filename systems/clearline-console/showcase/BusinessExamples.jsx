import {useState} from 'react';
import {ClearProjectDetails,ClearProjectTable} from '../web/index.js';
const initial=[{id:'R-01',name:'产品研究',owner:'林夏',status:'In progress',date:'2026-09-06',description:'将访谈记录转化为可验证的产品需求。'},{id:'R-02',name:'发布准备',owner:'陈越',status:'Planning',date:'2026-09-05'}];
function ProjectExample({entry}) {
  const [rows,setRows]=useState(initial),[selected,setSelected]=useState(initial[0]);
  return <div className="doc-example">{entry.suffix === 'ProjectTable' ? <><ClearProjectTable rows={rows} selectedId={selected?.id} onSelect={setSelected}/><p role="status">当前项目：{selected?.name ?? '未选择'}</p></> : <ClearProjectDetails project={selected} onStatusChange={status => {setSelected(value=>({...value,status}));setRows(values=>values.map(value=>value.id===selected.id?{...value,status}:value));}}/>}</div>;
}
export const businessExamples={ClearProjectDetails:ProjectExample,ClearProjectTable:ProjectExample};
