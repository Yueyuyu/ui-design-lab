import { LedgerStatusBadge } from '../primitives.jsx';
import { DataPanel } from './DataPanel.jsx';

export function LedgerHoldingsPanel({ rows = [], summary, onRowActivate, ...state }) {
  const Row = onRowActivate ? 'button' : 'div';
  return <DataPanel title={`当前持仓 · ${rows.length}`} action={summary && <strong>{summary}</strong>} className="ml-terminal__holdings" empty={!rows.length} {...state}>
    <div className="ml-holdings-list">{rows.map(row => <Row type={onRowActivate ? 'button' : undefined} className="ml-holding-row" key={row.id} onClick={onRowActivate ? () => onRowActivate(row) : undefined}>
      <span><strong>{row.symbol}</strong><span><LedgerStatusBadge>{row.side}</LedgerStatusBadge><LedgerStatusBadge tone={row.market==='期权'?'option':'neutral'}>{row.market}</LedgerStatusBadge></span><small>{row.detail}</small></span>
      <i data-tone={row.tone}/><span data-tone={row.tone}><strong>{row.change}</strong><small>{row.pnl}</small></span>
    </Row>)}</div>
  </DataPanel>;
}
