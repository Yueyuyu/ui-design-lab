import { useState } from 'react';
import { LedgerStatusBadge } from './primitives.jsx';
import { LedgerAssetSummary } from './business/AssetSummary.jsx';
import { LedgerPerformancePanel } from './business/PerformancePanel.jsx';
import { LedgerHoldingsPanel } from './business/HoldingsPanel.jsx';
import { LedgerPnlCalendar } from './business/PnlCalendar.jsx';
import { LedgerExposurePanel } from './business/ExposurePanel.jsx';
import { LedgerStrategyPanel } from './business/StrategyPanel.jsx';
import { LedgerMonthlyReturns } from './business/MonthlyReturns.jsx';
import { CompactConsole } from './CompactConsole.jsx';
import { CockpitPreview } from './CockpitPreview.jsx';
import { terminalHoldings, terminalDays, terminalMetrics } from './terminal-data.js';

export function LedgerTerminalPreview({ mode = 'overview', onNotify }) {
  const [period, setPeriod] = useState('30D');
  const [selection, setSelection] = useState('');
  const [message, setMessage] = useState('');
  const notify = text => { setMessage(text); onNotify?.(text); };
  if (mode === 'compact') return <CompactConsole onNotify={onNotify}/>;
  if (mode === 'cockpit') return <CockpitPreview onNotify={onNotify}/>;
  return <section className="ml-terminal-preview"><header className="ml-terminal__topbar"><span><strong>资产工作台</strong><small>2026 年 8 月 · 本地示例</small><LedgerStatusBadge>演示数据</LedgerStatusBadge></span><LedgerStatusBadge tone="positive">市场情绪 · 美 68</LedgerStatusBadge></header>
    <div className="ml-terminal-grid">
      <LedgerAssetSummary balance={24615.83} today="+$339.64 · +1.38%" month="+$408.31 · +1.69%" totalReturn="+31.8%" onDeposit={() => notify('入金操作示例；未接入资金服务')} onWithdraw={() => notify('出金操作示例；未接入资金服务')}/>
      <LedgerPerformancePanel metrics={terminalMetrics} period={period} onPeriodChange={setPeriod} data={period === '7D' ? [8,12,18.6] : period === '30D' ? [4,8,12,18.6] : [0,4,8,12,18.6]}/>
      <LedgerHoldingsPanel rows={terminalHoldings} summary="演示持仓" onRowActivate={row => notify(`${row.symbol} · ${row.market} · ${row.change} · ${row.pnl}`)}/>
      <LedgerPnlCalendar month="2026-08" days={terminalDays} selectedDate={selection} onSelectDate={date => {setSelection(date); notify(`${date} · 当日盈亏 ${terminalDays.find(day => day.date === date)?.value ?? '暂无记录'}`);}}/>
      <LedgerExposurePanel items={[{label:'资金利用率',value:85},{label:'多头敞口',value:58},{label:'空头敞口',value:27},{label:'现金',value:15}]}/>
      <LedgerStrategyPanel metrics={[{label:'在役策略',value:8},{label:'本月迭代',value:3},{label:'最近上线',value:'08:01'}]} trend={[41,45,54,63,71,78,73]} description="演示趋势，不构成收益预测。"/>
      <LedgerMonthlyReturns data={[3.2,-1.4,6.8,4.5,7.5,7.1].map((value,i) => ({label:`${i+1}月`,value}))}/>
    </div><p role="status">{message}</p>
  </section>;
}
