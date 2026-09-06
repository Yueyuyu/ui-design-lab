import { ArrowDown, ArrowUp, ChartBar, ChartLine, CheckCircle, Compass, Fire, Money, Moon, Percent, Play, Rows, SignOut, Stop, Sun } from "@phosphor-icons/react";
import { useState } from "react";
import { LedgerBarChart, LedgerLineChart } from "./Chart.jsx";
import { LedgerButton, LedgerMetric, LedgerPanel, LedgerStatusBadge } from "./primitives.jsx";

const holdings = [
  ["NVDA", "买", "美股", "+4.52%", "+$232.44", "positive"],
  ["NVDA 150C", "购", "期权", "+82.55%", "+$792.52", "positive"],
  ["TSLA", "买", "美股", "-1.39%", "-$86.57", "negative"],
  ["QQQ", "买", "ETF", "+1.60%", "+$108.25", "positive"],
  ["SPY 545P", "沽", "期权", "-16.65%", "-$136.52", "negative"]
];

const calendar = ["positive", "positive", "positive", "positive", "positive", "neutral", "negative", "negative", "positive", "negative", "positive", "positive", "positive", "neutral", "neutral", "positive", "positive", "negative", "positive", "positive", "positive", "positive", "negative", "positive", "positive", "neutral", "neutral", "negative", "positive", "positive", "positive"];

function HoldingsPanel() {
  return <LedgerPanel title="当前持仓 · 15" action={<strong className="ml-positive">+$1,241.31</strong>} className="ml-terminal__holdings"><div className="ml-holdings-list">{holdings.map(([name, side, market, pct, pnl, tone]) => <button type="button" className="ml-holding-row" key={name}><span><strong>{name}</strong><span><LedgerStatusBadge tone={tone}>{side}</LedgerStatusBadge><LedgerStatusBadge tone={market === "期权" ? "option" : "info"}>{market}</LedgerStatusBadge></span><small>{name.includes("150") ? "3.20 → 5.84 · 01/15 到期" : "128.42 → 134.23 · 盘中"}</small></span><i data-tone={tone} /><span data-tone={tone}><strong>{pct}</strong><small>{pnl}</small></span></button>)}</div></LedgerPanel>;
}

function AssetPanel({ onNotify }) {
  return <LedgerPanel tone="ledger" className="ml-terminal__asset"><span className="ml-terminal__asset-label">总资产</span><strong className="ml-terminal__asset-value">$24,615<small>.83</small></strong><dl><div><dt>今日收益</dt><dd>+$339.64 · +1.38%</dd></div><div><dt>本月收益</dt><dd>+$408.31 · +1.69%</dd></div></dl><div className="ml-terminal__asset-total"><span>累计收益率</span><strong>+31.8%</strong></div><div className="ml-terminal__asset-actions"><LedgerButton icon={ArrowDown} onClick={() => onNotify?.("入金流程已打开")}>入金</LedgerButton><LedgerButton variant="ledger" icon={ArrowUp} onClick={() => onNotify?.("出金流程已打开")}>出金</LedgerButton></div></LedgerPanel>;
}

function PerformancePanel() {
  const [period, setPeriod] = useState("30D");
  return <LedgerPanel className="ml-terminal__performance"><div className="ml-terminal__metrics"><LedgerMetric label="累计收益率" value="+31.8%" tone="positive" /><LedgerMetric label="年化收益率" value="+59.1%" tone="positive" /><LedgerMetric label="最大回撤" value="-4.3%" tone="negative" /><LedgerMetric label="运行天数" value="217" /></div><div className="ml-terminal__periods" aria-label="收益周期">{["7D", "30D", "全部"].map((item) => <button type="button" key={item} data-active={period === item ? "true" : "false"} onClick={() => setPeriod(item)}>{item}</button>)}</div><LedgerLineChart title="累计收益率" data={period === "7D" ? [8,12,18.6] : period === "30D" ? [4,8,12,18.6] : [0,4,8,12,18.6]} unit="%" period={period} description="演示数据" /></LedgerPanel>;
}

function CalendarPanel() {
  return <LedgerPanel title="盈亏日历" action={<strong className="ml-positive">+$1,742.00</strong>} className="ml-terminal__calendar"><div className="ml-calendar-week"><span>一</span><span>二</span><span>三</span><span>四</span><span>五</span><span>六</span><span>日</span></div><div className="ml-calendar-grid">{calendar.map((tone, index) => <button type="button" key={index} data-tone={tone}>{index + 1}</button>)}</div></LedgerPanel>;
}

