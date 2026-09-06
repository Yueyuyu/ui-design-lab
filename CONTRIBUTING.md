# 贡献指南

先阅读 AGENTS.md、DESIGN_SYSTEMS.md 和目标套系规范。提交应聚焦一个逻辑变更，保留套系独立性；请勿提交密钥、真实客户数据或未获授权的素材。

## 本地验证

```sh
npm ci
npm run check
npx playwright install chromium
npm run test:e2e
npm run test:consumer
```

check 包含套系合同、Token 双向绑定、源码隔离、Node 回归、类型检查、Gallery 构建和组件包构建。浏览器回归覆盖弹窗、对比状态与导出、手机入口和包消费示例；它不代表完整 WCAG 认证。

## 新增套系

使用 suite:new 创建 draft。补齐独立视觉来源、Token、七态行为、API、展示和 validation 后再申请提升状态。比较能力通过套系自己的 comparison/index.jsx 和 suite.json.comparison 注册，禁止修改 Gallery 以硬编码新套系。

新增或修改 Token 时同步维护 foundations/token-bindings.json；校验会拒绝 CSS/JSON 数值漂移及缺失绑定。任何例外必须以可验证的独立映射表达。

## 提交说明

说明用户能观察到的变化、影响套系、验证命令和限制。视觉修改附桌面及手机截图；修复交互问题补可复现的回归测试。遵循 `<type>: <中文描述>` 的提交格式。

贡献者应有权提交所贡献内容，并同意其原创代码按 MIT 分发。第三方参考素材必须记录来源及授权范围；不要将其他项目的专有设计资产作为原创贡献。
