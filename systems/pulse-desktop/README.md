# Pulse Desktop

独立的 Pulse Windows 适配原型，保留原版黑色轨道、造型、颜色和动作，不覆盖 Quiet Workspace。

- 交互入口：`#/systems/pulse-desktop/playground`
- 原版 OpenAI 图标、8 人格、18 造型；紧凑 / 展开 / 贴边。
- 表现层接口保留额度、任务、关注、固定、重试和打开回调。
- 当前全部为示例数据；没有移除旧胶囊、接入真实账号、发送真实通知或发布 Release。
- Windows 宿主：Companion 的 `prototypes/pulse-desktop/build-webview.ps1`。
- 本机共享界面构建：`node scripts/build-pulse-desktop.mjs`。需先具有本地机器人资源。

原版来源、授权边界见 [UPSTREAM.md](UPSTREAM.md)，接口见 [API.md](API.md)，本次验证见 [VALIDATION.md](VALIDATION.md)。
