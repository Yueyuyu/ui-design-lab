import { useRef, useState } from 'react';
import { DownloadSimple, List } from '@phosphor-icons/react';
import { FolioButton, FolioCallout, FolioPageHeader } from './Primitives.jsx';
import { FolioPageTree, FolioBreadcrumbs } from './Navigation.jsx';
import { FolioBlockEditor } from './BlockEditor.jsx';
import { FolioDatabase } from './Database.jsx';
import { FolioRecordDetail } from './RecordDetail.jsx';
import { createFolioPage, folioId } from './model.js';
import { useFolioStorage } from './useFolioStorage.js';

export function FolioWorkspace({ storageKey = 'folio-workspace-v1' }) {
  // storageKey 界定独立工作区；调用方切换键时用 React key 重新挂载实例。
  const { document, setDocument, status, error, retry } = useFolioStorage(storageKey);
  const [selected, setSelected] = useState(null);
  const [showTree, setShowTree] = useState(false);
  const [notice, setNotice] = useState('');
  const origin = useRef(null);
  const workspaceRef = useRef(null);
  const page = document.pages.find(item => item.id === document.activePage);
  const disabled = error === 'read';
  const updatePage = update => setDocument(previous => ({ ...previous, pages: previous.pages.map(item => item.id === page.id ? (typeof update === 'function' ? update(item) : { ...item, ...update }) : item) }));
  const selectPage = id => { setDocument(previous => ({ ...previous, activePage: id })); setSelected(null); setShowTree(false); setNotice(''); };
  const createPage = parentId => { const next = createFolioPage('未命名页面', parentId); setDocument(previous => ({ ...previous, pages: [...previous.pages, next], activePage: next.id })); setSelected(null); setShowTree(false); setNotice('页面已创建，可编辑标题和内容。'); };
  const closeDetail = () => { setSelected(null); requestAnimationFrame(() => {
    // 保存可能让记录移出当前分组/筛选，触发点消失时回到当前视图页签。
    const target = origin.current?.isConnected ? origin.current : workspaceRef.current?.querySelector('[role="tab"][aria-selected="true"]');
    target?.focus();
  }); };
  const openRecord = (id, trigger) => { origin.current = trigger; if (!page.drafts[id]) updatePage(item => ({ ...item, drafts: { ...item.drafts, [id]: { ...item.records.find(row => row.id === id) } } })); setSelected(id); };
  const newRecord = trigger => { const id = folioId(); origin.current = trigger; updatePage(item => ({ ...item, drafts: { ...item.drafts, [id]: { id, title: '', category: '', status: '未开始', note: '' } } })); setSelected(id); };
  const saveRecord = record => { updatePage(item => { const drafts = { ...item.drafts }; delete drafts[record.id]; return { ...item, drafts, records: item.records.some(row => row.id === record.id) ? item.records.map(row => row.id === record.id ? record : row) : [...item.records, record] }; }); setNotice('记录已更新，所有视图共享这次修改。'); closeDetail(); };
  const cancelRecord = () => { updatePage(item => { const drafts = { ...item.drafts }; delete drafts[selected]; return { ...item, drafts }; }); setNotice('已取消编辑，原记录保持不变。'); closeDetail(); };
  function exportDocument() {
    const url = URL.createObjectURL(new Blob([JSON.stringify(document, null, 2)], { type: 'application/json' }));
    const anchor = window.document.createElement('a'); anchor.href = url; anchor.download = 'folio-workspace.json'; anchor.click(); setTimeout(() => URL.revokeObjectURL(url), 1000);
    setNotice('已导出本地页面、记录与草稿。');
  }
  return <div ref={workspaceRef} className="fw-workspace" data-tree-open={showTree}>
    <FolioPageTree pages={document.pages} activeId={page.id} onSelect={selectPage} onCreate={createPage} disabled={disabled} />
    <div className="fw-workspace-main"><div className="fw-workspace-top"><FolioButton className="fw-mobile-menu" aria-label="切换页面目录" aria-expanded={showTree} onClick={() => setShowTree(value => !value)}><List size={18} /></FolioButton><FolioBreadcrumbs pages={document.pages} activeId={page.id} onSelect={selectPage} /><span className="fw-save-status" role="status">{status === 'saved' ? '已保存到此浏览器' : status === 'saving' ? '正在保存…' : status === 'session' ? '临时预览' : '保存需要处理'}</span><FolioButton aria-label="导出工作区 JSON" onClick={exportDocument}><DownloadSimple size={17} /></FolioButton></div>
      {error && <FolioCallout tone="error" action={<FolioButton onClick={retry}>重试{error === 'read' ? '读取' : '保存'}</FolioButton>}>{error === 'read' ? '无法读取本地内容。当前只读示例不会覆盖原始内容，请恢复浏览器存储后重试。' : '内容暂未保存，当前编辑仍在内存中。请重试，或导出 JSON 备份。'}</FolioCallout>}
      <div className="fw-writing-layout" data-detail-open={!!selected}><article className="fw-document"><FolioPageHeader title={page.title} onChange={title => updatePage({ title })} disabled={disabled} /><FolioCallout>好想法不必一次写完。先记下来，再慢慢整理。</FolioCallout><FolioBlockEditor key={page.id} blocks={page.blocks} onChange={blocks => updatePage({ blocks })} disabled={disabled} />
        <FolioDatabase records={page.records} view={page.view} config={page.views[page.view]} onViewChange={view => updatePage({ view })} onConfigChange={patch => updatePage(item => ({ ...item, views: { ...item.views, [item.view]: { ...item.views[item.view], ...patch } } }))} onOpen={openRecord} onCreate={newRecord} disabled={disabled} activeId={selected} draftIds={Object.keys(page.drafts)} />
        {!!Object.keys(page.drafts).length && <div className="fw-drafts"><span>未完成的草稿</span>{Object.values(page.drafts).map(record => <FolioButton key={record.id} onClick={e => { origin.current = e.currentTarget; setSelected(record.id); }}>{record.title || '未命名记录'}</FolioButton>)}</div>}
        <p className="fw-notice" role="status">{notice || '这是你的纸面：点击文字编辑，空白块输入 / 插入内容。'}</p></article>
        {selected && page.drafts[selected] && <FolioRecordDetail record={page.drafts[selected]} onChange={record => updatePage(item => ({ ...item, drafts: { ...item.drafts, [record.id]: record } }))} onSave={saveRecord} onCancel={cancelRecord} onClose={closeDetail} disabled={disabled} />}
      </div>
    </div>
  </div>;
}
