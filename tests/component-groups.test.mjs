import test from 'node:test';
import assert from 'node:assert/strict';
import {readdirSync,readFileSync} from 'node:fs';
import {groupedComponents,componentGroup} from '../src/gallery/docs/component-groups.js';
test('每套组件用途分类完整且唯一，页面组合不进入目录',()=>{
 for(const dir of readdirSync('systems',{withFileTypes:true}).filter(dir=>dir.isDirectory())) {
  const entries=JSON.parse(readFileSync(`systems/${dir.name}/showcase/catalog.generated.json`,'utf8'));
  const expected=entries.filter(entry=>entry.kind!=='pattern');
  const actual=groupedComponents(entries).flatMap(group=>group.entries);
  assert.deepEqual(actual.map(entry=>entry.id).sort(),expected.map(entry=>entry.id).sort(),dir.name);
  for(const entry of expected) assert.ok(componentGroup(entry),`${dir.name}/${entry.id} 缺少用途分类`);
  for(const entry of expected) assert.ok(groupedComponents(entries,entry.exportName).flatMap(group=>group.entries).some(item=>item.id===entry.id));
 }
});
