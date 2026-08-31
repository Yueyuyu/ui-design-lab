# UI Design Lab 截图反馈修订 Design QA

- 验收日期：2026-08-31
- 用户截图：`C:\Users\Yueyu\AppData\Local\Temp\codex-clipboard-93e8a098-6f46-4c76-9660-bdf0d5ea6670.png`、`C:\Users\Yueyu\AppData\Local\Temp\codex-clipboard-37e1a03e-0746-4c3b-9856-fc7c285af02d.png`
- Midnight Ledger 实现：`design-qa-midnight-chart-after.png`
- Midnight Ledger 同屏对照：`design-qa-midnight-chart-comparison.png`
- 首页桌面实现：`design-qa-home-after.png`
- 首页同屏对照：`design-qa-home-typography-comparison.png`
- 首页移动端实现：`design-qa-home-mobile-after.png`

## 修订结果

- 折线图主 SVG 选择器已经收窄到 `.ml-line-chart__plot > svg`，18px 的 Phosphor 错误图标不会再被拉伸成整卡尺寸。
- 默认、加载、错误三张状态卡高度均为 `285px`，内部绘图区均为 `180px`；错误图标实测为 `24 × 24px`。
- 加载态包含同步状态、辅助说明和可辨识的骨架反馈；错误态使用紧凑说明、无效数值 `—` 和“重新加载”操作。
- “重新加载”交互已验证，点击后展示“已请求重新加载行情”状态消息；页面控制台没有 warning 或 error。
- 首页导航改为共享分段容器，并给“设计系统”与“同场景对比”提供明确的当前页状态。
- Hero 标题最大字号由 `50px / 720` 收敛到 `46px / 650`，正文提升到 `15px / 1.72`；移动端标题按语义拆为“选择一套完整的 / 设计语言”，没有孤字换行。
- 原本由横线和短文字组成的对比入口已改为完整横向行动组件，包含目的说明与明确的“开始对比”动作。
- “三步开始使用”已改为中性浅色分组区域，标题、编号、图标、说明和步骤分隔形成稳定层级，不再像未完成的表格片段。

## 响应式与视觉复查

- 桌面验收视口 `1280 × 720`：首页文档宽度与滚动宽度均为 `1265px`；导航可见，比较入口高 `76px`，三步流程保持横向四列关系。
- 移动验收视口 `390 × 844`：首页与 Midnight Ledger 组件页均无横向溢出；图表三态回到单列，每张卡宽 `347px`。
- 用户截图与最终实现已分别合并到两张同屏对照图中复查。当前没有剩余 P0、P1 或 P2 视觉问题。

## 最终验证

- `npm run suite:check`：通过，2 套设计系统、28 个状态组件和对比度规则全部通过。
- `npm run build`：通过，生成 `dist/client/index.html`、`dist/server/index.js` 和 `dist/.openai/hosting.json`。
- `npm run test:sites`：4/4 通过。
- `git diff --check`：通过；仅有工作区既存的 `VERSION` LF/CRLF 提示。

final result: passed

---

# UI Design Lab 首页 Design QA

- Source visual truth: `C:\Users\Yueyu\.codex\generated_images\01a055df-acab-7e30-9c63-912d1fc33e6e\exec-50ab66a3-8821-4370-9ca0-ce32b8982a86.png`
- Implementation screenshot: `B:\Support\Project\ui-design-lab\implementation-home-1440x1024-v2.png`
- Final clean-session screenshot: `B:\Support\Project\ui-design-lab\implementation-home-qa-final.png`
- Full-view comparison: `B:\Support\Project\ui-design-lab\design-qa-home-comparison-v2.png`
- Additional states: `implementation-home-mobile-390x844.png`, `implementation-quiet-shell-1440x1024.png`, `implementation-midnight-shell-1440x1024.png`
- State: public homepage at `#systems`, initial scroll position; suite shell checks at each suite overview.

## Capture normalization

- Intended CSS viewport: `1440 x 1024`, device scale factor `1`.
- Source pixels: `1487 x 1058`.
- Browser implementation capture pixels: `1425 x 1013`; the explicit browser viewport remained `1440 x 1024`, with the captured document area excluding browser scrollbar/chrome allocation.
- Comparison normalization: both images were proportionally scaled and centered on separate `1440 x 1024` white canvases, then joined horizontally at `2880 x 1024`.
- Mobile verification: explicit `390 x 844` viewport; document `scrollWidth` and `clientWidth` both `375`, so there is no horizontal overflow.

## Full-view comparison evidence

The final joined comparison shows the selected neutral product-portal hierarchy on both sides: restrained header, left-aligned hero, one primary CTA, two dominant suite previews, the centered comparison affordance, and the three-step usage strip. The implementation preserves the selected mock's white paper surface, graphite typography, hairline borders, low elevation, and suite-local image color boundaries.

No separate focused crop was required after the final full-view pass: the joined `2880 x 1024` artifact keeps the hero typography, card anatomy, suite names, tags, controls, and imagery readable. The two suite shells were also captured separately at full viewport to verify the theme-owned chrome rather than judging it from the smaller homepage cards.

