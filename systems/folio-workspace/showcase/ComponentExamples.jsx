import {useId,useState} from 'react';
import * as Kit from '../web/index.js';

function FolioExample({entry,state,catalog}) {
  const [document,setDocument]=useState(Kit.createFolioDocument);
  const [message,setMessage]=useState('');
  const [record,setRecord]=useState(document.pages[0].records[0]);
  const [view,setView]=useState('table');
  const panelId=useId();
  const C=Kit[entry.exportName];
  const page=document.pages.find(item=>item.id===document.activePage);
  const update=patch=>setDocument(value=>({...value,pages:value.pages.map(item=>item.id===value.activePage?{...item,...patch}:item)}));
  const select=id=>setDocument(value=>({...value,activePage:id}));
  const create=parentId=>{const next=Kit.createFolioPage('新建页面',parentId);setDocument(value=>({...value,pages:[...value.pages,next],activePage:next.id}));};
  const disabled=state==='disabled';
  const props={
    Button:{tone:'solid',disabled,loading:state==='loading',children:'保存更改',onClick:()=>setMessage('已触发保存')},
    Status:{value:'进行中'},
    Callout:{children:'保存失败时保留当前输入并提供恢复入口。',tone:'error',action:<Kit.FolioButton onClick={()=>setMessage('重试回调已触发')}>重试</Kit.FolioButton>},
    PageHeader:{title:page.title,onChange:title=>update({title}),disabled},
    PageTree:{pages:document.pages,activeId:document.activePage,onSelect:select,onCreate:create,disabled},
    Breadcrumbs:{pages:document.pages,activeId:document.activePage,onSelect:select},
    BlockEditor:{blocks:page.blocks,onChange:blocks=>update({blocks}),disabled},
    ViewTabs:{value:view,onChange:setView,panelId},
    Database:{records:page.records,view:page.view,config:page.views[page.view],onViewChange:next=>update({view:next}),onConfigChange:patch=>update({views:{...page.views,[page.view]:{...page.views[page.view],...patch}}}),onOpen:id=>setMessage(`打开记录：${page.records.find(item=>item.id===id)?.title}`),onCreate:()=>{update({records:[...page.records,{id:crypto.randomUUID(),title:'新建记录',status:'未开始',category:'',note:''}]});},disabled},
    RecordDetail:{record,autoFocus:!catalog,onChange:setRecord,onSave:value=>setMessage(`已保存：${value.title}`),onCancel:()=>{setRecord(document.pages[0].records[0]);setMessage('已恢复原记录');},onClose:()=>setMessage('关闭回调已触发；文档示例保留侧栏以供检查'),disabled},
    Workspace:{storageKey:null}
  }[entry.suffix];
  return <div className="doc-example"><C {...props}/>{entry.suffix==='ViewTabs'&&<div id={panelId} role="tabpanel">当前视图：{view}</div>}<p role="status">{message}</p></div>;
}
export const componentExamples=Object.fromEntries(['Button','Status','Callout','PageHeader','PageTree','Breadcrumbs','BlockEditor','ViewTabs','Database','RecordDetail','Workspace'].map(suffix=>[`Folio${suffix}`,FolioExample]));
