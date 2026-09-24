// 分组和 suffixes 同时定义陈列顺序；kind 继续表达基础、业务与页面组合的实现边界。
export const componentGroups = [
 {id:'business',label:'业务组件',description:'组合基础组件，完成一个局部任务。',suffixes:[
  'AppLauncher','CommandMenu','IconPicker',
  'AssetSummary','PerformancePanel','HoldingsPanel','PnlCalendar','MonthlyReturns','ExposurePanel','StrategyPanel',
  'TaskLight','Tree','QuotaPill','FileUpload',
  'Database','BlockEditor','PageTree','RecordDetail','PageHeader',
  'ProjectTable','ProjectDetails','StoryCard','RevisionList','DataTable',
  'SettingsGroup','Composer','Message','ConversationList','PromptSuggestions',
 ]},
 {id:'icons',label:'图标与资产',description:'选取界面符号与应用视觉身份。',suffixes:['AppIcon','Symbol']},
 {id:'data',label:'数据展示',description:'呈现分类、指标、表格和图表。',suffixes:['Table','LineChart','BarChart','Metric','Badge','StatusChip','StatusBadge','Status']},
 {id:'layout',label:'布局容器',description:'组织相关内容与操作。',suffixes:['Panel','Card','SettingRow']},
 {id:'navigation',label:'导航',description:'在内容、层级和分页之间移动。',suffixes:['Tabs','ViewTabs','SegmentedControl','NavigationList','Breadcrumb','Breadcrumbs','Pagination','DropdownMenu']},
 {id:'forms',label:'表单输入',description:'录入、选择与调整数据。',suffixes:['Field','Textarea','Select','Combobox','MultiSelect','RadioGroup','Checkbox','Toggle','Slider','DatePicker','DateRange']},
 {id:'general',label:'通用',description:'触发动作与表达操作。',suffixes:['Button','IconButton']},
 {id:'feedback',label:'反馈与浮层',description:'说明状态、进度与下一步。',suffixes:['Drawer','Dialog','Popover','Tooltip','Notification','Callout','ToastQueue','EmptyState','Progress','Skeleton']},
];
export function componentGroup(entry) {
 if(entry.kind==='business') return 'business';
 return componentGroups.find(group=>group.suffixes.includes(entry.suffix))?.id;
}
export function groupedComponents(entries,query='') {
 const search=query.trim().toLowerCase();
 return componentGroups.map(group=>{
  const rank=new Map(group.suffixes.map((suffix,index)=>[suffix,index]));
  const matches=entries.filter(entry=>entry.kind!=='pattern'&&componentGroup(entry)===group.id&&`${entry.title} ${entry.suffix} ${entry.exportName} ${entry.description}`.toLowerCase().includes(search));
  // 新业务组件仍可见；未编排的项放在组末按稳定 ID 排序，不依赖源码导出位置。
  matches.sort((left,right)=>(rank.get(left.suffix)??Infinity)-(rank.get(right.suffix)??Infinity)||left.id.localeCompare(right.id));
  return {...group,entries:matches};
 }).filter(group=>group.entries.length);
}
export const componentHref=(suiteId,id)=>`#/systems/${suiteId}/components${id?`/${id}`:''}`;
