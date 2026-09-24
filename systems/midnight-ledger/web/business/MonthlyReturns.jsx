import { LedgerBarChart } from '../Chart.jsx';
import { DataPanel } from './DataPanel.jsx';

export function LedgerMonthlyReturns({ data = [], ...state }) {
  return <DataPanel title="月度收益" className="ml-terminal__bars" empty={!data.length} {...state}><LedgerBarChart title="月度收益" data={data} unit="%"/></DataPanel>;
}
