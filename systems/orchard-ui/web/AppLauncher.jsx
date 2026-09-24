import { useState } from 'react';
import { OrchardField, OrchardProgress } from './Controls.jsx';
import { OrchardAppIcon } from './Icons.jsx';

export function OrchardAppLauncher({ items = [], onLaunch, label = '常用应用', disabled = false, loading = false, error }) {
  const [query, setQuery] = useState('');
  const matches = items.filter(item => `${item.name} ${item.description ?? ''}`.toLowerCase().includes(query.trim().toLowerCase()));
  return <section className="ou-app-launcher" aria-label={label} aria-busy={loading || undefined}>
    <header><h3>{label}</h3><span>{items.length} 个入口</span></header>
    <OrchardField label="查找应用" type="search" placeholder="搜索应用…" value={query} onChange={event => setQuery(event.target.value)} disabled={disabled || loading} />
    <div className="ou-app-grid">{matches.map(item => <button key={item.id} type="button" aria-label={item.badge ? `${item.name}，${item.badge}` : undefined} disabled={disabled || loading || item.disabled || !onLaunch} onClick={() => onLaunch(item)} title={item.description}>
      <OrchardAppIcon symbol={item.symbol} src={item.src} tone={item.tone} badge={item.badge} />
      <span>{item.name}</span>
    </button>)}</div>
    {!matches.length && <p role="status">没有匹配的应用。</p>}
    {loading && <OrchardProgress label="正在加载应用" />}
    {error && <p role="alert" className="ou-error">{error}</p>}
  </section>;
}
