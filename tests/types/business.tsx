import {LedgerAssetSummary,LedgerPerformancePanel,LedgerHoldingsPanel,LedgerPnlCalendar,LedgerExposurePanel,LedgerStrategyPanel,LedgerMonthlyReturns} from 'ui-design-lab/midnight-ledger';
import {ClearProjectTable,ClearProjectDetails} from 'ui-design-lab/clearline-console';
import {SignalStoryCard,SignalRevisionList} from 'ui-design-lab/signal-studio';
const project={id:'one',name:'研究',owner:'林夏',status:'Planning',date:'2026-09-06'};
const story={id:'one',title:'研究笔记',description:'访谈摘要',status:'Draft',owner:'林夏',image:'/owned-cover.webp'};
export const businessComponents=<>
  <LedgerAssetSummary balance={1250} onDeposit={()=>{}}/>
  <LedgerPerformancePanel period="7D" data={[1,2]} onPeriodChange={period=>period.toUpperCase()}/>
  <LedgerHoldingsPanel rows={[{id:'one',symbol:'EXAMPLE',side:'买',market:'演示',change:'+1%',pnl:'+10'}]} onRowActivate={row=>row.symbol.toUpperCase()}/>
  <LedgerPnlCalendar month="2026-09" days={[{date:'2026-09-01',value:10}]} onSelectDate={date=>date.substring(0,7)}/>
  <LedgerExposurePanel items={[{label:'现金',value:50}]}/>
  <LedgerStrategyPanel metrics={[{label:'版本',value:3}]} trend={[1,2,3]}/>
  <LedgerMonthlyReturns data={[{label:'9月',value:-2}]} error="网络错误" onRetry={()=>{}}/>
  <ClearProjectTable rows={[project]} onSelect={value=>value?.name.toUpperCase()}/>
  <ClearProjectDetails project={project} onStatusChange={status=>status.toUpperCase()}/>
  <SignalStoryCard story={story} onOpen={value=>value.id.toUpperCase()}/>
  <SignalRevisionList stories={[story]} onOpen={value=>value.title.toUpperCase()}/>
</>;
// @ts-expect-error 占比必须为数值，不能接收展示字符串。
export const invalidExposure=<LedgerExposurePanel items={[{label:'现金',value:'50%'}]}/>;
// @ts-expect-error 日历回调返回完整日期字符串。
export const invalidCalendar=<LedgerPnlCalendar month="2026-09" onSelectDate={(date:number)=>date}/>;
