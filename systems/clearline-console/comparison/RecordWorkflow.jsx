import { ClearButton, ClearField, ClearSelect, ClearPanel, ClearTextarea, ClearDataTable } from '../web/index.js';
import './records.css';

export function RecordDetail({ workflow, onWorkflowAction, visualState }) {
  const record = workflow.drafts[workflow.selectedId] ?? workflow.records.find(item => item.id === workflow.selectedId);
  if (!record) return <ClearPanel title="记录详情"><p>选择记录继续处理，关闭不会丢弃草稿。</p></ClearPanel>;
  const change = (key, value) => onWorkflowAction({ type: 'edit', record: { ...record, [key]: value } });
  return <ClearPanel title="记录详情" action={<ClearButton variant="ghost" onClick={() => onWorkflowAction({ type: 'close' })}>关闭详情并保留草稿</ClearButton>}>
    <form className="cc-record-form" onSubmit={event => { event.preventDefault(); onWorkflowAction({ type: 'save', record }); }}>
      <fieldset disabled={visualState !== 'default'}>
        <ClearField label="记录标题" value={record.title} required onChange={event => change('title', event.target.value)} />
        <ClearSelect label="记录状态" value={record.status} options={['未开始', '进行中', '已完成'].map(value => ({ value, label: value }))} onChange={event => change('status', event.target.value)} />
        <ClearField label="记录分类" value={record.category} onChange={event => change('category', event.target.value)} />
        <ClearTextarea label="记录笔记" rows={6} value={record.note} onChange={event => change('note', event.target.value)} />
        <div className="cc-record-actions"><ClearButton type="submit" disabled={!record.title.trim()}>保存记录</ClearButton><ClearButton variant="secondary" onClick={() => onWorkflowAction({ type: 'cancel' })}>取消编辑</ClearButton></div>
      </fieldset>
    </form>
  </ClearPanel>;
}

export function RecordWorkflow({ workflow, onWorkflowAction, visualState, onRetry }) {
  const config = workflow.views[workflow.view];
  const rows = workflow.records.filter(record => (config.status === '全部' || config.status === record.status) && [record.title, record.status, record.category, record.note].join(' ').toLowerCase().includes(config.query.toLowerCase()));
  if (config.sort === 'title') rows.sort((a, b) => a.title.localeCompare(b.title, 'zh-CN'));
  return <div className="cc-record-workflow"><header><h2>记录整理</h2><p>从目录选择记录，在右侧处理属性。更改仅保留在本次比较中。</p></header>
    {visualState !== 'default' && <ClearPanel title={visualState === 'loading' ? '正在加载记录…' : '记录暂时无法加载'}><p role={visualState === 'error' ? 'alert' : 'status'}>输入和草稿仍保留。</p>{visualState === 'error' && <ClearButton onClick={onRetry}>重新加载</ClearButton>}</ClearPanel>}
    <div className="cc-record-layout" data-detail-open={!!workflow.selectedId}>
      <div inert={visualState !== 'default' ? true : undefined}>
        <div className="cc-record-filters"><ClearField label="搜索记录" type="search" value={config.query} onChange={event => onWorkflowAction({ type: 'filter', patch: { query: event.target.value } })} />
          <ClearSelect label="筛选状态" value={config.status} options={['全部', '未开始', '进行中', '已完成'].map(value => ({ value, label: value }))} onChange={event => onWorkflowAction({ type: 'filter', patch: { status: event.target.value } })} />
          <ClearSelect label="记录排序" value={config.sort} options={[{value:"manual",label:"创建顺序"},{value:"title",label:"标题"}]} onChange={event => onWorkflowAction({type:"filter",patch:{sort:event.target.value}})} />
          <ClearButton onClick={() => onWorkflowAction({ type: 'create', id: crypto.randomUUID() })}>新建记录</ClearButton></div>
        <ClearDataTable caption="共享记录目录" rows={rows} showToolbar={false} selectable={false} pageSize={Math.max(1,rows.length)} selection={workflow.selectedId ? [workflow.selectedId] : []} columns={[
          { key: 'title', label: '名称', sortable:false, render: (value, record) => <ClearButton variant="ghost" onClick={() => onWorkflowAction({ type: 'open', id: record.id })}>{value}{workflow.drafts[record.id] ? ' · 草稿' : ''}</ClearButton> },
          { key: 'status', label: '状态', sortable:false }, { key: 'category', label: '分类', sortable:false },
        ]} />
      </div>
      {workflow.selectedId && <RecordDetail workflow={workflow} onWorkflowAction={onWorkflowAction} visualState={visualState} />}
    </div>
  </div>;
}
