import test from 'node:test';
import assert from 'node:assert/strict';
import { createFolioDocument, validateFolioDocument, filterFolioRecords } from '../systems/folio-workspace/web/model.js';
import { contrast } from '../src/gallery/workbench/theme-config.js';
import { readFileSync } from 'node:fs';
test('Folio 辅助字、语义标签和错误文本达到 4.5:1 对比度', () => {
  const {values}=JSON.parse(readFileSync(new URL('../systems/folio-workspace/foundations/tokens.json',import.meta.url)));
  for(const [foreground,background] of [['muted','paper'],['muted','sidebar'],['muted','hover'],['ink','paper'],['progress-text','progress-surface'],['success-text','success-surface'],['error','error-surface']]) {
    assert.ok(contrast(values[foreground].$value,values[background].$value)>=4.5, `${foreground}/${background}`);
  }
});
test('Folio 数据验证拒绝循环、重复 ID 和无效草稿，保护旧内容', () => {
  const seed = createFolioDocument();
  assert.equal(validateFolioDocument(seed), seed);
  const cycle = structuredClone(seed); cycle.pages[0].parentId = cycle.pages[1].id;
  assert.throws(() => validateFolioDocument(cycle), /格式不受支持/);
  const duplicate = structuredClone(seed); duplicate.pages[0].records.push(duplicate.pages[0].records[0]);
  assert.throws(() => validateFolioDocument(duplicate));
  const draft = structuredClone(seed); draft.pages[0].drafts.bad = { ...draft.pages[0].records[0], status:'不存在' };
  assert.throws(() => validateFolioDocument(draft));
});
test('Folio 搜索包含属性，筛选排序不修改源数据', () => {
  const rows = createFolioDocument().pages[0].records;
  const before = structuredClone(rows);
  assert.equal(filterFolioRecords(rows, {query:'交互模式',status:'全部',sort:'manual'}).length, 2);
  assert.equal(filterFolioRecords(rows, {query:'',status:'进行中',sort:'title'}).length, 2);
  assert.deepEqual(rows, before);
});
