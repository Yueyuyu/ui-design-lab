# Folio Workspace API · 0.1.0

实验版，React 19 / ESM；所有组件由 `ui-design-lab/folio-workspace` 导入，外层必须声明 `data-ui-system="folio-workspace"`，并加载本套 `tokens.css` 与 `components.css`。类型以 web/index.d.ts 为准。

| 导出 | 输入 / 行为 |
|---|---|
| FolioButton | 原生 button 属性；tone: quiet / solid / danger；loading 禁止触发并保留 children 进度文案 |
| FolioStatus | value: 状态文本，已知状态提供浅色标签，其他文本保持中性色 |
| FolioCallout | children、tone: note / error、action；错误通过 alert 宣读 |
| FolioPageHeader | title、onChange(title)、disabled；标题直接编辑 |
| FolioPageTree | pages、activeId、onSelect(id)、onCreate(parentId)、disabled；嵌套导航、搜索、新建页面 |
| FolioBreadcrumbs | pages、activeId、onSelect(id)；父级路径与当前位置 |
| FolioBlockEditor | blocks、onChange(nextBlocks)、disabled；4 种块、斜杠菜单、类型转换、上下移动、单次删除撤销 |
| FolioViewTabs | value: table / board / list、onChange(view)、panelId；panelId 与调用方 tabpanel 对应 |
| FolioDatabase | records、view、config、onViewChange、onConfigChange(patch)、onOpen(id, trigger)、onCreate(trigger)、disabled、activeId、draftIds |
| FolioRecordDetail | record 草稿、onChange(record)、onSave(record)、onCancel、onClose、disabled；autoFocus 默认 true，静态目录预览可设为 false；非模态，不阻断背景 |
| FolioWorkspace | storageKey 默认 folio-workspace-v1，传 null 仅内存预览；固定于挂载生命周期，切换 key 用 React key 重新挂载 |

模型工具：createFolioDocument() 返回原创演示数据；createFolioPage(title?, parentId?) 返回独立空白页面；validateFolioDocument(unknown) 校验版本、页面关系、块、记录、草稿与视图；filterFolioRecords(records, config) 搜索/筛选/按标题排序，不修改原集合。

Block: { id, type: paragraph | heading | todo | toggle, text, checked?, open?, detail? }。
Record: { id, title, status: 未开始 | 进行中 | 已完成, category, note }。
ViewConfig: { query, status: 全部 | Record.status, sort: manual | title }。
Page: { id, title, parentId, blocks, records, drafts, view, views }。
Document: { version: 1, activePage, pages }。

组件均不导入 Gallery 或其他套系。FolioWorkspace 是 localStorage 完整示例；受控的编辑器/数据库/详情允许消费项目自持数据与接入后端。保存记录先更新本地集合，持久化结果以“已保存到此浏览器”为准。写入失败保留内存、可重试或导出 JSON；读取失败不覆盖原始内容。导出为备份数据，本版没有导入界面。

每个页面和每个视图配置独立，记录在三种视图间共享；关闭详情保留草稿，取消编辑丢弃草稿，保存合并记录。刷新保留草稿但不自动打开详情，可从“未完成的草稿”继续。

本版不提供富文本引擎、块拖拽、跨页关系、公式、日历、上传、多标签并发合并、实时协作、权限或云端保存。不要用本地状态展示这些能力。
