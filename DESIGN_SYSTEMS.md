# UI Design Lab 套系索引

本仓库使用稳定的套系 ID 选择视觉系统。编号只表示 Gallery 排序，不参与代码识别。

套系代表可跨业务复用的设计语言，场景是套内页面组合。Apple、ChatGPT、小米等设计理念方向的研究与交付要求见 [设计理念套系规划](docs/SUITE-PHILOSOPHIES.md)。下表只列已注册套系，不包含研究候选。

<!-- suites:start -->
| Suite ID | 名称 | 前缀 | 状态 | 入口 |
|---|---|---|---|---|
| `quiet-workspace` | Quiet Workspace / 静谧工作台 | `qw` | stable | [suite.json](systems/quiet-workspace/suite.json) |
| `midnight-ledger` | Midnight Ledger / 午夜账盘 | `ml` | experimental | [suite.json](systems/midnight-ledger/suite.json) |
| `clearline-console` | Clearline Console / 澄明后台 | `cc` | experimental | [suite.json](systems/clearline-console/suite.json) |
| `signal-studio` | Signal Studio / 信号创作间 | `ss` | experimental | [suite.json](systems/signal-studio/suite.json) |
| `folio-workspace` | Folio Workspace / 页集工作台 | `fw` | experimental | [suite.json](systems/folio-workspace/suite.json) |
| `orchard-ui` | Orchard UI / 果序 · Apple 风格 | `ou` | experimental | [suite.json](systems/orchard-ui/suite.json) |
| `dialogue-ui` | Dialogue UI / 对谈 · ChatGPT 风格 | `du` | experimental | [suite.json](systems/dialogue-ui/suite.json) |
| `pulse-desktop` | Pulse Desktop / 脉点桌面 | `pd` | draft | [suite.json](systems/pulse-desktop/suite.json) |
<!-- suites:end -->

## Codex 选择规则

用户指定任一 Suite ID 时：

1. 读取对应的 `suite.json` 和 `DESIGN.md`。
2. 读取套系 Token、标准和组件入口。
3. 优先复用套系已有组件，不重新制造近似组件。
4. 使用清单声明的 `data-ui-system` 作用域和 Token 前缀。
5. 不得引用其他套系的 Token、组件、模式或资产。
6. 完成后运行 `npm run suite:check`。

作用域、前缀和组件入口均从所选 suite.json 读取。编号只用于 Gallery 排序，不能代替 Suite ID。消费项目使用包内 skills/consume-suite/SKILL.md；仅修改实验室源码时运行 suite:check。

## 机器命令

```powershell
npm run suite:list
npm run suite:check
npm run suite:new -- new-suite --name "New Suite" --zh "新套系" --prefix ns
```
