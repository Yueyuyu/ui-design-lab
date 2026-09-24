import { LedgerLineChart } from '../Chart.jsx';
import { DataPanel } from './DataPanel.jsx';

export function LedgerStrategyPanel({ metrics = [], trend = [], description, ...state }) {
  return <DataPanel title="策略演化" className="ml-terminal__strategy" empty={!metrics.length && !trend.length} {...state}>
    <dl>{metrics.map(item => <div key={item.label}><dt>{item.value}</dt><dd>{item.label}</dd></div>)}</dl>
    {trend.length > 0 && <LedgerLineChart title="迭代趋势" data={trend}/>}{description && <small>{description}</small>}
  </DataPanel>;
}
