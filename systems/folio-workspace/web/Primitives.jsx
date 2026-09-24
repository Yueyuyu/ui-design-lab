import { forwardRef, useId } from 'react';
import { Check, CircleNotch, Info, WarningCircle } from '@phosphor-icons/react';
export const FolioButton = forwardRef(function FolioButton({ children, tone = 'quiet', loading = false, disabled, className = '', ...props }, ref) {
  return <button ref={ref} type="button" {...props} disabled={disabled || loading} aria-busy={loading || undefined} className={`fw-button fw-button--${tone} ${className}`}>{loading && <CircleNotch size={16} aria-hidden="true" />}{children}</button>;
});
export function FolioStatus({ value }) { return <span className="fw-status" data-status={value}>{value}</span>; }
export function FolioCallout({ children, tone = 'note', action }) {
  const Icon = tone === 'error' ? WarningCircle : Info;
  return <div className="fw-callout" data-tone={tone} role={tone === 'error' ? 'alert' : 'note'}><Icon size={19} aria-hidden="true" /><div>{children}</div>{action}</div>;
}
export function FolioPageHeader({ title, onChange, disabled = false }) {
  const id = useId();
  return <header className="fw-page-header"><span className="fw-page-mark" aria-hidden="true">▤</span><h1 className="fw-sr-only">{title || '未命名页面'}</h1><label className="fw-sr-only" htmlFor={id}>页面标题</label><input className="fw-page-title" id={id} value={title} onChange={e => onChange(e.target.value)} disabled={disabled} placeholder="未命名页面" /><div className="fw-page-meta"><span><Check size={14} /> 私人手记</span><span>文字 · 发现 · 下一步</span></div></header>;
}
