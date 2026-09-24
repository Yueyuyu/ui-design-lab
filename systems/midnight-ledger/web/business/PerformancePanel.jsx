import { LedgerMetric } from '../primitives.jsx';
import { LedgerLineChart } from '../Chart.jsx';
import { DataPanel } from './DataPanel.jsx';

export function LedgerPerformancePanel({ metrics = [], data = [], labels, period = '30D', periods = ['7D','30D','全部'], onPeriodChange, ...state }) {
  return <DataPanel title="收益表现" className="ml-terminal__performance" empty={!data.length} {...state}>
    <div className="ml-performance-summary">
    <div className="ml-terminal__metrics">{metrics.map(metric => <LedgerMetric key={metric.label} {...metric}/>)}</div>
    <div className="ml-terminal__periods" aria-label="收益周期">{periods.map(item => <button type="button" key={item} aria-pressed={period === item} data-active={period === item} disabled={!onPeriodChange} onClick={() => onPeriodChange?.(item)}>{item}</button>)}</div>
    </div>
    <LedgerLineChart title="累计收益率" data={data} labels={labels} unit="%" period={period}/>
  </DataPanel>;
}
