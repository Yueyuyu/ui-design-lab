# v1.0.0-beta.1 发布检查

1. `npm run suite:list` 能发现全部套系，ID、顺序、前缀和短码唯一。
2. `npm run suite:check` 验证 JSON Schema、Token 双向绑定、源码与 CSS 隔离、七态、专项规则和正文对比度。
3. `npm run build` 生成 `dist/client/index.html`、`dist/server/index.js` 与 `dist/.openai/hosting.json`。
4. `npm run test:sites` 验证 Sites Worker 路由与静态资源。
5. 浏览器检查套系目录、四套实际栏目、`#/compare`、桌面/平板/手机预览和控制台错误。
6. 对每个视觉母版执行设计 QA；P0/P1/P2 清零后才能标记通过。

本文件是本地发布合同，不代表已经创建 Git Tag、GitHub Release 或完成线上发布。

## 交互和组件分发门槛

- `npm run check` 全部通过；`npm run test:sites` 在最终 Gallery 构建后通过。
- `npm run test:consumer` 在仓库外安装 tarball 并构建，公开 exports 指向的所有文件必须进入包；参考素材与 Gallery 不得进入组件包。
- `npx playwright install chromium firefox webkit` 后运行 `npm run test:e2e`；只运行 Chromium 用 `-- --project=chromium`，补充兼容性用 `npm run test:compat`。CI 自动把独立消费者目录传给浏览器测试；本地可设置 `UI_LAB_CONSUMER_DIR` 为 test:consumer 输出路径以覆盖消费者浏览器流程。
- 现场检查桌面 / 手机导航、长页面弹窗位置、焦点循环、Escape 恢复、错误恢复、实际剪贴板和 A/B 数据与滚动保持。
- LICENSE / NOTICE 的代码与素材边界完整；引入新外部素材时逐项更新来源。

新增工作流文件不代表远端 CI 已执行；本地验收、远端 CI、发布分别记录。

## 本轮候选产物（2026-09-05）

四套 ESM 子路径、类型、CSS、原创 WebP、场景 Starter、dist/client 与 Sites server 产物已纳入本地交付。最终结果见 docs/ACCEPTANCE.md。发布前需由实际运行方核对远端 CI、部署版本、公开地址、npm 包名及收款/发货；本次未执行这些外部动作。

## Beta 候选交付（2026-09-06）

`npm run release:prepare` 生成独立 dist/releases/<version>-<suffix>/，包含组件 tgz、四套可搬移 Starter、静态站 tgz、试用指南、空白记录模板、release-manifest.json 与 SHA256SUMS.txt。它不会创建 Git 提交、标签、Release、npm 发布或对外发送消息。

检查解压后的 Starter 能在仓库外安装、改字段和构建；再核对最终文件校验值。发布说明见 docs/BETA-NOTES.md，试用流程见 docs/BETA-TRIAL.md。

可使用 `npm run test:beta -- --dir=dist/releases/<候选目录>` 对指定产物进行 SHA-256 校验、四套仓库外解压、相对依赖安装、修改字段与构建。它只验证指定文件，不宣称远端发布；输出的临时项目路径保存在 .local-cache/beta-consumers.json。
