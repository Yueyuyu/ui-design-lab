import { useId, useState } from 'react';
import { Plus } from '@phosphor-icons/react';

const options = [{value:'weekly',label:'每周复盘'},{value:'monthly',label:'每月总结'}];
const rows = [{id:'one',name:'产品研究',status:'进行中'},{id:'two',name:'发布检查',status:'待处理'}];
const columns = [{key:'name',label:'名称'},{key:'status',label:'状态'}];

// 这是 Gallery 试用工具。C 和 Button 均由当前套系入口传入，不实现或替代任何套系组件。
export function ComponentExample({ entry, kit, prefix, state = 'default', custom: Custom, catalog = false }) {
  const [value,setValue] = useState('weekly');
  const [text,setText] = useState('产品研究');
  const [checked,setChecked] = useState(false);
  const [selection,setSelection] = useState([]);
  const [range,setRange] = useState({start:'2026-09-01',end:'2026-09-06'});
  const [page,setPage] = useState(1);
  const [amount,setAmount] = useState(40);
  const [open,setOpen] = useState(false);
  const [message,setMessage] = useState('');
  const [items,setItems] = useState([{id:'example',message:'示例已准备好'}]);
  const instance = useId();
  const C = kit[entry.exportName], Button = kit[`${prefix}Button`];
  const boundary = {disabled:state === 'disabled', loading:state === 'loading',error:state === 'error' ? '读取失败，请重试' : undefined};
  const shared = { ...boundary, onRetry:() => setMessage('重试回调已触发；数据由调用方刷新') };
  let content;
  if (Custom) return <Custom entry={entry} state={state} catalog={catalog}/>;
  switch (entry.suffix) {
    case 'Button': content = <div className="doc-example-actions"><C {...boundary} onClick={() => setMessage('操作已完成')}>保存更改</C><C variant="secondary" onClick={() => setMessage('已取消示例操作')}>次要动作</C></div>; break;
    case 'IconButton': content = <C {...boundary} icon={Plus} label="新建项目" onClick={() => setMessage('已触发新建')}/>; break;
    case 'Field': content = <C {...boundary} label="项目名称" value={text} onChange={event => setText(event.target.value)} hint={catalog ? undefined : '为项目起一个易辨认的名称'}/>; break;
    case 'Textarea': content = <C {...boundary} label="说明" value={text} onChange={event => setText(event.target.value)} hint={catalog ? undefined : '纯文本说明'}/>; break;
    case 'Select': content = <C {...boundary} label="复盘频率" value={value} options={options} onChange={event => setValue(event.target.value)}/>; break;
    case 'Slider': content = <C {...boundary} label="预览比例" value={amount} min={0} max={100} step={5} unit="%" onChange={setAmount} hint={catalog ? undefined : '方向键微调，Home / End 到达两端'}/>; break;
    case 'Toggle': case 'Checkbox': content = <C {...boundary} label="包含归档项目" checked={checked} onChange={setChecked}/>; break;
    case 'RadioGroup': case 'Combobox': content = <C {...boundary} label="复盘频率" options={options} value={value} onChange={setValue}/>; break;
    case 'MultiSelect': content = <C {...boundary} label="启用模板" options={options} value={selection} onChange={setSelection}/>; break;
    case 'DatePicker': content = <C {...boundary} label="开始日期" value={range.start} onChange={start => setRange({...range,start})}/>; break;
    case 'DateRange': content = <C {...boundary} label="统计日期" value={range} onChange={setRange}/>; break;
    case 'Tabs': content = <C disabled={boundary.disabled} value={value} onChange={setValue} items={options.map(option => ({id:option.value,label:option.label,content:<p>{option.label}的独立内容区域</p>}))}/>; break;
    case 'Breadcrumb': content = <C items={[{label:'项目',onClick:() => setMessage('返回项目列表')},{label:'产品研究'}]}/>; break;
    case 'Pagination': content = <C disabled={boundary.disabled} page={page} pageCount={5} onChange={setPage}/>; break;
    case 'Card': case 'Panel': content = <C title="项目概览" action={<Button onClick={() => setMessage('查看项目详情')}>查看详情</Button>}><p>标题与操作属于容器；项目字段由调用方组合。</p></C>; break;
    case 'Badge': case 'StatusChip': content = <div className="doc-example-actions"><C>待处理</C><C>进行中</C><C>已完成</C></div>; break;
    case 'StatusBadge': content = <div className="doc-example-actions"><C>美股</C><C tone="option">期权</C><C>买入</C><C tone="positive">盈利</C><C tone="negative">亏损</C></div>; break;
    case 'Metric': content = <C {...boundary} label="本月完成率" value="68%" delta="较上月 +8%"/>; break;
    case 'Table': content = <C caption="研究项目" rows={state === 'empty' ? [] : rows} columns={columns} state={state} onRowActivate={row => setMessage(`选中 ${row.name}`)} onRetry={shared.onRetry}/>; break;
    case 'DataTable': content = <C {...shared} showToolbar={!catalog} selectable={!catalog} caption="研究项目" rows={state === 'empty' ? [] : rows} columns={columns} selection={selection} onSelectionChange={setSelection} onRowActivate={row => setMessage(`选中 ${row.name}`)} onBulkAction={catalog ? undefined : ids => setMessage(`批量处理 ${ids.length} 项`)}/>; break;
    case 'BarChart': content = <C title="每周完成量" data={state === 'empty' ? [] : [{label:'第一周',value:12},{label:'第二周',value:18},{label:'第三周',value:9}]} unit="项" state={state} onRetry={shared.onRetry}/>; break;
    case 'LineChart': content = <C title="收益变化" data={state === 'empty' ? [] : [4,8,-2,12]} labels={['周一','周二','周三','周四']} unit="%" state={state} onRetry={shared.onRetry}/>; break;
    case 'Dialog': case 'Drawer': content = <><Button onClick={() => setOpen(true)}>打开{entry.title}</Button><C {...boundary} open={open} onOpenChange={setOpen} title="研究详情"><p>这是当前组件的独立预览。</p><Button onClick={() => {setOpen(false);setMessage('已保存并关闭');}}>保存并关闭</Button></C></>; break;
    case 'DropdownMenu': content = <C disabled={boundary.disabled} items={[{id:'edit',label:'编辑',onSelect:() => setMessage('已选择编辑')},{id:'archive',label:'归档',onSelect:() => setMessage('已选择归档')}]} />; break;
    case 'Popover': case 'Tooltip': content = <C label="指标说明">完成率 = 已完成任务 / 当前范围内全部任务。</C>; break;
    case 'Progress': content = <C label="文件准备进度" value={64}/>; break;
    case 'Skeleton': content = <C label="正在读取研究项目…" rows={3}/>; break;
    case 'ToastQueue': content = <><Button onClick={() => setItems(list => [...list,{id:crypto.randomUUID(),message:'新增操作反馈'}])}>新增通知</Button><C items={items} onDismiss={id => setItems(list => list.filter(item => item.id !== id))}/></>; break;
    case 'Notification': content = <C title="保存遇到问题" description="本地输入仍保留，请重试。" tone="error" actionLabel="重试" onAction={() => setMessage('已触发重试')}/>; break;
    case 'EmptyState': content = <C title="还没有项目" description="新建第一个研究项目后会出现在这里。" actionLabel="新建项目" onAction={() => setMessage('已触发新建项目')}/>; break;
    case 'QuotaPill': content = <C {...boundary} remainingPercent={36} resetText="示例：周一 09:00 重置" onRefresh={() => setMessage('额度刷新回调已触发')}/>; break;
    case 'TaskLight': content = <C {...shared} defaultOpen onTaskActivate={task => setMessage(`选中任务：${task.title}`)}/>; break;
    case 'Tree': content = <C nodes={[{id:'research',label:'研究资料',children:[{id:'interviews',label:'访谈记录'},{id:'notes',label:'研究笔记'}]}]} value={value} onChange={setValue} disabled={boundary.disabled}/>; break;
    case 'FileUpload': content = <C disabled={boundary.disabled} upload={async (file,{signal,onProgress}) => { if(signal.aborted) throw new Error('已取消'); onProgress(100); return {name:file.name,local:true}; }} onComplete={result => setMessage(`${result.name} 已完成本地适配器示例；未上传至服务器`)}/>; break;
    case 'Shell': content = <C brand="示例工作区" title={value === 'weekly' ? '项目' : '设置'} navigation={options.map(option => ({id:option.value,label:option.label}))} activeId={value} onNavigate={setValue}><p>工作区内容槽</p></C>; break;
    case 'TerminalPreview': content = <><label>布局 <select value={value === 'weekly' ? 'overview' : value} onChange={event=>setValue(event.target.value)}><option value="overview">资产总览</option><option value="compact">紧凑控制台</option><option value="cockpit">信号驾驶舱</option></select></label><C mode={value === 'weekly' ? 'overview' : value} onNotify={setMessage}/></>; break;
    case 'WorkspacePreview': case 'ProjectWorkspace': case 'ContentBoard': content = <C/>; break;
    default: content = <p role="alert">该组件缺少独立示例：{entry.exportName}</p>;
  }
  return <div className="doc-example" data-example={entry.id} id={instance}>{content}<p role="status">{message}</p></div>;
}
