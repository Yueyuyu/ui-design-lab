import {quotaResetLabel} from './live-state.js';

export const accountNames={cursor:'Cursor',claude:'Claude','grok-bot':'Grok Bot',zcode:'ZCode',kimi:'Kimi','doubao-work':'豆包工作',workbuddy:'WorkBuddy'};
const supported=new Set(['cursor','claude','grok-bot']);
const quotaStates=new Set(['ready','loading','error','signed-out','authorizing','unsupported','unavailable','rate-limited']);
const authStates=new Set(['connected','signed-out','authorizing','error','unsupported']);
const sourceLabels={'none':'自动读取 · 只读','desktop-cache':'桌面有效缓存 · 只读','desktop-session':'桌面登录 · 只读','web-login':'备用网页账户 · 只读'};
const percent=value=>typeof value==='number'&&Number.isFinite(value)&&value>=0&&value<=100;
const text=value=>typeof value==='string'&&value.length<=600&&!/[\u0000-\u0008\u000b-\u001f]/.test(value);
const date=value=>value===null||typeof value==='string'&&Number.isFinite(Date.parse(value));

// 新应用只接额度授权通道，不能借空任务数组冒充“当前没有任务”。
export function receiveAccountState(id,state) {
  if(!Object.hasOwn(accountNames,id)||state?.schemaVersion!==1||state.source!=='companion-live'||!quotaStates.has(state.quotaState)||!authStates.has(state.authState)||state.tasksState!=='unsupported'||!Array.isArray(state.tasks)||state.tasks.length!==0)return null;
  if(typeof state.canAuthorize!=='boolean'||state.canAuthorize!==supported.has(id)||typeof state.canDisconnect!=='boolean'||!text(state.notice)||!text(state.quotaLabel)||!Array.isArray(state.quotaWindows)||state.quotaWindows.length>8)return null;
  if(state.quotaWindows.some(window=>!window||!text(window.label)||window.label.length>80||!percent(window.remaining)||!date(window.resetsAt)))return null;
  if(state.remaining!==null&&!percent(state.remaining))return null;
  if(state.authorizationBlocked!==undefined&&typeof state.authorizationBlocked!=='boolean')return null;
  if(state.readMode!==undefined&&!['auto','web','off'].includes(state.readMode))return null;
  if(state.quotaSource!==undefined&&!Object.hasOwn(sourceLabels,state.quotaSource))return null;
  if(state.readMode==='off'&&state.quotaState==='ready')return null;
  if(state.quotaState==='ready'&&(state.authState!=='connected'||!state.quotaWindows.length||state.remaining!==state.quotaWindows[0].remaining))return null;
  if(!supported.has(id)&&(state.quotaState!=='unsupported'||state.authState!=='unsupported'||state.canDisconnect))return null;
  const windows=state.quotaState==='ready'?state.quotaWindows.filter(window=>window.resetsAt===null||Date.parse(window.resetsAt)>Date.now()):[];
  // 明确重建 DTO，不透传任何额外账户字段、URL 或 Token。
  return {name:accountNames[id],remaining:windows[0]?.remaining??null,tasks:[],quotaState:state.quotaState==='ready'&&!windows.length?'loading':state.quotaState,taskState:'unsupported',
    quotaLabel:windows[0]?.label??'账户额度',quotaWindows:windows.map(window=>({label:window.label,remaining:window.remaining,resetLabel:quotaResetLabel(window.resetsAt)})),
    resetLabel:quotaResetLabel(windows[0]?.resetsAt),sourceLabel:state.canAuthorize?(state.readMode==='off'?'已停止读取':sourceLabels[state.quotaSource??'none']):'适配待完成',notice:state.notice,
    authState:state.authState,canAuthorize:state.canAuthorize,canDisconnect:state.canDisconnect,authorizationBlocked:state.authorizationBlocked===true,readMode:state.readMode??'auto'};
}
