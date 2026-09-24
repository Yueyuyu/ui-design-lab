import { LedgerPanel, LedgerButton } from '../primitives.jsx';

// 数据边界在业务面板内处理，禁止用示例数字替代缺失数据。
export function DataPanel({ title, loading, error, empty, disabled, onRetry, children, ...props }) {
  return <LedgerPanel title={title} {...props} aria-busy={loading || undefined}>
    {loading ? <p role="status">正在读取数据…</p> : error ? <div role="alert"><p>{error}</p>{onRetry && <LedgerButton onClick={onRetry}>重试</LedgerButton>}</div> : empty ? <p>暂无数据</p> : <div className="ml-data-panel-content" inert={disabled || undefined} aria-disabled={disabled || undefined}>{children}</div>}
  </LedgerPanel>;
}
