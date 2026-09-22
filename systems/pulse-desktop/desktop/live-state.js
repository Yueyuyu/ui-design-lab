export const emptyLiveState = {sequence:0,remaining:null,quotaState:'loading',tasksState:'loading',tasks:[],resetsAt:null,notice:''};
const states=new Set(['ready','loading','error']);
const taskStates=new Set(['running','completed','attention','unavailable']);
const uuid=/^[\da-f]{8}-[\da-f]{4}-[\da-f]{4}-[\da-f]{4}-[\da-f]{12}$/i;

// 桌面 bridge 只接收完整的宿主快照；无响应、失联和非法数据从不回退到演示值。
export function receiveLiveSnapshot(previous, value) {
  if(value?.schemaVersion!==1||value.source!=='companion-live'||!Number.isSafeInteger(value.sequence)||value.sequence<=previous.sequence)return previous;
  if(!states.has(value.quotaState)||!states.has(value.tasksState)||!Array.isArray(value.tasks)||value.tasks.length>100)return previous;
  if(value.remaining!==null&&(!Number.isFinite(value.remaining)||value.remaining<0||value.remaining>100))return previous;
  if(value.tasks.some(t=>!t||!uuid.test(t.id)||typeof t.title!=='string'||!taskStates.has(t.state)||typeof t.watched!=='boolean'))return previous;
  if(new Set(value.tasks.map(t=>t.id.toLowerCase())).size!==value.tasks.length)return previous;
  return {...value,remaining:value.quotaState==='ready'?value.remaining:null};
}
export function expireLiveState(previous) {
  return {...previous,remaining:null,quotaState:'error',tasksState:'error',tasks:previous.tasks.map(t=>({...t,state:'unavailable',detail:'暂不可用'})),notice:'与本机服务的连接已中断，请重试'};
}
export function quotaResetLabel(value) {
  const date=value?new Date(value):null;
  return date&&!Number.isNaN(date.valueOf())?`${new Intl.DateTimeFormat('zh-CN',{month:'numeric',day:'numeric',hour:'2-digit',minute:'2-digit',hour12:false}).format(date)} 重置`:'重置时间暂不可用';
}
