# UI Design Lab 套系索引

本仓库使用稳定的套系 ID 选择视觉系统。编号只表示 Gallery 排序，不参与代码识别。

| Suite ID | 名称 | 前缀 | 状态 | 入口 |
|---|---|---|---|---|
| `quiet-workspace` | Quiet Workspace / 静谧工作台 | `qw` | stable | `systems/quiet-workspace/suite.json` |
| `midnight-ledger` | Midnight Ledger / 午夜账盘 | `ml` | experimental | `systems/midnight-ledger/suite.json` |

## Codex 选择规则

当用户说“使用 `quiet-workspace`”时：

1. 读取对应的 `suite.json` 和 `DESIGN.md`。
2. 读取套系 Token、标准和组件入口。
3. 优先复用套系已有组件，不重新制造近似组件。
4. 使用清单声明的 `data-ui-system` 作用域和 Token 前缀。
5. 不得引用其他套系的 Token、组件、模式或资产。
6. 完成后运行 `npm run suite:check`。

`midnight-ledger` 遵循同样读取顺序，但必须使用 `[data-ui-system="midnight-ledger"]`、`--ml-*` 和 `Ledger*` 组件。编号只用于 Gallery 排序，不能代替 Suite ID。

## 机器命令

```powershell
npm run suite:list
npm run suite:check
npm run suite:new -- new-suite --name "New Suite" --zh "新套系" --prefix ns
```
