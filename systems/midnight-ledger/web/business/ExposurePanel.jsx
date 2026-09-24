import { DataPanel } from './DataPanel.jsx';

export function LedgerExposurePanel({ items = [], ...state }) {
  const valid = items.every(item => Number.isFinite(item.value) && item.value >= 0 && item.value <= 100);
  return <DataPanel title="敞口构成" className="ml-terminal__exposure" empty={!items.length} {...state} error={state.error || (!valid ? '占比必须是 0–100 之间的数值' : undefined)}>
    <div className="ml-exposure-rings">{items.slice(0,2).map(item => <figure key={item.label}><svg viewBox="0 0 80 80" role="img" aria-label={`${item.label} ${item.value}%`}><circle cx="40" cy="40" r="30"/><circle cx="40" cy="40" r="30" className="ml-exposure-value" style={{strokeDasharray:`${item.value * 1.885} 188.5`}}/></svg><figcaption><strong>{item.value}%</strong><small>{item.label}</small></figcaption></figure>)}</div>
    <div className="ml-exposure-legend">{items.map(item => <span key={item.label}><i/>{item.label}<b>{item.value}%</b></span>)}</div>
  </DataPanel>;
}
