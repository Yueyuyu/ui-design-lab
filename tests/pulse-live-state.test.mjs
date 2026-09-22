import test from 'node:test';
import assert from 'node:assert/strict';
import {emptyLiveState,receiveLiveSnapshot,expireLiveState,quotaResetLabel} from '../systems/pulse-desktop/desktop/live-state.js';
const task={id:'11111111-1111-4111-8111-111111111111',title:'测试任务',state:'running',watched:true,canOpen:true};
const packet={schemaVersion:1,source:'companion-live',sequence:1,remaining:43,quotaState:'ready',tasksState:'ready',tasks:[task],resetsAt:'2026-09-24T01:00:00Z'};
test('桌面初始未知，真实快照驱动，不回落为演示值',()=>{
  assert.equal(emptyLiveState.remaining,null);assert.deepEqual(emptyLiveState.tasks,[]);
  assert.equal(receiveLiveSnapshot(emptyLiveState,packet).remaining,43);
  assert.equal(receiveLiveSnapshot(emptyLiveState,{...packet,quotaState:'error'}).remaining,null);
});
test('拒绝乱序、重复、示例和非法任务快照',()=>{
  const current=receiveLiveSnapshot(emptyLiveState,packet);
  for(const invalid of [packet,{...packet,sequence:0},{...packet,sequence:2,source:'demo'},{...packet,sequence:2,tasks:[{...task,id:'file:///bad'}]},{...packet,sequence:2,tasks:[task,task]},{...packet,sequence:2,remaining:Infinity}])assert.equal(receiveLiveSnapshot(current,invalid),current);
});
test('断线保留关注和可打开身份，但不能冒充运行或健康额度',()=>{
  const expired=expireLiveState(packet);
  assert.equal(expired.remaining,null);assert.equal(expired.tasksState,'error');
  assert.equal(expired.tasks[0].watched,true);assert.equal(expired.tasks[0].state,'unavailable');assert.equal(expired.tasks[0].canOpen,true);
  assert.match(quotaResetLabel(packet.resetsAt),/重置$/);assert.equal(quotaResetLabel(null),'重置时间暂不可用');
});
