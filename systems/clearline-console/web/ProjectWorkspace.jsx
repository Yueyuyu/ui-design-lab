import { Plus, SquaresFour, Folder, Users, Gear } from '@phosphor-icons/react';
import { useEffect, useRef, useState } from 'react';
import { ClearShell } from './Navigation.jsx';
import { ClearProjectTable, ClearProjectDetails } from './ProjectComponents.jsx';
import { ClearButton, ClearField, ClearPanel } from './primitives.jsx';
import { ClearDrawer } from './Overlays.jsx';
import { projectExamples } from './demo-data.js';

export function ClearProjectWorkspace({ rows: controlledRows, defaultRows = projectExamples, onRowsChange, onSaveProject, loading = false, error: loadError, onRetry, readOnly = false } = {}) {
  const [localRows, setLocalRows] = useState(defaultRows);
  const rows = controlledRows ?? localRows;
  const [selectedId, setSelectedId] = useState(() => rows[2]?.id ?? rows[0]?.id ?? null);
  const [nav, setNav] = useState('projects');
  const [creating, setCreating] = useState(false);
  const [draft, setDraft] = useState(null);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const request = useRef(null);
  const latestRows = useRef(rows);
  latestRows.current = rows;
  const selected = rows.find(row => row.id === selectedId) ?? null;
  const editable = !readOnly && (controlledRows === undefined || !!onRowsChange);
  const blocked = saving || loading || !!loadError || !editable;
  useEffect(() => () => request.current?.abort(), []);

  const close = () => { request.current?.abort(); request.current = null; setSaving(false); setDraft(null); setCreating(false); setError(''); };
  const select = project => { close(); setSelectedId(project?.id ?? null); setMessage(''); };
  const start = () => {
    setDraft({ id: crypto.randomUUID(), name: '', owner: 'You', status: 'Planning', date: '', description: '' });
    setCreating(true); setError(''); setMessage('');
  };
  const save = async () => {
    if (!draft || blocked || request.current) return;
    if (!draft.name.trim()) { setError('请输入项目名称'); return; }
    const controller = new AbortController(); request.current = controller;
    const submitted = { ...draft, name: draft.name.trim() };
    setSaving(true); setError(''); setMessage('');
    try {
      const saved = onSaveProject ? await onSaveProject(submitted, { signal: controller.signal }) : { ...submitted, date: new Date().toISOString().slice(0, 10) };
      // 关闭或卸载后，忽略不遵守 AbortSignal 的迟到结果。
      if (controller.signal.aborted || request.current !== controller) return;
      if (!saved || saved.id !== submitted.id || ['name', 'owner', 'status', 'date'].some(key => typeof saved[key] !== 'string')) throw new Error('保存服务没有返回完整项目，请检查接入接口。');
      const current = latestRows.current;
      const next = current.some(row => row.id === saved.id) ? current.map(row => row.id === saved.id ? saved : row) : [...current, saved];
      onRowsChange?.(next);
      if (controlledRows === undefined) setLocalRows(next);
      setSelectedId(saved.id); setDraft(null); setCreating(false);
      setMessage(onSaveProject ? '项目已保存。' : '已更新本次演示；刷新后恢复示例。');
    } catch (failure) {
      if (!controller.signal.aborted) setError(failure instanceof Error ? failure.message : '项目保存失败，请重试。');
    } finally {
      if (request.current === controller) { request.current = null; setSaving(false); }
    }
  };
  const feedback = <><p role="status">{saving ? '正在保存项目…' : message}</p>{error && <p className="cc-save-error" role="alert">{error} 草稿已保留。</p>}</>;
  return <ClearShell brand="Clearline Console" navigation={[
    { id: 'overview', label: 'Overview', icon: <SquaresFour size={18} /> },
    { id: 'projects', label: 'Projects', icon: <Folder size={18} /> },
    { id: 'teams', label: 'Teams', icon: <Users size={18} /> },
    { id: 'settings', label: 'Settings', icon: <Gear size={18} /> },
  ]} activeId={nav} onNavigate={id => { close(); setNav(id); }} title={nav === 'projects' ? 'Projects' : nav === 'teams' ? 'Teams' : nav === 'settings' ? 'Settings' : 'Overview'}
    actions={<ClearButton disabled={blocked} onClick={start}><Plus size={18} aria-hidden="true" /> Add project</ClearButton>}>
    {nav === 'projects' ? <>
      {!creating && feedback}
      <div className="cc-project-grid" data-detail-open={!!selected}><ClearProjectTable rows={rows} selectedId={selectedId} onSelect={select} loading={loading} error={loadError} onRetry={onRetry} />
        {selected && <div><ClearProjectDetails project={!creating && draft?.id === selected.id ? draft : selected} disabled={blocked} onStatusChange={status => { setDraft({ ...(draft ?? selected), status }); setError(''); setMessage(''); }} onClose={() => { close(); setSelectedId(null); }} />
          {!creating && draft && <div className="cc-workspace-actions"><ClearButton loading={saving} disabled={loading || !!loadError || !editable} onClick={save}>{error ? '重试保存项目' : '保存项目'}</ClearButton><ClearButton variant="secondary" onClick={close}>取消编辑</ClearButton></div>}
        </div>}
      </div>
    </> : nav === 'teams' ? <ClearPanel title="Project owners">{[...new Set(rows.map(row => row.owner))].map(owner => <p key={owner}>{owner} · {rows.filter(row => row.owner === owner).length} projects</p>)}</ClearPanel>
      : nav === 'settings' ? <ClearPanel title="Directory settings"><p>项目目录由接入方提供数据与保存服务。权限、团队和审计由业务项目负责。</p><ClearButton onClick={() => setNav('projects')}>Back to projects</ClearButton></ClearPanel>
      : <ClearPanel title={rows.length + ' active projects'}><p>{rows.filter(row => row.status === 'At risk').length} projects need attention.</p><ClearButton onClick={() => setNav('projects')}>Review projects</ClearButton></ClearPanel>}
    <ClearDrawer open={creating} onOpenChange={open => { if (!open) close(); }} title="Add project">
      {feedback}
      {creating && draft && <form className="cc-project-create" onSubmit={event => { event.preventDefault(); save(); }}>
        <ClearField label="Project name" value={draft.name} disabled={blocked} error={error && !draft.name.trim() ? error : undefined} onChange={event => setDraft({ ...draft, name: event.target.value })} />
        <ClearButton type="submit" loading={saving} disabled={loading || !!loadError || !editable}>{error ? '重试保存项目' : 'Create project'}</ClearButton>
        <ClearButton variant="secondary" onClick={close}>取消编辑</ClearButton>
      </form>}
    </ClearDrawer>
  </ClearShell>;
}
