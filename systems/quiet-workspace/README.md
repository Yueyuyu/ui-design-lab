# Quiet Workspace / 静谧工作台

`Quiet Workspace` 是 UI Design Lab 的 Suite 01。它服务于需要长时间阅读、监控和处理信息的桌面效率工具。

## 设计原则

1. **安静但不模糊**：使用低饱和表面和细边线，但关键状态必须清楚。
2. **内容先于容器**：优先依靠排版、间距和分组建立层级，减少无意义卡片。
3. **状态载体匹配信息**：并行任务状态使用点和短轨道，单一连续额度使用低饱和整块胶囊；不机械复用装饰。
4. **短促而稳定**：交互反馈采用 140–180ms 缓出，不使用持续漂浮或循环动画。
5. **Windows 友好**：优先匹配 Segoe UI 与 Microsoft YaHei UI 的字形和密度。

## 使用边界

```jsx
import { QuietButton, QuietStatusChip } from "./systems/quiet-workspace/web/index.js";
import "./systems/quiet-workspace/foundations/tokens.css";
import "./systems/quiet-workspace/web/components.css";

export function Example() {
  return (
    <div data-ui-system="quiet-workspace">
      <QuietButton>继续</QuietButton>
      <QuietStatusChip tone="running">执行中</QuietStatusChip>
    </div>
  );
}
```

组件不得脱离 `[data-ui-system="quiet-workspace"]` 使用，也不得覆盖其他套系的 Token。

## 字体策略

默认使用系统字体，不打包或再分发受系统许可约束的字体文件：

```css
"Segoe UI Variable", "Segoe UI", "Microsoft YaHei UI", system-ui, sans-serif
```

英文和数字优先由 Segoe UI 渲染，中文通常由 Microsoft YaHei UI 渲染。

- 辅助文字最小 11px。
- 控件标签和关键紧凑信息最小 12px。
- 正文默认 14px。
- 普通文字对比度至少 4.5:1。

## 密度

- `comfortable`：40px 控件、52px 行高、20px 面板内边距，用于常规工作台和内容页面。
- `compact`：32px 控件、40px 行高、12px 面板内边距，用于任务灯、监控列表、浮层和高频工具。

紧凑密度仍保证关键内容不低于 12px；桌面任务灯固定使用紧凑密度，不继承外层 Gallery 的密度切换。

## 组件与状态

当前 Web 组件包括：

- Button、IconButton、StatusChip
- Field、Select、Toggle
- Card、Dialog、Table
- Notification、EmptyState
- BarChart、TaskLight、QuotaPill、WorkspacePreview

每个组件都必须定义默认、悬停、按下、聚焦、禁用、加载和错误状态。结构化状态说明位于 `foundations/interaction-states.json`。

`QuietQuotaPill` 的详情面板可通过 `panelAlign="start" | "center" | "end"` 对齐触发器。默认使用 `start`；靠近容器右缘或窄屏宿主时使用 `end`，状态矩阵等居中展示使用 `center`，避免浮层扩大页面可滚动宽度。

## 专项规范

- `standards/accessibility.md`
- `standards/component-states.md`
- `standards/icons.md`
- `standards/data-visualization.md`
- `standards/chinese-copy.md`
- `standards/motion.md`
- `standards/status-semantics.md`

深色渐变桌面背景是展示场景，只能定义在 Gallery 的 `src/` 样式中，禁止加入套系核心 Token。
