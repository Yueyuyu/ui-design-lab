# UI Design Lab 兼容性

## v1.0.0-beta.1 公共入口

| 套系 | Suite ID | 套系版本 | 状态 | 包入口 |
|---|---|---:|---|---|
| Quiet Workspace / 静谧工作台 | `quiet-workspace` | 0.3.0 | stable | `ui-design-lab/quiet-workspace` |
| Midnight Ledger / 午夜账盘 | `midnight-ledger` | 0.1.0 | experimental | `ui-design-lab/midnight-ledger` |
| Clearline Console / 澄明后台 | `clearline-console` | 0.1.0 | experimental | `ui-design-lab/clearline-console` |
| Signal Studio / 信号创作间 | `signal-studio` | 0.1.0 | experimental | `ui-design-lab/signal-studio` |

项目版本与套系版本独立：项目版本描述 Gallery、注册表、构建与公共导出合同；套系版本描述单套 Token、组件和视觉规范。

## 稳定性承诺

- Suite ID、CSS 作用域、Token 前缀和导出子路径在同一 MAJOR 版本内保持兼容。
- `stable` 套系遵循 SemVer；`experimental` 套系可能在 MINOR 版本中增加组件或调整视觉细节，但不会静默更换 ID 或前缀。
- 套系之间禁止导入彼此的 Token、组件、模式和资产；Gallery 和消费者示例可以在各自作用域中组合。
- 所有公共组件必须保留 default、hover、pressed、focus、disabled、loading、error 七态合同。

## 导入示例

```js
import { QuietButton } from "ui-design-lab/quiet-workspace";
import "ui-design-lab/quiet-workspace/tokens.css";
import "ui-design-lab/quiet-workspace/components.css";
```

```js
import { LedgerButton } from "ui-design-lab/midnight-ledger";
import "ui-design-lab/midnight-ledger/tokens.css";
import "ui-design-lab/midnight-ledger/components.css";
```

## 运行环境与安装边界

- Node.js 22+；React / React DOM 19.2+；ESM 构建工具。SSR 项目应在客户端边界使用交互组件。
- 原生 dialog、Popover API、inert、CSS 自定义属性及动态视口单位需由目标浏览器支持。2026-09-06 本地自动化使用 Chromium 151、Firefox 153、WebKit 26.5；Firefox 与 WebKit 各 12 项补充回归通过，覆盖四套保存/浮层、窄屏、减少动态、接入下载及上传。详细证据见 docs/ACCEPTANCE.md。
- 未发布 npm；安装本地 tgz 的流程见 QUICKSTART.md。根入口提供命名空间和类型，推荐按套系子路径导入。
- QuietCard 通过 state 表达容器状态；LedgerPanel 通过 loading/error 等参数表达内容状态。各套 API 不保证参数完全相同，禁止通过同名臆测混用。

## 本轮覆盖边界

- 窄屏：320、390、720×450、859px。720×450 验证 1440×900 在 200% 缩放时等效的布局宽高，不是操作系统 DPI 或真实浏览器缩放实测。
- `prefers-reduced-motion` 通过浏览器媒体偏好模拟，检查比较画布过渡关闭。
- 上传：文件选择器事件接收真实测试文件、重复选择、类型与大小约束、失败重试、合成 DataTransfer 拖放、取消后迟到结果和资料目录联动。
- 未覆盖：Windows 原生对话框人工操作、资源管理器实际拖放、Safari/macOS/iOS、实体触屏、屏幕阅读器、生产上传服务及全站 WCAG 审计。
