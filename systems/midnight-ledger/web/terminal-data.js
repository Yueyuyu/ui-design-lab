const sourceHoldings = [
  ["NVDA", "买", "美股", "+4.52%", "+$232.44", "positive"],
  ["NVDA 150C", "购", "期权", "+82.55%", "+$792.52", "positive"],
  ["TSLA", "买", "美股", "-1.39%", "-$86.57", "negative"],
  ["QQQ", "买", "ETF", "+1.60%", "+$108.25", "positive"],
  ["SPY 545P", "沽", "期权", "-16.65%", "-$136.52", "negative"]
];

const sourceCalendar = ["positive", "positive", "positive", "positive", "positive", "neutral", "negative", "negative", "positive", "negative", "positive", "positive", "positive", "neutral", "neutral", "positive", "positive", "negative", "positive", "positive", "positive", "positive", "negative", "positive", "positive", "neutral", "neutral", "negative", "positive", "positive", "positive"];

export const terminalHoldings = sourceHoldings.map(([symbol, side, market, change, pnl, tone]) => ({id:symbol, symbol, side, market, change, pnl, tone, detail:'演示持仓'}));
export const terminalDays = sourceCalendar.map((tone,i) => ({date:`2026-08-${String(i+1).padStart(2,'0')}`, value:tone === 'positive' ? 48 : tone === 'negative' ? -24 : 0}));
export const terminalMetrics = [{label:'累计收益率',value:'+31.8%',tone:'positive'},{label:'年化收益率',value:'+59.1%',tone:'positive'},{label:'最大回撤',value:'-4.3%',tone:'negative'},{label:'运行天数',value:'217'}];
