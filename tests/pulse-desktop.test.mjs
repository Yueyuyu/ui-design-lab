import test from 'node:test';
import assert from 'node:assert/strict';
import { quotaValue, quotaTone, clampPosition, dockingSide, botMood, newlyCompleted } from '../systems/pulse-desktop/web/model.js';
test('Pulse 额度未知不冒充健康或用尽',()=>{
  for(const value of [null,undefined,NaN,Infinity,'69']) {assert.equal(quotaValue(value),null);assert.equal(quotaTone(value),'unknown');}
  assert.equal(quotaValue(-10),0);assert.equal(quotaValue(101),100);
  assert.equal(quotaTone(0),'spent');assert.equal(quotaTone(20),'critical');assert.equal(quotaTone(25),'critical');assert.equal(quotaTone(40),'caution');assert.equal(quotaTone(51),'healthy');
});
test('Pulse 机器人状态独立于额度，异常优先且不补播历史完成',()=>{
  const running=[{id:'one',state:'running'}], completed=[{id:'one',state:'completed'}];
  assert.equal(botMood(running),'working');assert.equal(botMood(completed),'idle');assert.equal(botMood([]),'idle');
  assert.equal(botMood(running,'error'),'offline');assert.equal(botMood(completed,'loading'),'loading');
  assert.equal(botMood([...running,{id:'two',state:'attention'}]),'attention');
  assert.equal(botMood([{id:'one',state:'unavailable'}]),'offline');
  assert.equal(newlyCompleted(running,completed),true);
  assert.equal(newlyCompleted([],completed),false);
  assert.equal(newlyCompleted(completed,completed),false);
  assert.equal(newlyCompleted(running,[]),false);
});
test('Pulse 放大、越界与贴边位置',()=>{
  assert.deepEqual(clampPosition({x:-5,y:900},{width:800,height:600},{width:344,height:520}),{x:0,y:80});
  assert.deepEqual(clampPosition({x:800,y:900},{width:320,height:600},{width:688,height:1040}),{x:0,y:0});
  assert.equal(dockingSide({x:10,y:10},{width:800,height:600},{width:238,height:68}),'left');
  assert.equal(dockingSide({x:540,y:10},{width:800,height:600},{width:238,height:68}),'right');
  assert.equal(dockingSide({x:200,y:10},{width:800,height:600},{width:238,height:68}),null);
});
