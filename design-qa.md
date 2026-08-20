# Quiet Workspace v0.3 Design QA

## 验收范围

- 验收日期：2026-08-20
- 目标组件：`QuietQuotaPill`
- 桌面入口：`#components/quota-pill`
- 规范入口：`#guidelines/status-carriers`
- 桌面视口：1280 × 720；页面内容宽度 1265px
- 移动视口：390 × 844；页面内容宽度 375px
- 验收对象：本地静态生产构建 `http://localhost:4174/`

## 视觉与语义结果

- 收起态只显示百分比，58 × 26px 视觉占位内没有 SVG、状态点、图标或常驻标签。
- 76%、32%、12% 分别使用浅绿、浅橙、浅红表面；计算后的文字颜色分别为 `rgb(77, 102, 80)`、`rgb(122, 98, 56)`、`rgb(133, 76, 72)`，没有使用近黑粗体。
- 详情面板计算背景为 `rgb(255, 255, 255)`，保持白色纸张表面，不继承胶囊状态色。
- 七态中的默认、悬停、按下、聚焦、禁用、加载和错误均保持 58 × 26px；加载显示 `…`，错误显示 `--`，没有布局跳动。
- 组件支持 `start`、`center`、`end` 三种弹层对齐；真实宿主示例使用 `end`，状态矩阵使用 `center`。

## 交互与动效结果

- 初始展开时 `aria-expanded="true"`，面板可见；点击收起后变为 `aria-expanded="false"`、`aria-hidden="true"`、`visibility: hidden`、`opacity: 0` 和 `pointer-events: none`。
- 面板从触发器方向展开：默认、居中和右对齐分别使用左下、中心下、右下变换原点。
- 进入使用 180ms、退出使用 120ms，过渡仅声明背景、边线、颜色、阴影、`transform`、`opacity` 和 `visibility`；没有 `transition: all`、`scale(0)` 或 `ease-in`。
- `prefers-reduced-motion` 会将套系内过渡时长归零，并停止循环动画。

## 响应式与边界结果

- 桌面修复前，状态矩阵右侧隐藏面板令文档宽度达到 1271px；改为居中对齐后，`clientWidth` 与 `scrollWidth` 均为 1265px。
- 移动端修复前，真实宿主面板向右展开令文档宽度达到 496px；改为右对齐后，`clientWidth` 与 `scrollWidth` 均为 375px。
- 390px 下真实面板范围为 87–323px，所有额度面板均处于 0–375px 视口内；七个状态单元均为 335px 宽并回到单列。
- 桌面和移动端有效截图均已人工检查：圆角、阴影、浅色表面、白色弹层、三档色彩和中文换行未见毛边、遮挡或溢出。
- 最终页面控制台 warning/error 为空。

## 修复记录

| Priority | Before | After | Result |
| --- | --- | --- | --- |
| P2 | 状态矩阵内不可见的绝对定位面板仍扩大桌面可滚动宽度 | 新增 `panelAlign="center"` 并从触发器中心展开 | 桌面横向溢出归零 |
| P1 | 390px 下真实宿主面板从左侧向右展开，超出视口 121px | 宿主示例使用 `panelAlign="end"`，从右下角展开 | 移动端横向溢出归零 |

当前没有剩余 P0、P1 或 P2 问题。

## 构建与测试

- `npm run check`：通过。108 个 CSS Token、13 组正文对比度、14 个组件七态、最小 11px 字号与 Vite 生产构建均通过。
- Sites 产物：`dist/client/index.html`、`dist/server/index.js`、`dist/.openai/hosting.json` 均已生成。
- `npm run test:sites`：4/4 通过。

final result: passed

---

# Quiet Workspace v0.2 Design QA

## 对照目标

- 视觉母版：`references/quiet-workspace-source.png`
- 母版像素：1492 × 901
- 最终同屏对照：`artifacts-v020-presentation-final.png`
- 最终组件页：`artifacts-v020-components-final.png`
- 移动端证据：`artifacts-v020-mobile.png`
- 桌面视口覆盖：1500 × 900；浏览器内容截图为 1485 × 891
- 移动视口覆盖：390 × 844；浏览器内容截图为 375 × 812
- deviceScaleFactor：1；截图像素与浏览器内容 CSS 像素 1:1
- 对照状态：Light first、Gallery 舒适密度、任务灯固定紧凑密度并展开

母版是完整桌面工作场景，Gallery 是设计系统文档，不把两者当作相同页面做像素叠加。`artifacts-v020-presentation-final.png` 在同一浏览器截图中并排放置母版和实时任务灯，用于检查任务灯结构、字体、间距、颜色、圆角、层级和背景边界；母版原图使用 `object-fit: contain`，未重采样或裁切关键内容。

## Full-view comparison evidence

- `artifacts-v020-presentation-final.png`：母版和实时实现同屏；任务灯的白色纸张表面、双状态胶囊、14px级标题、红橙局部状态、紧凑任务行、圆角和阴影层级与母版一致。
- 深色渐变只出现在 `.gallery-presentation-scene`，核心 `tokens.json` 和 `tokens.css` 不包含渐变背景。
- Gallery 仍保持深墨绿导航、暖白内容、鼠尾草绿强调和克制边线，不改变 Suite 01 的既有风格。