function ExposurePanel() {
  return <LedgerPanel title="敞口构成" className="ml-terminal__exposure"><div className="ml-exposure-rings"><figure><svg viewBox="0 0 80 80" role="img" aria-label="加密货币敞口 100%"><circle cx="40" cy="40" r="30" /><circle cx="40" cy="40" r="30" data-value="100" /></svg><figcaption><strong>100%</strong><small>加密货币</small></figcaption></figure><figure><svg viewBox="0 0 80 80" role="img" aria-label="资金利用率 85%"><circle cx="40" cy="40" r="30" /><circle cx="40" cy="40" r="30" data-value="85" /></svg><figcaption><strong>85%</strong><small>资金利用率</small></figcaption></figure></div><div className="ml-exposure-legend"><span><i />多头 <b>58%</b></span><span><i />空头 <b>27%</b></span><span><i />现金 <b>15%</b></span></div></LedgerPanel>;
}

function StrategyPanel() {
  return <LedgerPanel title="策略演化" className="ml-terminal__strategy"><dl><div><dt>8</dt><dd>在役策略</dd></div><div><dt>3</dt><dd>本月迭代次数</dd></div><div><dt>08:01</dt><dd>最新一代上线</dd></div></dl><svg viewBox="0 0 260 76" role="img" aria-label="策略稳定上升"><polyline points="0,59 38,55 82,46 126,37 170,29 218,22 260,27" /><polyline data-ghost="true" points="0,59 38,51 82,57 126,50 170,57 218,54 260,42" /></svg><small>不适者消失，优势者进化。</small></LedgerPanel>;
}

function CompactConsole({ onNotify }) {
  return <div className="ml-compact-console"><header><strong>TradeGenius</strong><span><i />运行中</span><small>PID 2769 · 已运行 1h45m</small></header><LedgerPanel title="运行控制" action={<LedgerStatusBadge tone="positive" dot>运行中</LedgerStatusBadge>}><div className="ml-compact-console__actions"><LedgerButton icon={Play} onClick={() => onNotify?.("策略已启动")}>启动</LedgerButton><LedgerButton variant="danger" icon={Stop} onClick={() => onNotify?.("策略已停止")}>停止</LedgerButton></div></LedgerPanel><LedgerPanel title="账户" className="ml-compact-console__chart"><div className="ml-compact-console__pnl"><LedgerMetric label="总盈亏" value="+$55.27" tone="positive" /><LedgerMetric label="胜率" value="43" /><LedgerMetric label="最大回撤" value="-$6.55" tone="negative" /></div><LedgerLineChart title="账户曲线" value="+2.79%" data={[21,22,20,24,18,16,12,9,13,15,11,19,23,25,31]} /></LedgerPanel><LedgerPanel title="当前持仓统计"><div className="ml-compact-positions">{["ZEC", "SOL/US", "SOL47", "0.079"].map((item, index) => <span key={item}><b>{item}</b><small data-tone={index > 1 ? "negative" : "neutral"}>{index > 1 ? "-1.34%" : "$501.75"}</small></span>)}</div></LedgerPanel><LedgerPanel title="交易建议"><div className="ml-compact-advice">{["TUT", "ALLO", "GIGGLE", "SKYAI"].map((item) => <button type="button" key={item}><CheckCircle size={15} weight="fill" /><span><strong>买 {item}</strong><small>趋势与成交量共同确认，风险预算可接受。</small></span><b>0.96</b></button>)}</div><LedgerButton onClick={() => onNotify?.("建议已应用")}>应用建议</LedgerButton></LedgerPanel></div>;
}

const cockpitNav = [[Compass, "驾驶舱"], [Fire, "Top30 数据"], [ChartBar, "成交统计"], [Rows, "小所 Top10"], [Money, "全站资金流向"], [Percent, "费率监测"], [ChartLine, "全站图表"]];
const trendRows = [
  ["BTC", "positive", "neutral", "neutral", "negative", "neutral", "neutral", "positive"],
  ["ETH", "positive", "positive", "neutral", "negative", "neutral", "neutral", "positive"],
  ["SOL", "neutral", "neutral", "neutral", "negative", "neutral", "neutral", "positive"],
  ["BNB", "neutral", "neutral", "neutral", "negative", "neutral", "neutral", "positive"],
  ["HYPE", "positive", "neutral", "neutral", "negative", "neutral", "positive", "positive"],
  ["ZEC", "positive", "neutral", "neutral", "neutral", "neutral", "positive", "positive"]
];

