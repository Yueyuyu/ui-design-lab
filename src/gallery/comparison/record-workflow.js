const statuses = ['未开始', '进行中', '已完成'];
const config = () => ({ query: '', status: '全部', sort: 'manual' });

export function createRecordWorkflow() {
  return {
    records: [
      { id: 'record-1', title: '访谈资料整理', status: '进行中', category: '用户研究', note: '核对访谈摘要，保留待确认的问题。' },
      { id: 'record-2', title: '接入体验复盘', status: '未开始', category: '产品交付', note: '记录从安装到第一次保存的操作。' },
      { id: 'record-3', title: '组件边界清单', status: '已完成', category: '设计规范', note: '区分组件能力与业务服务。' },
    ],
    selectedId: 'record-1', drafts: {}, view: 'table',
    views: { table: config(), board: config(), list: config() },
  };
}

export function recordWorkflowReducer(state, action) {
  switch (action.type) {
    case 'open': return { ...state, selectedId: action.id };
    case 'close': return { ...state, selectedId: null };
    case 'edit': return { ...state, drafts: { ...state.drafts, [action.record.id]: action.record } };
    case 'view': return { ...state, view: action.view };
    case 'filter': return { ...state, views: { ...state.views, [state.view]: { ...state.views[state.view], ...action.patch } } };
    case 'create': {
      const record = { id: action.id, title: '', status: '未开始', category: '', note: '' };
      return { ...state, selectedId: record.id, drafts: { ...state.drafts, [record.id]: record } };
    }
    case 'save':
    case 'cancel': {
      const id = action.record?.id ?? state.selectedId;
      const drafts = { ...state.drafts };
      delete drafts[id];
      if (action.type === 'cancel') return { ...state, drafts, selectedId: state.records.some(record => record.id === id) ? id : null };
      if (!action.record.title.trim()) return state;
      const saved = { ...action.record, title: action.record.title.trim() };
      return { ...state, drafts, records: state.records.some(record => record.id === id) ? state.records.map(record => record.id === id ? saved : record) : [...state.records, saved] };
    }
    case 'restore': return validateRecordWorkflow(action.value);
    default: return state;
  }
}

// 比较配置可来自链接或 JSON；先校验记录、草稿和视图，避免坏数据进入渲染器。
export function validateRecordWorkflow(value) {
  const recordValid = record => record && ['id', 'title', 'category', 'note'].every(key => typeof record[key] === 'string') && !!record.id && statuses.includes(record.status);
  if (!value || !Array.isArray(value.records) || !value.records.every(recordValid) || new Set(value.records.map(record => record.id)).size !== value.records.length
    || !value.drafts || Array.isArray(value.drafts) || typeof value.drafts !== 'object'
    || !Object.entries(value.drafts).every(([id, record]) => recordValid(record) && id === record.id)
    || !['table', 'board', 'list'].includes(value.view)
    || !['table', 'board', 'list'].every(view => { const item = value.views?.[view]; return item && typeof item.query === 'string' && ['全部', ...statuses].includes(item.status) && ['manual', 'title'].includes(item.sort); })
    || !(value.selectedId === null || typeof value.selectedId === 'string' && (value.records.some(record => record.id === value.selectedId) || Object.hasOwn(value.drafts, value.selectedId)))) {
    throw new Error('记录比较配置不完整。');
  }
  return value;
}
