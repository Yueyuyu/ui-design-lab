import test from 'node:test';
import assert from 'node:assert/strict';
import {emptyApplicationState,receiveApplicationSnapshot,expireApplicationState} from '../systems/pulse-desktop/desktop/application-state.js';
const entry={id:'codex',iconMode:'robot',state:{schemaVersion:1,source:'companion-live',sequence:1,remaining:49,quotaState:'ready',tasksState:'ready',tasks:[]}};
const packet={schemaVersion:2,source:'companion-live',sequence:1,applications:[entry]};
test('应用级真实数据与图标来源单一，未连接时无示例',()=>{
  assert.equal(emptyApplicationState.applications.length,0);
  const state=receiveApplicationSnapshot(emptyApplicationState,packet);
  assert.equal(state.applications[0].remaining,49);
  assert.equal(state.applications[0].iconMode,'robot');
  assert.equal(expireApplicationState(state).applications[0].remaining,null);
  assert.equal(expireApplicationState(state).applications[0].iconMode,'robot');
});
test('拒绝未注册应用、重复应用、乱序、非法图标与非法任务',()=>{
  for(const change of [{applications:[{...entry,id:'unknown-app'}]},{applications:[entry,entry]},{sequence:0},{applications:[{...entry,iconMode:'file://x'}]},{applications:[{...entry,state:{...entry.state,tasks:[null]}}]}])assert.equal(receiveApplicationSnapshot(emptyApplicationState,{...packet,...change}),emptyApplicationState);
});

const account={id:'cursor',iconMode:'brand',state:{schemaVersion:1,source:'companion-live',remaining:null,quotaState:'signed-out',tasksState:'unsupported',tasks:[],notice:'',quotaLabel:'账户额度',quotaWindows:[],authState:'signed-out',canAuthorize:true,canDisconnect:false}};
test('Antigravity 本机接口额度可显示，但不提供网页登录或虚构任务',()=>{
  const state={...account.state,quotaState:'ready',authState:'connected',canAuthorize:false,canDisconnect:true,readMode:'auto',quotaSource:'desktop-local',remaining:75,quotaWindows:[{label:'Gemini · 周剩余',remaining:75,resetsAt:null}]};
  const receive=change=>receiveApplicationSnapshot(emptyApplicationState,{...packet,applications:[{id:'antigravity',iconMode:'brand',state:{...state,...change}}]});
  const result=receive({});
  assert.equal(result.applications[0]?.name,'Antigravity');
  assert.equal(result.applications[0].sourceLabel,'桌面本机接口 · 只读');
  assert.equal(result.applications[0].canRead,true);
  assert.equal(result.applications[0].canAuthorize,false);
  assert.equal(result.applications[0].taskState,'unsupported');
  assert.equal(receive({readMode:'web'}),emptyApplicationState);
  assert.equal(receive({canAuthorize:true}),emptyApplicationState);
  assert.equal(receive({quotaSource:'official-cli'}).applications[0].sourceLabel,'官方 agy CLI · 只读');
  const stopped=receive({readMode:'off',quotaState:'unavailable',authState:'signed-out',remaining:null,quotaWindows:[],canDisconnect:false});
  assert.equal(stopped.applications[0].sourceLabel,'已停止读取');
});
test('独立授权与未支持能力不冒充空闲，过期窗口隐藏',()=>{
  const receive=change=>receiveApplicationSnapshot(emptyApplicationState,{...packet,applications:[{...account,state:{...account.state,...change}}]});
  const value=receive({});assert.equal(value.applications[0].remaining,null);assert.equal(value.applications[0].taskState,'unsupported');
  const windows=[{label:'Auto 月度剩余',remaining:69,resetsAt:'2099-01-01T00:00:00Z'},{label:'API 月度剩余',remaining:31,resetsAt:null}];
  const ready=receive({quotaState:'ready',authState:'connected',remaining:69,quotaWindows:windows,accessToken:'must-not-pass',brandIcon:'https://bad.test'});
  assert.equal(ready.applications[0].quotaWindows.length,2);assert.equal(ready.applications[0].remaining,69);
  assert.equal(JSON.stringify(ready).includes('must-not-pass'),false);assert.equal(JSON.stringify(ready).includes('https://bad.test'),false);
  const expired=receive({quotaState:'ready',authState:'connected',remaining:69,quotaWindows:[{...windows[0],resetsAt:'2000-01-01T00:00:00Z'}]});
  assert.equal(expired.applications[0].remaining,null);
  for(const invalid of [{quotaWindows:[{...windows[0],remaining:101}]},{canAuthorize:false},{tasks:[{id:'fake',state:'running'}]},{quotaState:'ready',remaining:69},{authState:'pretend'},{quotaWindows:[{...windows[0],resetsAt:'not-a-date'}]},{readMode:'random'},{quotaSource:'file:///credentials'}])assert.equal(receive(invalid),emptyApplicationState);
  const automatic=receive({quotaState:'ready',authState:'connected',remaining:69,quotaWindows:windows,readMode:'auto',quotaSource:'desktop-session',sessionCookie:'do-not-forward'});
  assert.equal(automatic.applications[0].sourceLabel,'桌面登录 · 只读');assert.equal(JSON.stringify(automatic).includes('do-not-forward'),false);
  assert.equal(receive({quotaState:'ready',authState:'connected',remaining:69,quotaWindows:windows,readMode:'off'}),emptyApplicationState);
});
test('八个应用白名单，禁止未支持产品伪报额度',()=>{
  const applications=[entry,...['cursor','claude','grok-bot','zcode','kimi','doubao-work','workbuddy'].map(id=>({...account,id,state:{...account.state,...(['cursor','claude','grok-bot'].includes(id)?{}:{quotaState:'unsupported',authState:'unsupported',canAuthorize:false})}}))];
  const value=receiveApplicationSnapshot(emptyApplicationState,{...packet,applications});
  assert.equal(value.applications.length,8);
  const unsupported=value.applications.find(app=>app.id==='kimi');assert.equal(unsupported.name,'Kimi');assert.equal(expireApplicationState(value).applications.find(app=>app.id==='kimi').quotaState,'unsupported');
  applications[4]={...applications[4],state:{...account.state}};
  assert.equal(receiveApplicationSnapshot(emptyApplicationState,{...packet,applications}),emptyApplicationState);
});
test('九个已注册应用可同时接收，不把 Antigravity 作为第九项丢弃',()=>{
  const applications=[entry,...['cursor','claude','grok-bot','zcode','kimi','doubao-work','workbuddy','antigravity'].map(id=>({...account,id,state:{...account.state,...(id==='antigravity'?{quotaState:'unavailable',canAuthorize:false}:['cursor','claude','grok-bot'].includes(id)?{}:{quotaState:'unsupported',authState:'unsupported',canAuthorize:false})}}))];
  assert.equal(receiveApplicationSnapshot(emptyApplicationState,{...packet,applications}).applications.length,9);
});
