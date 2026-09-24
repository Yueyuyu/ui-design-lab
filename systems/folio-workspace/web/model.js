export const folioBlockTypes = { paragraph: '正文', heading: '标题', todo: '待办', toggle: '折叠' };
export const folioStatuses = ['未开始', '进行中', '已完成'];
export const folioViews = ['table', 'board', 'list'];
export const folioId = () => globalThis.crypto?.randomUUID?.() ?? `folio-${Date.now()}-${Math.random().toString(36).slice(2)}`;
export const createFolioPage = (title = '未命名页面', parentId = null) => ({
  id: folioId(), title, parentId, icon: 'page', blocks: [], records: [], drafts: {}, view: 'table',
  views: Object.fromEntries(folioViews.map(id => [id, { query: '', status: '全部', sort: 'manual' }])),
});
export function createFolioDocument() {
  const page = createFolioPage('设计是一场持续的观察');
  page.id = 'design-notes';
  page.blocks = [
    { id: 'b1', type: 'heading', text: '从观察，到下一步' },
    { id: 'b2', type: 'paragraph', text: '把零散的发现放在一起，让值得继续的想法浮现。这里既是一本手记，也是一张可以行动的清单。' },
    { id: 'b3', type: 'todo', text: '选一个日常界面，记录它如何组织内容', checked: true },
    { id: 'b4', type: 'toggle', text: '本周的研究问题', detail: '哪些操作应该始终可见？哪些信息适合在需要时展开？', open: false },
  ];
  page.records = [
    { id: 'r1', title: '内容优先的页面结构', status: '进行中', category: '界面观察', note: '用排版与轻分隔线组织正文，把动作留在内容附近。' },
    { id: 'r2', title: '一个集合，三种阅读方式', status: '未开始', category: '交互模式', note: '对比表格、看板和列表各自适合的任务。' },
    { id: 'r3', title: '侧开详情的连续处理', status: '进行中', category: '交互模式', note: '保留上下文，切换记录时保留未保存草稿。' },
    { id: 'r4', title: '让空白成为邀请', status: '已完成', category: '设计笔记', note: '给一个具体、可执行的下一步。' },
  ];
  const notes = createFolioPage('界面观察', page.id);
  notes.id = 'observations';
  notes.blocks = [{ id: 'n1', type: 'paragraph', text: '从一个细节开始：把观察写在这里，再建立属于这页的研究集合。' }];
  const weekly = createFolioPage('每周计划');
  weekly.id = 'weekly';
  weekly.blocks = [{ id: 'w1', type: 'todo', text: '回顾本周的设计发现', checked: false }];
  return { version: 1, activePage: page.id, pages: [page, notes, weekly] };
}
function validRecord(record) {
  return record && typeof record.id === 'string' && typeof record.title === 'string' && folioStatuses.includes(record.status) && typeof record.category === 'string' && typeof record.note === 'string';
}
export function validateFolioDocument(value) {
  const fail = () => { throw new Error('本地内容格式不受支持，原始内容未被覆盖。'); };
  if (!value || value.version !== 1 || !Array.isArray(value.pages) || !value.pages.length) fail();
  const ids = new Set(value.pages.map(page => page.id));
  if (ids.size !== value.pages.length || !ids.has(value.activePage)) fail();
  for (const page of value.pages) {
    if (typeof page.id !== 'string' || typeof page.title !== 'string' || (page.parentId !== null && !ids.has(page.parentId))) fail();
    const ancestors = new Set([page.id]);
    let parent = page.parentId;
    while (parent !== null) { if (ancestors.has(parent)) fail(); ancestors.add(parent); parent = value.pages.find(p => p.id === parent).parentId; }
    if (!Array.isArray(page.blocks) || new Set(page.blocks.map(b => b.id)).size !== page.blocks.length) fail();
    if (page.blocks.some(b => !b || typeof b.id !== 'string' || !Object.hasOwn(folioBlockTypes, b.type) || typeof b.text !== 'string' || (b.checked !== undefined && typeof b.checked !== 'boolean') || (b.open !== undefined && typeof b.open !== 'boolean') || (b.detail !== undefined && typeof b.detail !== 'string'))) fail();
    if (!Array.isArray(page.records) || !page.records.every(validRecord) || new Set(page.records.map(r => r.id)).size !== page.records.length) fail();
    if (!page.drafts || typeof page.drafts !== 'object' || Array.isArray(page.drafts) || !Object.entries(page.drafts).every(([id, r]) => validRecord(r) && r.id === id)) fail();
    if (!folioViews.includes(page.view) || !page.views || !folioViews.every(view => {
      const config = page.views[view];
      return config && typeof config.query === 'string' && ['全部', ...folioStatuses].includes(config.status) && ['manual', 'title'].includes(config.sort);
    })) fail();
  }
  return value;
}
export function filterFolioRecords(records, config) {
  const query = config.query.trim().toLocaleLowerCase();
  const result = records.filter(row => (config.status === '全部' || row.status === config.status) && [row.title, row.category, row.note, row.status].some(value => value.toLocaleLowerCase().includes(query)));
  return config.sort === 'title' ? result.sort((a, b) => a.title.localeCompare(b.title, 'zh-CN')) : result;
}
