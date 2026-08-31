# v1.0.0 发布检查

1. `npm run suite:list` 能发现全部套系，ID、顺序、前缀和短码唯一。
2. `npm run suite:check` 验证 Token 作用域、七态、专项规则和正文对比度。
3. `npm run build` 生成 `dist/client/index.html`、`dist/server/index.js` 与 `dist/.openai/hosting.json`。
4. `npm run test:sites` 验证 Sites Worker 路由与静态资源。
5. 浏览器检查套系目录、两个套系的 7 个页面、`#/compare`、桌面/平板/手机预览和控制台错误。
6. 对每个视觉母版执行设计 QA；P0/P1/P2 清零后才能标记通过。

本文件是本地发布合同，不代表已经创建 Git Tag、GitHub Release 或完成线上发布。
