import {useState} from 'react';
import * as Kit from '../web/index.js';
import {terminalHoldings,terminalDays,terminalMetrics} from '../web/terminal-data.js';

export function BusinessExample({entry,state}) {
  const [period,setPeriod]=useState('30D');
  const [date,setDate]=useState('');
  const [message,setMessage]=useState('');
  const C=Kit[entry.exportName];
  const empty=state === 'empty';
  const boundary={loading:state === 'loading',error:state === 'error' ? '数据读取失败，当前操作尚未执行。' : undefined,disabled:state === 'disabled',onRetry:() => setMessage('已请求重试；真实数据需由调用方更新')};
  const props={
    AssetSummary:{balance:empty ? undefined : 24615.83,today:'+$339.64',month:'+$408.31',totalReturn:'+31.8%',onDeposit:() => setMessage('入金回调已触发；没有进行真实转账'),onWithdraw:() => setMessage('出金回调已触发；没有进行真实转账')},
    PerformancePanel:{metrics:terminalMetrics,data:empty ? [] : period === '7D' ? [8,12,18.6] : [0,4,8,12,18.6],period,onPeriodChange:setPeriod},
    HoldingsPanel:{rows:empty ? [] : terminalHoldings,onRowActivate:row => setMessage(`${row.symbol} · ${row.pnl}`)},
    PnlCalendar:{month:'2026-08',days:empty ? [] : terminalDays,selectedDate:date,onSelectDate:value => {setDate(value);setMessage(`${value} · 当日盈亏 ${(empty ? [] : terminalDays).find(day => day.date === value)?.value ?? '无记录'}`);}},
    ExposurePanel:{items:empty ? [] : [{label:'资金利用率',value:85},{label:'多头敞口',value:58},{label:'空头敞口',value:27}]},
    StrategyPanel:{metrics:empty ? [] : [{label:'在役策略',value:8},{label:'本月迭代',value:3}],trend:empty ? [] : [12,18,21,25],description:'本地演示趋势'},
    MonthlyReturns:{data:empty ? [] : [{label:'7月',value:3.2},{label:'8月',value:-1.4},{label:'9月',value:6.8}]},
  }[entry.suffix];
  return <div className="doc-example"><C {...props} {...boundary}/><p role="status">{message}</p></div>;
}
export const businessExamples=Object.fromEntries(['AssetSummary','PerformancePanel','HoldingsPanel','PnlCalendar','ExposurePanel','StrategyPanel','MonthlyReturns'].map(suffix => [`Ledger${suffix}`,BusinessExample]));