## Comparison history

### Pass 1

- [P2] Hero title scale and horizontal inset were larger than the selected mock.
  - Evidence: the first joined comparison showed the implementation headline and page margins reducing the card stage width and shifting the hierarchy.
  - Fix: reduced the desktop headline maximum from `56px` to `50px`; widened the homepage frame from `1312px` to `1360px` and recalibrated horizontal padding.

### Pass 2

- Post-fix evidence: `design-qa-home-comparison-v2.png`.
- Result: no actionable P0, P1, or P2 differences remain.
- Accepted P3 variation: the implementation uses the actual registered suite source images and slightly fuller Chinese descriptions instead of the generated mock's composited preview copy. This improves truthfulness and future extensibility without changing hierarchy or card anatomy.

## Required fidelity surfaces

- Fonts and typography: Segoe UI Variable / Segoe UI / Microsoft YaHei UI stack matches the repository and Windows-oriented target. Display and body hierarchy, line height, weights, wrapping, and minimum 11px auxiliary text were checked; suite validation passes.
- Spacing and layout rhythm: header, hero, two-column feature stage, card padding, compare divider, and usage strip align with the selected mock. Desktop and mobile have no overlap or horizontal clipping.
- Colors and visual tokens: homepage stays neutral and does not inherit either suite. Suite shells read `galleryShell` metadata from the active manifest; verified sidebar colors change from `rgb(243, 245, 241)` to `rgb(19, 24, 42)` when switching suites.
- Image quality and asset fidelity: cards use registered real source images, preserve aspect ratio with `object-fit: cover`, and contain no placeholders, handmade SVGs, CSS illustrations, or token leakage.
- Copy and content: homepage explains discovery, comparison, suite entry, and Codex usage. The first two entries are featured; future entries are placed in the searchable full directory.
- Icons: all visible icons come from the existing Phosphor icon family with consistent stroke weight and alignment.
- States and interactions: verified homepage CTA, suite entry, expandable suite switcher, switching Quiet Workspace to Midnight Ledger, returning to the directory, desktop/mobile viewport behavior, outside-click/Escape close behavior in code, hover/focus styling, and active suite state.
- Accessibility: semantic headings/regions/buttons, alt text, labeled controls, focus-visible outlines, minimum text sizing, reduced-motion compatibility from the existing shell, and practical mobile button sizes are present.
- Browser console: a fresh post-restart browser session loaded the final homepage with zero warning or error entries.

## Implementation checklist

- [x] Neutral external homepage separated from suite chrome.
- [x] Two featured suites sourced from the registry.
- [x] Future suites routed into a searchable directory.
- [x] In-suite switcher sourced from the same registry and scrollable at scale.
- [x] Entire sidebar, top bar, controls, and workspace shell adapt from suite manifest metadata.
- [x] Desktop and mobile responsive checks.
- [x] Clean browser console, suite validation, production build, and Sites worker tests.

## Follow-up polish

- P3: when a third suite is added, re-run a visual pass on the conditional searchable directory with real content to tune long-name truncation and mixed-language tag density.

final result: passed

---

# 同场景 A/B 工作台 Design QA

- 验收日期：2026-08-31
- Source visual truth：`B:\Support\Project\ui-design-lab\references\comparison-workbench-source.png`
- Implementation screenshot：`B:\Support\Project\ui-design-lab\implementation-comparison-1488x1058.png`
- Mobile screenshot：`B:\Support\Project\ui-design-lab\implementation-comparison-mobile-390x844.png`
- Full-view joined comparison：`B:\Support\Project\ui-design-lab\design-qa-comparison-workbench.png`
- Route / state：`http://localhost:5173/#compare`；Quiet Workspace；月度经营复盘；桌面、舒适、默认；模块拆解为图表。

## Capture normalization

- Source pixels：`1487 × 1058`。
- Implementation pixels：`1488 × 1058`；应用内浏览器显式 CSS viewport 为 `1488 × 1058`，device scale factor 按 `1` 比较。
- Joined comparison pixels：`2995 × 1058`。两张图保持原始像素与原始纵向裁切，中间仅加入 `20px` 灰色分隔，没有缩放或重新取景。
- Mobile：显式 viewport `390 × 844`；应用内浏览器产出内容截图 `375 × 812`。运行时 `window.innerWidth = 390`，文档 `scrollWidth = 375`，没有页面级横向溢出。

## Full-view comparison evidence

- 三栏结构一致：左场景栏、中间单画布与模块拆解、右侧当前选择与指令面板均保持相同顺序和固定分区。
- 中间主画布实测 `y=215–752`，源图约为 `y=208–754`；模块拆解实测 `y=765–1000`，源图约为 `y=767–1002`，首屏比例和下一段可见量已经对齐。
- 顶部 Suite A/B、交换、视口、密度、状态控件的容器模型与源图一致；主画布只显示当前套系，不再并排两张完整页面。
- 主场景保留同一组 `¥284,600 / 1.8% / 1,248` 指标和 `3月–8月` 柱图；模块拆解的两套图表也使用完全相同的月份和值。
- 右侧面板保留当前套系、套系特征、场景与状态、数据一致性、复制指令、进入套系和指令预览的完整层级。

