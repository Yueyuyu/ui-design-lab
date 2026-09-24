import { ArrowDown, ArrowUp } from '@phosphor-icons/react';
import { LedgerButton } from '../primitives.jsx';
import { DataPanel } from './DataPanel.jsx';

export function LedgerAssetSummary({ balance, currency = 'USD', today, month, totalReturn, onDeposit, onWithdraw, ...state }) {
  const valid = typeof balance === 'number' && Number.isFinite(balance);
  return <DataPanel title="总资产" tone="ledger" className="ml-terminal__asset" empty={!valid} {...state}>
    <strong className="ml-terminal__asset-value">{valid ? new Intl.NumberFormat('en-US', {style:'currency', currency}).format(balance) : '—'}</strong>
    <dl><div><dt>今日收益</dt><dd>{today ?? '—'}</dd></div><div><dt>本月收益</dt><dd>{month ?? '—'}</dd></div></dl>
    <div className="ml-terminal__asset-total"><span>累计收益率</span><strong>{totalReturn ?? '—'}</strong></div>
    {(onDeposit || onWithdraw) && <div className="ml-terminal__asset-actions">{onDeposit && <LedgerButton icon={ArrowDown} onClick={onDeposit}>入金</LedgerButton>}{onWithdraw && <LedgerButton variant="ledger" icon={ArrowUp} onClick={onWithdraw}>出金</LedgerButton>}</div>}
  </DataPanel>;
}
