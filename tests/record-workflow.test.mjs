import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createRecordWorkflow, recordWorkflowReducer as reduce, validateRecordWorkflow } from '../src/gallery/comparison/record-workflow.js';
import { createSceneSnapshot } from '../src/gallery/comparison/scene-context.js';

test('记录草稿跨选中项和视图保留，取消只丢弃当前草稿，保存回写一次', () => {
  let state = createRecordWorkflow();
  state = reduce(state, { type: 'edit', record: { ...state.records[0], title: '未保存的修改' } });
  state = reduce(state, { type: 'open', id: 'record-2' });
  state = reduce(state, { type: 'edit', record: { ...state.records[1], note: '第二份草稿' } });
  state = reduce(state, { type: 'view', view: 'board' });
  state = reduce(state, { type: 'filter', patch: { query: '组件' } });
  assert.equal(state.views.table.query, '');
  assert.equal(state.drafts['record-1'].title, '未保存的修改');
  state = reduce(state, { type: 'cancel' });
  assert.equal(state.drafts['record-2'], undefined);
  assert.equal(state.drafts['record-1'].title, '未保存的修改');
  state = reduce(state, { type: 'save', record: state.drafts['record-1'] });
  assert.equal(state.records.length, 3);
  assert.equal(state.records[0].title, '未保存的修改');
  assert.deepEqual(state.drafts, {});
});

test('新建取消不留下空记录；导出快照和恢复保留记录、草稿与筛选', () => {
  let state = reduce(createRecordWorkflow(), { type: 'create', id: 'new-record' });
  assert.equal(state.records.length, 3);
  state = reduce(state, { type: 'cancel' });
  assert.equal(state.selectedId, null);
  assert.equal(state.records.length, 3);
  state = reduce(state, { type: 'create', id: 'new-record' });
  state = reduce(state, { type: 'edit', record: { ...state.drafts['new-record'], title: '草稿\n中文', note: '"引用"' } });
  const snapshot = createSceneSnapshot({ suite: { id: 'folio-workspace', version: '0.1.0' }, scenario: { id: 'record-workflow' }, workflow: state });
  assert.deepEqual(validateRecordWorkflow(JSON.parse(JSON.stringify(snapshot.content))), state);
});

test('拒绝损坏记录、重复 ID、孤立选中项及无效视图，保护可恢复配置', () => {
  const state = createRecordWorkflow();
  for (const bad of [
    { ...state, records: [...state.records, state.records[0]] },
    { ...state, selectedId: 'unknown' },
    { ...state, drafts: { different: state.records[0] } },
    { ...state, view: 'calendar' },
    { ...state, views: { ...state.views, board: { query: '', status: '错误', sort: 'manual' } } },
  ]) assert.throws(() => validateRecordWorkflow(bad), /记录比较配置/);
});
