import { useEffect, useId, useRef, useState } from 'react';
import { ArrowSquareOut, X } from '@phosphor-icons/react';
import { FolioButton } from './Primitives.jsx';
import { folioStatuses } from './model.js';
export function FolioRecordDetail({ record, onChange, onSave, onCancel, onClose, disabled = false, autoFocus = true }) {
  const input = useRef(null);
  const errorId = useId();
  const [error, setError] = useState('');
  useEffect(() => {
    const trigger = document.activeElement;
    return () => { if (document.activeElement === document.body && trigger?.isConnected) trigger.focus(); };
  }, []);
  useEffect(() => { if(autoFocus) input.current?.focus(); setError(''); }, [record.id,autoFocus]);
  return <aside className="fw-record-detail" aria-label="记录详情" onKeyDown={e => { if (e.key === 'Escape' && !e.nativeEvent.isComposing) { e.stopPropagation(); onClose(); } }}><header><span><ArrowSquareOut size={16} />侧开详情</span><FolioButton aria-label="关闭详情并保留草稿" onClick={onClose}><X size={17} /></FolioButton></header><p className="fw-muted">草稿保留到保存或取消；左侧仍可操作。</p><form onSubmit={e => { e.preventDefault(); if (!record.title.trim()) { setError('请填写记录标题。'); input.current?.focus(); return; } onSave({ ...record, title: record.title.trim() }); }}><label>记录标题<input ref={input} value={record.title} disabled={disabled} aria-invalid={!!error} aria-describedby={error ? errorId : undefined} onChange={e => { onChange({ ...record, title: e.target.value }); setError(''); }} /></label>{error && <p className="fw-error" role="alert" id={errorId}>{error}</p>}<label>记录状态<select value={record.status} disabled={disabled} onChange={e => onChange({ ...record, status: e.target.value })}>{folioStatuses.map(value => <option key={value}>{value}</option>)}</select></label><label>记录分类<input value={record.category} disabled={disabled} onChange={e => onChange({ ...record, category: e.target.value })} /></label><label>记录笔记<textarea aria-label="记录笔记" rows={6} value={record.note} disabled={disabled} onChange={e => onChange({ ...record, note: e.target.value })} /></label><footer><FolioButton type="submit" tone="solid" disabled={disabled}>保存记录</FolioButton><FolioButton disabled={disabled} onClick={onCancel}>取消编辑</FolioButton></footer></form></aside>;
}
