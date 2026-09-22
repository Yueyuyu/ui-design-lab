# Pulse 直接复用与来源

用户于 2026-09-21 明确要求沿用现成设计，只做 Windows 适配。本轮替换了先前自绘白色草稿。

## 已接入

- [Pulse](https://github.com/qunqin24/Pulse) 固定 commit：`2e17225ece661138de9ce9c73b322c7c1b16d753`。
- PanelSurface、DockLayout、DockBerthShape、UsageBubbleShape、UsageTint、BotMarkTint、BotMarkPersona、BotMarkChoreography 和 CardReveal 为样式/数值/编排来源。
- `web/upstream/choreography.json` 从 Swift 作者编排表机械转写；`pulse.js`、`motion.js` 为 JavaScript/SVG 平台移植，注明修改。Pulse Apache-2.0 见 `licenses/Pulse-Apache-2.0.txt`。
- `assets/openai.svg`、`cursor.svg`、`claude.svg`、`grok.svg`、`kimi.svg` 原样来自上述 Pulse commit 的 `Sources/Pulse/Resources/`；Lobe Icons MIT 和品牌说明见 `licenses/Pulse-THIRD-PARTY-NOTICES.md`。品牌标识不代表相关产品已完整接入；ZCode、豆包工作、WorkBuddy 暂用名称缩写，不拿其他产品标识替代。
- 动态机器人沿用 Pulse 同源 [iduu/grokbot-animation](https://github.com/iduu/grokbot-animation) Web 引擎，固定 `6c27d9640c37e02e1eab0c4f7d98fa01196c66b8`。原始几何、物理、粒子、SVG 变形代码不重画；适配层接入 Pulse 人格/节奏和生命周期管理，不包含语音模块。
- Windows 系统字体与 continuous 圆角采样属于平台适配。Companion 任务列表并非 Pulse 本身提供的业务，不冒充官方移植或背书。

## 本地素材隔离

Pulse 的 [bot-mark-geometry.md](https://github.com/qunqin24/Pulse/blob/2e17225ece661138de9ce9c73b322c7c1b16d753/Docs/decisions/bot-mark-geometry.md) 明确：机器人数据最终来自 x.ai 前端，第三方素材许可尚未解决。根 Apache-2.0 不等于素材授权，用户同意本地复用不代表取得第三方许可。

因此机器人文件只在被 Git 忽略的 `.local-cache/pulse-bot/`。开发服务器仅通过 loopback 专用端点提供；普通 Gallery build 不导入它，公开打包不复制它。本机桌面 build 显式输出到 `.local-cache/pulse-desktop/`，带 LOCAL-ONLY.json、来源 commit 和 SHA-256。不能把此输出作为 GitHub Release 或公开网站上传。

换机后公开源码能渲染静态品牌版；动态机器人需合法取得并单独准备本地资源，不能宣称公开仓库已经完整可分发。若未来解决授权，再明确改变此分发边界。未擅自替换另一套机器人。
