export function ClearProgress({
  label,
  value,
  max = 100
}) {
  const limit = Number.isFinite(max) && max > 0 ? max : 100;
  const safe = typeof value === "number" && Number.isFinite(value) ? Math.max(0, Math.min(limit, value)) : undefined;
  return <label className="cc-control">{label}<progress value={safe} max={limit} /><small>{safe === undefined ? "处理中…" : Math.round(safe / limit * 100) + "%"}</small></label>;
}
export function ClearSkeleton({
  label = "正在加载",
  rows = 3
}) {
  return <div className="cc-skeleton" role="status" aria-label={label}>{Array.from({
      length: Math.max(1, Math.min(rows, 10))
    }, (_, i) => <i key={i} aria-hidden="true" />)}<span>{label}</span></div>;
}
export function ClearToastQueue({
  items,
  onDismiss
}) {
  return <ol className="cc-toasts" aria-label="通知队列">{items.map(item => <li key={item.id} role={item.tone === "error" ? "alert" : "status"}><span>{item.message}</span>{item.onRetry ? <button type="button" onClick={item.onRetry}>重试</button> : null}<button type="button" onClick={() => onDismiss?.(item.id)} aria-label={"关闭通知：" + item.message}>×</button></li>)}</ol>;
}
