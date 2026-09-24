import { FolioButton, FolioCallout, FolioDatabase, FolioRecordDetail } from '../web/index.js';
import '../foundations/tokens.css';
import '../web/components.css';
import './comparison.css';

export function Status({ suite }) { return <span>实验 · v{suite.version}</span>; }

function RecordDetail({ workflow, onWorkflowAction, visualState }) {
  const record = workflow.drafts[workflow.selectedId] ?? workflow.records.find(item => item.id === workflow.selectedId);
  return record ? <FolioRecordDetail record={record} autoFocus={false} disabled={visualState !== 'default'}
    onChange={value => onWorkflowAction({ type: 'edit', record: value })}
    onSave={value => onWorkflowAction({ type: 'save', record: value })}
    onCancel={() => onWorkflowAction({ type: 'cancel' })} onClose={() => onWorkflowAction({ type: 'close' })} /> : <FolioCallout>打开一条记录查看详情；未保存的草稿仍保留。</FolioCallout>;
}

export function Scene({ workflow, onWorkflowAction, visualState, onRetry }) {
  return <div className="fw-comparison">
    <header><p className="fw-muted">资料 / 研究记录</p><h2>记录整理</h2><p>在纸面集合中查找、编辑和整理下一步。更改仅保留在本次比较中。</p></header>
    {visualState !== 'default' && <FolioCallout tone={visualState === 'error' ? 'error' : 'note'} action={visualState === 'error' && <FolioButton onClick={onRetry}>重新加载</FolioButton>}><span role={visualState === 'error' ? 'alert' : 'status'}>{visualState === 'error' ? '记录暂时无法加载，输入和草稿仍保留。' : '正在加载记录，已有内容暂不可编辑…'}</span></FolioCallout>}
    <div className="fw-writing-layout" data-detail-open={!!workflow.selectedId}>
      <div inert={visualState !== 'default' ? true : undefined}>
        <FolioDatabase records={workflow.records} view={workflow.view} config={workflow.views[workflow.view]} activeId={workflow.selectedId} draftIds={Object.keys(workflow.drafts)}
          onViewChange={view => onWorkflowAction({ type: 'view', view })} onConfigChange={patch => onWorkflowAction({ type: 'filter', patch })}
          onOpen={id => onWorkflowAction({ type: 'open', id })} onCreate={() => onWorkflowAction({ type: 'create', id: crypto.randomUUID() })} />
      </div>
      {workflow.selectedId && <RecordDetail workflow={workflow} onWorkflowAction={onWorkflowAction} visualState={visualState} />}
    </div>
  </div>;
}

export function Module({ moduleId, ...props }) {
  if (moduleId === 'record-detail') return <RecordDetail {...props} />;
  return <div className="fw-view-tabs"><FolioButton>默认操作</FolioButton><FolioButton disabled>不可用</FolioButton><FolioButton loading>正在保存</FolioButton></div>;
}
