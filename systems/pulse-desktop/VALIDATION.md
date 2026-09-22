# Pulse 原版适配验证 · 2026-09-21

状态：draft / 本机示例，未替换已安装 Companion，未 commit/push/发布新版本。

## 当前证据

- 网页：真实 IAB 中三背景 × 四缩放 × 三状态共 36 组边界检查，无画布溢出。
- 原版引擎加载状态 pulse-upstream / ready；leaf 造型、playful 人格可选择。停止动作后 running=false。
- 关注增至 3 项；完成项继续保留；连接失败显示 —、全部任务打开按钮禁用；重试恢复；任务点击返回对应示例标题；Escape 收起并回焦触发器。
- Windows 最新有效报告：Companion artifacts/pulse-webview/verification.json，2026-09-21T04:52:12.9238816Z。12 个模式/缩放组合，原版机器人加载、无网页溢出；每组分别捕获 WebView2 内容及已加载 WPF 合成层（24 张），并断言合成层同时包含内容和透明像素。原生命中区沿共享 SVG 轮廓生成，透明面板边带不扩成矩形挡住桌面。
- 100/125/150/200% 指应用内渲染缩放。没有改 Windows 显示设置或壁纸；截图不是系统桌面截图。真实混合 DPI、显示器拔插和最终桌面观感仍待用户确认。
- 本轮 npm run check 已通过套系、类型、公共构建和 33 项 Node 测试；旧 WPF 草稿的验收不作为原版证据。

## 实现及待验收边界

已接原版服务 SVG、机器人几何/引擎、8 人格、18 造型、Pulse 配色、64px 黑色轨道、6px 贴边细条、bubble 与 CardReveal 入场。关注/重试/打开接口保留。退出及 berth 连续变形尚未逐帧移植，当前以即时切换为准；见 standards/motion.md。

普通生产构建不包含机器人数据；本机版在 .local-cache / Companion bin 中带 LOCAL-ONLY.json。用户尚未许可公开分发未授权素材。旧 Companion 的通知、真实额度和任务跳转仍留在原实现，不以固定样例宣称已完成真实数据迁移。
