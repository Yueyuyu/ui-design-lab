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
