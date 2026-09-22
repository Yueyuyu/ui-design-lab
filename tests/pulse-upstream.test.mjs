import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {dealtColor,metrics,berthPath,bubblePath,personas,personaConfig} from '../systems/pulse-desktop/web/upstream/pulse.js';

test('Pulse 移植参数及原版人格表保持一致',async()=>{
  assert.equal(metrics.railWidth,64);assert.equal(metrics.ringDiameter,36);assert.equal(metrics.sliverWidth,6);
  assert.equal(personas.length,8);assert.equal(personaConfig('calm','working').tempo,.5);
  assert.equal(new Set(Array.from({length:10},(_,i)=>dealtColor(i))).size,10);
  assert.match(dealtColor(0),/^#[0-9a-f]{6}$/);
  const routines=JSON.parse(await readFile(new URL('../systems/pulse-desktop/web/upstream/choreography.json',import.meta.url)));
  assert.deepEqual(routines.calm.working[0],['working',4000,5500]);
  for(const persona of personas) for(const key of ['idle','working','fetching','spent','unavailable','attention']) {
    assert.ok(routines[persona][key].length);for(const [,min,max] of routines[persona][key])assert.ok(min>0&&max>=min);
  }
  for(const side of ['left','right'])assert.ok(!/NaN|Infinity/.test(bubblePath(270,400,side)));
  assert.ok(!/NaN|Infinity/.test(berthPath()));assert.ok(!/NaN|Infinity/.test(berthPath(6,96,0)));
});
test('Pulse 私有几何不通过 public 或常规静态 import 导入',async()=>{
  const bot=await readFile(new URL('../systems/pulse-desktop/web/BotMark.jsx',import.meta.url),'utf8');
  assert.match(bot,/MODE === 'pulse-local'/);assert.match(bot,/vite-ignore/);
  assert.ok(!/from.*original-data/.test(bot));
  const config=await readFile(new URL('../vite.config.mjs',import.meta.url),'utf8');
  assert.match(config,/fs: \{ deny:/);assert.ok(config.includes('**/.local-cache/pulse-bot/**'));
});
