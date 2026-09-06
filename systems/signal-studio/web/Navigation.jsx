import { useId } from "react";
export function SignalShell({
  brand,
  navigation,
  activeId,
  onNavigate,
  title,
  actions,
  children
}) {
  return <div className="ss-shell"><aside><strong>{brand}</strong><nav aria-label="工作台导航">{navigation.map(item => <button type="button" key={item.id} aria-current={activeId === item.id ? "page" : undefined} onClick={() => onNavigate?.(item.id)}>{item.label}</button>)}</nav><div className="ss-shell-actions">{actions}</div></aside><div className="ss-shell-main"><header><h2>{title}</h2></header><main>{children}</main></div></div>;
}
export function SignalTabs({
  items,
  value,
  onChange,
  label = "页面分区",
  disabled = false
}) {
  const id = useId(),
    active = items.find(item => item.id === value) ?? items[0];
  const change = (e, index) => {
    const enabled = items.filter(i => !i.disabled);
    const pos = enabled.findIndex(i => i.id === items[index].id);
    const offset = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0;
    const next = e.key === "Home" ? enabled[0] : e.key === "End" ? enabled.at(-1) : offset ? enabled[(pos + offset + enabled.length) % enabled.length] : null;
    if (next) {
      e.preventDefault();
      onChange?.(next.id);
      document.getElementById(id + "-" + next.id)?.focus();
    }
  };
  return <div><div className="ss-tabs" role="tablist" aria-label={label}>{items.map((item, index) => <button type="button" role="tab" id={id + "-" + item.id} aria-controls={id + "-panel"} key={item.id} aria-selected={active?.id === item.id} tabIndex={active?.id === item.id ? 0 : -1} disabled={disabled || item.disabled} onKeyDown={e => change(e, index)} onClick={() => onChange?.(item.id)}>{item.label}</button>)}</div><section role="tabpanel" id={id + "-panel"} aria-labelledby={id + "-" + active?.id} tabIndex={0}>{active?.content}</section></div>;
}
export function SignalBreadcrumb({
  items,
  label = "当前位置"
}) {
  return <nav className="ss-breadcrumb" aria-label={label}><ol>{items.map((item, index) => <li key={index}>{index === items.length - 1 ? <span aria-current="page">{item.label}</span> : <a href={item.href} onClick={item.onClick}>{item.label}</a>}</li>)}</ol></nav>;
}
export function SignalPagination({
  page,
  pageCount,
  onChange,
  disabled
}) {
  const total = Math.max(1, pageCount),
    current = Math.min(total, Math.max(1, page));
  return <nav className="ss-pagination" aria-label="分页"><button type="button" disabled={disabled || current <= 1} onClick={() => onChange?.(current - 1)}>上一页</button><span aria-live="polite">第 {current} / {total} 页</span><button type="button" disabled={disabled || current >= total} onClick={() => onChange?.(current + 1)}>下一页</button></nav>;
}