未再单独制作局部裁切：原始 source 和 implementation 都以近 `1.5K × 1K` 原尺寸直接打开，joined comparison 保留了控件、中文、图表月份、状态标签和提示词的可读性；同时通过浏览器 DOM 与实测边界复核了容易在缩放图中误判的画布、模块和滚动尺寸。

## Comparison history

### Pass 1

- [P2] 主画布过高，模块拆解只能露出标题，违背源图首屏同时看见主场景与模块对照的层级。
  - Evidence：首版主画布高度约 `681px`，模块从视口底部之后才开始；源图主画布约 `546px`。
  - Fix：压缩 Gallery 场景容器、卡片标题区、字段间距和比较专用图表高度，同时保持套系字号、Token 与组件结构不变。

- [P2] 模块样例存在多余的“图表”外层标题，并且 Midnight Ledger 柱形自然高度撑大整行。
  - Evidence：首版模块高度约 `373px`，与源图约 `234px` 明显不符。
  - Fix：移除模块样例的重复容器标题，保留组件自己的图表标题；共享行高并限制模块态柱形最大高度。

### Pass 2

- [P2] 为压缩高度而预留的 Quiet Workspace 图表数值行使柱形过矮。
  - Evidence：第二版主图柱形视觉重量低于源图。
  - Fix：将悬停数值改为绝对定位，不再占据图表网格行；柱形恢复源图的可读高度，悬停反馈仍然保留。

### Pass 3

- Post-fix evidence：`design-qa-comparison-workbench.png`。
- Result：没有剩余可执行的 P0、P1 或 P2 问题。

## Required fidelity surfaces

- Fonts and typography：公共工作台使用 Segoe UI Variable / Segoe UI / Microsoft YaHei UI；套系内容继续使用各自 canonical font stack。辅助文字不低于 11px，suite validation 已覆盖字号约束。
- Spacing and layout rhythm：三栏宽度、顶部控制区、单画布、双卡场景、模块标签与右侧面板均对齐源图。组件自身结构被保留，没有用整页强制等高修补差异。
- Colors and visual tokens：公共外壳保持中性白色；Quiet Workspace 使用鼠尾草与纸张 Token，Midnight Ledger 使用深蓝、奶油与绿色 Token。两个套系仅在独立 `data-ui-system` 作用域内渲染。
- Image quality and asset fidelity：目标是代码原生工具界面，没有独立摄影或插画资产。所有图标使用现有 Phosphor 家族，没有 emoji、占位图、手绘 SVG 或 CSS 插画替代。
- Copy and content：导航、场景、指标、按钮和面板标题与源图一致。场景描述已对齐“同一场景 · 温润编辑型工作台”。
- Icons：品牌比较页使用最接近源图的 Phosphor Clover；场景、控制、复制和跳转图标保持同一家族、相近尺寸和线性权重。
- States and interactions：验证 Suite A/B 选择与交换、单画布瞬切、表单值跨套系保留、五个场景、默认/加载/错误、桌面/移动端、舒适/紧凑、模块标签、高亮差异、复制提示词和进入套系。
- Accessibility：语义化导航、tab、switch、select、label、表格 caption、键盘焦点与 reduced-motion 均保留。`390 × 844` 没有页面级横向溢出。

## Above-the-fold copy diff

- 匹配：品牌、公共导航、场景列表、Suite A/B 名称、当前画布标签、数据保持说明、场景标题、三项指标、月份、决策字段、模块标签和右侧分组标题。
- Intentional P3：套系角标使用注册表 canonical shortCode `QW / ML`，没有降级为概念稿中的 `Q / M`。
- Intentional P3：指令预览使用可直接交给 Codex 的完整执行约束，内容比概念图占位指令更完整。
- Intentional P3：模块中的 Midnight Ledger 也使用“近六月收入”和 `3月–8月`，以满足同场景必须同数据、同口径的产品约束；不沿用概念图中容易误解为另一指标的“月度收益”。

## Browser verification

- 使用 Codex 应用内浏览器打开本地 Vite 页面并保持交付标签页可见。
- 桌面原生目标尺寸 `1488 × 1058` 与移动端 `390 × 844` 均已检查。
- 复制指令后读取浏览器剪贴板，确认包含 `quiet-workspace` 套系约束。
- 表单名称从“八月增长复盘”改为“九月持续增长复盘”后切换到 Midnight Ledger，值保持不变；设置页负责人和自动保存状态也跨套系保持。
- Suite A/B 交换后的值为 `quiet-workspace / midnight-ledger`；“进入套系”跳转到 `#/systems/midnight-ledger/overview`。
- 浏览器控制台 warning / error：`0`。

## Final verification

- `npm run suite:check`：通过，2 套设计系统、28 个状态组件和全部对比度规则通过。
- `npm run build`：通过，生成 `dist/client/index.html`、`dist/server/index.js`、`dist/.openai/hosting.json`。
- `npm run test:sites`：4/4 通过。
- `git diff --check`：通过；只有工作区既存的 `VERSION` LF/CRLF 提示。

final result: passed
