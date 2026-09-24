import { useId, useState } from 'react';
import { Question, SpinnerGap } from '@phosphor-icons/react';
import { OrchardField } from './Controls.jsx';
import { orchardSymbols, symbolById } from './icon-library.js';

export function OrchardSymbol({ name, size = 20, weight = 'regular', label }) {
  const Glyph = symbolById.get(name)?.icon ?? Question;
  return <Glyph size={size} weight={weight} role={label ? 'img' : undefined} aria-label={label} aria-hidden={label ? undefined : true} />;
}

export function OrchardAppIcon({ symbol = 'folder', src, label, size = 64, tone = 'blue', badge }) {
  const [failedSource, setFailedSource] = useState(null);
  const showImage = src && src !== failedSource;
  return <span className="ou-app-icon" data-tone={tone} data-artwork={!!showImage} style={{ width: size, height: size }} role={label ? 'img' : undefined} aria-label={label ? `${label}${badge ? `，${badge}` : ''}` : undefined} aria-hidden={label ? undefined : true}>
    {showImage ? <img src={src} alt="" onError={() => setFailedSource(src)} /> : <OrchardSymbol name={symbol} size={size * .52} weight="duotone" />}
    {badge && <span className="ou-app-icon-badge" aria-hidden="true">{badge}</span>}
  </span>;
}

export function OrchardIconPicker({ value, onChange, label = '选择图标', disabled = false, loading = false, error }) {
  const [query, setQuery] = useState('');
  const id = useId();
  const matches = orchardSymbols.filter(item => `${item.id} ${item.label} ${item.category}`.toLowerCase().includes(query.trim().toLowerCase()));
  const current = symbolById.get(value);
  const unavailable = disabled || loading || !onChange;
  return <section className="ou-icon-picker" aria-label={label} aria-busy={loading || undefined}>
    <header><strong>{label}</strong><span>{current?.label ?? '尚未选择'}</span></header>
    <OrchardField label="搜索图标" type="search" placeholder="名称或用途，例如：音乐" value={query} onChange={event => setQuery(event.target.value)} disabled={disabled || loading} />
    <div className="ou-symbol-grid" role="group" aria-label="图标候选" aria-describedby={error ? `${id}-error` : undefined}>
      {matches.map(item => <button type="button" key={item.id} aria-label={item.label} aria-pressed={value === item.id} title={`${item.label} · ${item.id}`} disabled={unavailable} onClick={() => onChange(item.id)} onKeyDown={event => {
        if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
        event.preventDefault();
        const buttons = [...event.currentTarget.parentElement.querySelectorAll('button:not(:disabled)')];
        const index = buttons.indexOf(event.currentTarget);
        const next = event.key === 'Home' ? 0 : event.key === 'End' ? buttons.length - 1 : (index + (event.key === 'ArrowRight' ? 1 : -1) + buttons.length) % buttons.length;
        buttons[next]?.focus();
      }}><OrchardSymbol name={item.id} size={25} /></button>)}
    </div>
    {!matches.length && <p role="status">没有匹配图标，试试其他名称。</p>}
    {loading && <p role="status"><SpinnerGap className="ou-spin" aria-hidden="true" /> 正在准备图标…</p>}
    {error && <p id={`${id}-error`} role="alert" className="ou-error">{error}</p>}
    <footer><span>{matches.length} 个符号</span><code>{current ? current.id : '—'}</code></footer>
  </section>;
}
