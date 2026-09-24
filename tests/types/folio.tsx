import { useState } from 'react';
import { FolioWorkspace, FolioBlockEditor, FolioDatabase, FolioRecordDetail, FolioButton, createFolioDocument } from 'ui-design-lab/folio-workspace';
import type { FolioRecord } from 'ui-design-lab/folio-workspace';
export function Notebook() {
  const [page,setPage]=useState(createFolioDocument().pages[0]);
  const [record,setRecord]=useState<FolioRecord>(page.records[0]);
  return <section data-ui-system="folio-workspace"><FolioWorkspace storageKey="typed-notebook"/><FolioBlockEditor blocks={page.blocks} onChange={blocks=>setPage({...page,blocks})}/><FolioDatabase records={page.records} view={page.view} config={page.views[page.view]} onViewChange={view=>setPage({...page,view})} onConfigChange={()=>{}} onOpen={id=>setRecord(page.records.find(r=>r.id===id)!)} onCreate={()=>{}}/><FolioRecordDetail record={record} onChange={setRecord} onSave={setRecord} onCancel={()=>{}} onClose={()=>{}}/><FolioButton loading>保存中</FolioButton></section>;
}
