# Folio Workspace 本地交付验收

日期：2026-09-06。状态：experimental / 0.1.0。第五套 `folio-workspace` 已加入本地目录；本次没有提交、推送、创建 Release 或部署。

## 交付内容

- 设计研究：`docs/design-references/notion-ui.md` 与 `#/usage/notion`，包含三份 Notion 官方来源、设计观察和本项目取舍。第三方块示例截图位于 `references/folio-workspace-source.png`，按 NOTICE.md 单列，组件包不分发。
- 独立套系：`systems/folio-workspace/`，20 个 Token、11 个公开组件、七态合同、API / TypeScript、7 个展示栏目和统一画幅的真实组件封面。
- 内容流程：页面树与搜索、父子页面、新建和编辑标题、正文/标题/待办/折叠块、斜杠菜单、类型转换、上下移动、单次删除撤销。
- 数据流程：同一集合的表格/看板/列表，视图独立搜索/筛选/排序；记录新建、非模态详情、保存/取消与草稿继续编辑。
- 本地持久化：页面、块、记录、视图和草稿保存在浏览器；读取失败不覆盖旧内容，写入失败保留内存并支持重试与 JSON 导出。
- 接入：首页、场景页、使用方式、研究页相互连通。ESM 子路径、开发工具上下文和 Starter 使用实际 FolioWorkspace 入口，独立 Starter 不携带无关业务模板。

## 最后有效验证

| 范围 | 结果与证据 |
|---|---|
| `npm run check` | 通过：5 套隔离/Token/清单检查，组件分发构建，TypeScript，生产构建，24 项单元测试（含 4 项 Sites 相关测试）。日志 `.local-cache/folio-check-final.log`。 |
| Chromium 本地交互 | 六条 Folio 流程均通过；最后一次全量中的一个断言遇到 Vite 异步模块仍在加载，增加“等待模块出现”后单独复核通过。日志 `folio-chromium-final.log`、`folio-chromium-recheck.log`。 |
| Firefox 本地交互 | 六条 Folio 流程全部通过。日志 `.local-cache/folio-firefox-final.log`。 |
| WebKit 本地交互 | 六条 Folio 流程覆盖完成；修复菜单失焦问题后重跑块编辑与详情焦点用例，2 项通过。日志 `folio-webkit.log`、`folio-webkit-recheck.log`。 |
| 首页与既有流程 | Chromium 原四套表单/浮层、320/390/720/859px 布局和接入下载回归通过；修正新封面后，五套关键区域的完整缩放在 Chromium、Firefox、WebKit 均通过。日志 `folio-compat-chromium.log`、`folio-visual-recheck.log`、`folio-firefox.log`、`folio-webkit.log`。 |
| `npm run test:consumer` | 最终 tarball 在仓库外重新安装，类型与生产构建通过；验证包内没有 references / Gallery。日志 `.local-cache/folio-consumer-final.log`。 |
| 仓库外实际操作 | 原四套连续任务流程与 Folio 编辑/视图/刷新持久化，2 项通过。默认 5174 端口被 Windows 拒绝，改用操作系统分配的 8191；测试配置支持 UI_LAB_CONSUMER_PORT。日志 `.local-cache/folio-consumer-browser-final.log`。 |
| 文件与构建边界 | `git diff --check` 通过；受保护的 Sites 四文件没有修改。保留原有未提交改动，未新增依赖。 |

截图：`.local-cache/folio-desktop.png`、`.local-cache/folio-mobile.png`；发布用封面为 `references/thumbnails/folio-workspace.png`。本地日志与验收截图由 .gitignore 排除；上述记录说明本轮实际执行的范围。

## 本轮修正的具体问题

1. 新套系被通用接入示例假定拥有 DataTable/Drawer 等 API：增加 manifest.starter 独立入口，并校验单套 Starter 不导入不存在的组件。
2. 首页封面底部裁切：压缩静态封面的辅助操作区，保留正文块与完整记录集合；实际工作台保留编辑入口。
3. WebKit 点击菜单项时 blur 提前卸载菜单：在 pointerdown 阶段保持菜单内部焦点，使 click 正常执行，同时保留键盘和离开菜单行为。
4. 保存使记录离开当前分组或筛选：原触发点消失时，焦点回到当前视图页签。

## 明确边界

这是本地知识工作台原型与可复用 UI 套系。纯文本块不是成熟富文本引擎；本版没有块拖拽、关系/公式、日历、文件上传、模板系统、评论、权限、多人协作或云同步。JSON 当前只提供导出，未提供导入界面；相同 storageKey 不支持多标签并发合并。

中文测试覆盖真实文本输入与模拟 composition 事件，不代表所有实体输入法和设备均已人工验证。Firefox / WebKit 使用本机测试引擎，不等于真机 iOS/macOS 验收。构建、测试和截图不代表生产上线或完整无障碍认证。