function CockpitPreview({ onNotify }) {
  const [active, setActive] = useState("驾驶舱");
  return <section className="ml-cockpit"><header><strong>CM AI SIGNAL</strong><span><LedgerStatusBadge>用户</LedgerStatusBadge><LedgerStatusBadge tone="positive" dot>已连接</LedgerStatusBadge><LedgerButton variant="ghost" icon={SignOut} className="ml-cockpit__exit" onClick={() => onNotify?.("演示模式：未执行退出")}>退出</LedgerButton></span></header><div className="ml-cockpit__shell"><aside>{cockpitNav.map(([Icon,label]) => <button type="button" key={label} data-active={active === label ? "true" : "false"} onClick={() => { setActive(label); onNotify?.(`已切换：${label}`); }}><Icon size={17} weight={active === label ? "fill" : "regular"}/><span>{label}</span></button>)}</aside><main><h3>市场氛围</h3><div className="ml-cockpit__mood"><LedgerPanel><LedgerMetric label="CSI 情绪指数" value="62.64" delta="多头区" tone="positive" /></LedgerPanel><LedgerPanel><LedgerMetric label="获利指数" value="42.34" delta="中性 · 观察" /></LedgerPanel><LedgerPanel title="主流趋势" className="ml-cockpit__trend"><div className="ml-trend-matrix"><header><span>币种</span>{["5M","15M","1H","4H","1D","3D","1W"].map((item)=><span key={item}>{item}</span>)}</header>{trendRows.map(([symbol,...tones])=><div key={symbol}><strong>{symbol}</strong>{tones.map((tone,index)=><i key={`${symbol}-${index}`} data-tone={tone}/>)}</div>)}</div></LedgerPanel><LedgerPanel><LedgerMetric label="量能氛围" value="消极" delta="vs MA10 -49.5%" tone="negative" /></LedgerPanel><LedgerPanel title="存量流向"><div className="ml-cockpit__flows"><span>ETH 交易所存量 <LedgerStatusBadge tone="positive">利好 ETH</LedgerStatusBadge></span><span>Binance BTC 存量 <LedgerStatusBadge tone="negative">利空 BTC</LedgerStatusBadge></span><span>USDC 发行量 <LedgerStatusBadge tone="positive">利好市场</LedgerStatusBadge></span></div></LedgerPanel></div><h3>机会分析（Top30 涨幅榜）</h3><div className="ml-cockpit__opportunities">{[["HEMI","做多机会","+$447万","positive"],["XMR","做空机会","-$102万","negative"],["AUCTION","做空机会","-$51万","negative"],["ETH","做空机会","-$5599万","negative"]].map(([symbol,label,flow,tone])=><LedgerPanel key={symbol} className="ml-opportunity" visualState={tone === "positive" ? "hover" : undefined}><div><strong>{symbol}</strong><LedgerStatusBadge tone={tone}>{label}</LedgerStatusBadge></div><dl><div><dt>现货</dt><dd data-tone={tone}>{tone === "positive" ? "+$12万" : "-$10万"}</dd></div><div><dt>合约</dt><dd data-tone={tone}>{flow}</dd></div></dl>{["1H","4H","1D"].map((period,index)=><span className="ml-opportunity__range" key={period}><b>{period}</b><small data-tone="positive">{index ? "478" : "481"}</small><i/><small data-tone="negative">{index ? "515" : "522"}</small></span>)}</LedgerPanel>)}</div><LedgerPanel title="跟踪中的信号 · 2"><div className="ml-cockpit__tracking"><header><span>交易对</span><span>信号类型</span><span>初始价格</span><span>当前价格</span><span>盈亏</span></header><div><strong>BTCUSDT</strong><LedgerStatusBadge tone="negative">看跌</LedgerStatusBadge><span>65022</span><span>77651</span><b data-tone="negative">-19.42%</b></div><div><strong>PENGUUSDT</strong><LedgerStatusBadge tone="negative">看跌</LedgerStatusBadge><span>0.006171</span><span>0.008603</span><b data-tone="negative">-39.41%</b></div></div></LedgerPanel><footer className="ml-cockpit__sources"><span>数据源：</span>{["basedata_levels ✓", "binance_volume_stat ✓", "bnbtc ✓", "current_price ✓", "eth_balance ✓", "market_sentiment ✓", "usdc_supply ✓"].map((source) => <small key={source}>{source}</small>)}</footer></main></div></section>;
}

export function LedgerTerminalPreview({ mode = "overview", onNotify }) {
  const [dark, setDark] = useState(true);
  if (mode === "compact") return <CompactConsole onNotify={onNotify} />;
  if (mode === "cockpit") return <CockpitPreview onNotify={onNotify} />;
  return <section className="ml-terminal-preview"><header className="ml-terminal__topbar"><span><strong>TradeGenius</strong><small>早安 · 2026年8月31日 星期一</small><LedgerStatusBadge>演示数据</LedgerStatusBadge></span><span><button type="button" className="ml-terminal__theme" aria-label="切换展示明暗" onClick={() => setDark(!dark)}>{dark ? <Moon size={17} weight="fill" /> : <Sun size={17} />}</button><LedgerStatusBadge tone="positive">市场情绪 · 美 68</LedgerStatusBadge></span></header><div className="ml-terminal-grid"><AssetPanel onNotify={onNotify} /><PerformancePanel /><HoldingsPanel /><CalendarPanel /><ExposurePanel /><StrategyPanel /><LedgerPanel className="ml-terminal__bars"><LedgerBarChart title="月度收益（演示）" values={[3.2,-1.4,6.8,4.5,7.5,7.1]} unit="%" /></LedgerPanel></div></section>;
}