## Focused region comparison evidence

- `artifacts-v020-components-final.png`：按钮七态在同一视图中可读，加载与错误不改变组件占位。
- `artifacts-v020-mobile.png`：390 × 844 覆盖下，导航可横向滚动，组件回到单列，文档级横向溢出为 0。
- 浏览器计算结果：最小可见字号 11px；桌面主内容舒适密度控件 40px、紧凑密度 32px；任务灯在两种 Gallery 密度下始终为 32px。

## Required fidelity surfaces

### 字体与排版

- 字体栈保持 `Segoe UI Variable`、`Segoe UI`、`Microsoft YaHei UI`、系统无衬线。
- 移除了全部 9px 和 10px UI 字号；辅助文字最小 11px，控件和关键紧凑信息最小 12px，正文默认 14px。
- 标题、正文、标签、说明和等宽 Token 文本均使用明确行高；中文长文案可换行，不依赖截断表达关键错误。

### 间距与布局节奏

- 继续使用 4px 基准和既有 8/12/16px 圆角层级。
- 舒适密度为 40px 控件、52px 行高、20px 面板内边距；紧凑密度为 32px、40px、12px。
- 对话框、表格、通知和空状态保持稳定占位；加载与错误不会造成布局跳动。

### 颜色与 Token

- 88 个 CSS Token 通过命名空间校验。
- 9 组正文与语义状态文字对比度达到 4.5:1。
- 图表使用五级鼠尾草色阶；红、橙、绿只用于错误、执行中和成功语义。
- Gallery 深色渐变没有进入套系核心 Token。

### 图像与资产质量

- 原始母版以 1492 × 901 PNG 保留，未使用占位图、CSS 图形或手工 SVG 替代其中的视觉资产。
- 图标统一来自 Phosphor Icons；不存在 emoji、文本符号或混用图标家族。
- 图表是可访问的实时数据组件，不是装饰图片；每个数据项均保留精确中文标签、数值和单位。

### 中文文案与内容

- 按钮使用“动词 + 对象”，成功说明结果，错误说明原因和下一步。
- 数字、中文单位、路径和英文产品名遵循 `standards/chinese-copy.md`。
- 通知、空状态、对话框和表格错误文案脱离用户提示后仍能独立成立。

## 状态与交互验证

- 五页导航：总览、基础规范、组件、内容与行为、页面模式。
- Token 点击复制与 Toast。
- 舒适/紧凑密度切换；任务灯固定紧凑密度。
- 输入框编辑、原生下拉选择、开关。
- 按钮、输入框、下拉框七态展示。
- 对话框打开、背景滚动锁定、初始焦点、Shift+Tab 焦点循环、Escape 关闭和焦点返回。
- 表格默认行态、3行加载骨架、错误和空状态。
- 通知操作、关闭与 Toast。
- 空状态默认、加载、错误和重试入口。
- 图表数据项保持原生按钮语义，可获得“周一：42%”等访问名称。
- 任务灯展开/收起。
- 干净浏览器页的 warning/error 控制台日志为空。

## Comparison history

1. `[P2] 对话框背景可继续滚动，焦点没有完整循环。`
   - 修复：打开时锁定 `body` 滚动；Tab/Shift+Tab 在对话框内循环；关闭后恢复滚动并把焦点还给触发按钮。
   - 复核：打开后 `overflow: hidden`，初始焦点为“关闭对话框”；Shift+Tab 到“保存设置”；Escape 后焦点返回“打开对话框”，`overflow` 恢复。
2. `[P2] 表格的空状态切换缺少可访问名称。`
   - 修复：为扩展表格状态加入“空状态”标签。
   - 复核：加载态 `aria-busy=true` 且有3行骨架；错误和空状态说明均可见。
3. `[P1] 图表数据项覆盖为 listitem 角色，丢失原生按钮语义。`
   - 修复：绘图区改为命名 group，数据项保留原生 button 角色。
   - 复核：数据项可通过 button 角色定位，聚焦后的访问名称为“周一：42%”。

以上问题均已修复并完成浏览器复核，当前没有剩余 P0、P1 或 P2 问题。

## Implementation checklist

- [x] 取消 9px/10px UI 字号并提高灰色文字对比度
- [x] 建立舒适与紧凑双密度
- [x] 固定任务灯为紧凑密度
- [x] 补齐按钮、输入框、下拉框、对话框、表格、通知和空状态
- [x] 13 个组件定义默认、悬停、按下、聚焦、禁用、加载和错误状态
- [x] 建立图标、图表、中文文案和动效规范
- [x] 将深色渐变限制在 Gallery 展示场景
- [x] 完成桌面、移动、键盘、控制台、构建和 Sites 验证

## Follow-up polish

- P3：未来只有在出现明确产品需求和视觉母版时，再增加折线图、散点图或深色产品主题；不从当前 Gallery 展示背景反推核心深色 Token。

final result: passed
