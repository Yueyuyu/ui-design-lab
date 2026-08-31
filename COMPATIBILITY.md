# UI Design Lab 兼容性

## v1.0.0 公共入口

| 套系 | Suite ID | 套系版本 | 状态 | 包入口 |
|---|---|---:|---|---|
| Quiet Workspace / 静谧工作台 | `quiet-workspace` | 0.3.0 | stable | `ui-design-lab/quiet-workspace` |
| Midnight Ledger / 午夜账盘 | `midnight-ledger` | 0.1.0 | experimental | `ui-design-lab/midnight-ledger` |

项目版本与套系版本独立：项目版本描述 Gallery、注册表、构建与公共导出合同；套系版本描述单套 Token、组件和视觉规范。

## 稳定性承诺

- Suite ID、CSS 作用域、Token 前缀和导出子路径在同一 MAJOR 版本内保持兼容。
- `stable` 套系遵循 SemVer；`experimental` 套系可能在 MINOR 版本中增加组件或调整视觉细节，但不会静默更换 ID 或前缀。
- 套系之间禁止导入彼此的 Token、组件、模式和资产；仅 Gallery 可以并排组合。
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
