import {receiveLiveSnapshot,expireLiveState,quotaResetLabel,emptyLiveState} from './live-state.js';
import {accountNames,receiveAccountState} from './account-state.js';

export const emptyApplicationState={sequence:0,applications:[]};
// 宿主给出已注册适配器白名单。远端内容不能注入图片 URL 或冒充新应用。
export function receiveApplicationSnapshot(previous,value) {
  if(value?.schemaVersion!==2||value.source!=='companion-live'||!Number.isSafeInteger(value.sequence)||value.sequence<=previous.sequence||!Array.isArray(value.applications)||value.applications.length>8)return previous;
  const ids=new Set(),applications=[];
  for(const entry of value.applications){
    if(!entry||!(entry.id==='codex'||Object.hasOwn(accountNames,entry.id))||ids.has(entry.id)||!['brand','robot'].includes(entry.iconMode))return previous;
    ids.add(entry.id);
    if(entry.id!=='codex') {
      const state=receiveAccountState(entry.id,entry.state);
      if(!state)return previous;
      applications.push({id:entry.id,iconMode:entry.iconMode,...state});continue;
    }
    const state=receiveLiveSnapshot(emptyLiveState,{...entry.state,sequence:value.sequence});
    if(state===emptyLiveState)return previous;
    applications.push({id:entry.id,name:'Codex',iconMode:entry.iconMode,remaining:state.remaining,tasks:state.tasks,quotaState:state.quotaState,taskState:state.tasksState,resetLabel:quotaResetLabel(state.resetsAt),sourceLabel:'本机实时 · 只读',notice:state.notice});
  }
  return {sequence:value.sequence,applications};
}
export function expireApplicationState(previous){
  return {...previous,applications:previous.applications.map(entry=>{
    if(entry.id!=='codex')return {...entry,remaining:null,quotaWindows:[],quotaState:entry.quotaState==='unsupported'?'unsupported':'error',notice:'与本机服务的连接已中断，请重试'};
    const state=expireLiveState({...entry,tasksState:entry.taskState});
    return {...entry,remaining:null,quotaState:'error',taskState:'error',tasks:state.tasks,notice:state.notice};
  })};
}
