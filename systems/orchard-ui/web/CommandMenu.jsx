import { useId, useState } from 'react';
import { OrchardField, OrchardProgress } from './Controls.jsx';
import { OrchardSymbol } from './Icons.jsx';

export function OrchardCommandMenu({ items = [], onSelect, label = '快捷操作', disabled = false, loading = false, error }) {
  const [query, setQuery] = useState('');
  const id = useId();
  const matches = items.filter(item => `${item.label} ${item.description ?? ''}`.toLowerCase().includes(query.trim().toLowerCase()));
  const blocked = disabled || loading || !onSelect;
  function navigate(event) {
    // 中文输入法用方向键选择候选时，不能把焦点移出搜索框。
    if (event.nativeEvent.isComposing || event.nativeEvent.keyCode === 229) return;
    if (!['ArrowDown', 'ArrowUp', 'Home', 'End'].includes(event.key)) return;
    if (event.target.tagName === 'INPUT' && ['Home', 'End'].includes(event.key)) return;
    const buttons = [...event.currentTarget.querySelectorAll('button:not(:disabled)')];
    if (!buttons.length) return;
    event.preventDefault();
    const index = buttons.indexOf(event.target);
    const next = event.key === 'Home' ? 0 : event.key === 'End' ? buttons.length - 1 : index < 0 ? (event.key === 'ArrowUp' ? buttons.length - 1 : 0) : (index + (event.key === 'ArrowDown' ? 1 : -1) + buttons.length) % buttons.length;
    buttons[next]?.focus();
  }
  return <section className="ou-command-menu" aria-label={label} aria-busy={loading || undefined} onKeyDown={navigate}>
    <OrchardField label={label} type="search" placeholder="搜索命令…" value={query} onChange={event => setQuery(event.target.value)} disabled={disabled || loading} aria-controls={`${id}-commands`} />
    <ul id={`${id}-commands`}>{matches.map(item => <li key={item.id}><button type="button" disabled={blocked || item.disabled} onClick={() => onSelect(item)}>
      <OrchardSymbol name={item.symbol ?? 'document'} size={20} /><span><strong>{item.label}</strong>{item.description && <small>{item.description}</small>}</span>{item.shortcut && <kbd>{item.shortcut}</kbd>}
    </button></li>)}</ul>
    {!matches.length && <p role="status">没有匹配的操作。</p>}
    {loading && <OrchardProgress label="正在加载操作" />}
    {error && <p className="ou-error" role="alert">{error}</p>}
    <footer>↑ ↓ 移动 · Enter 执行</footer>
  </section>;
}
