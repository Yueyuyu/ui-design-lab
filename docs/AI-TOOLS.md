# 开发工具与多页面一致性案例
通用入口：套系使用指南生成 Markdown，包含版本、能力、限制、作用域、真实 TypeScript API、仓库路径与安装包路径。比较页追加场景 JSON，保留编辑值与 false。

- Codex：将说明放进消费项目 AGENTS.md，注明根目录或 node_modules 路径。本次实现与浏览器验证由 Codex 完成。
- Claude Code：可将同一通用说明纳入 CLAUDE.md，再要求读取实际套系 API。文档入口已准备，未实际启动验证 Claude Code。
- Cursor：可在项目规则中引用同一说明与套系路径。规则格式随工具版本核验，本任务未实际运行 Cursor。

可复现需求：“使用所选套系建立任务列表、详情/结果、用量与设置。列表支持筛选排序分页；详情使用本套 Drawer；设置可保存取消，失败保留输入。禁止手写跨套系 Token，数据由明确的模拟接口提供。”

实施证据：
- 列表：src/gallery/workbench/WorkflowDemo.jsx 使用注入的 DataTable。
- 详情：相同 Task ID 打开 Drawer，共享状态与历史。
- 用量：由相同 tasks 数组计算，不能写死独立指标。
- 设置：SettingsPlayground + useSavedForm，受控字段与本地恢复。
- 套系适配：systems/*/showcase/ui.js；同一业务页面不导入别套 Token。
- 纠偏：图表去除默认收益/周期；保存去除仅 Toast 的假成功；错误、取消与结果进入可观察流程。

复跑步骤：生成 Starter；替换任务数组一列；运行构建与类型检查；用键盘打开详情、取消编辑、模拟失败并重试；截图检查密度/焦点；记录问题与修正。代码存在不证明所有 AI 模型都自动遵循规范，也不保证无需人工修正。
