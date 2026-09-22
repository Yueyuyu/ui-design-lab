# 七态合同

参见 foundations/interaction-states.json。七态为 default / hover / pressed / focus / disabled / loading / error。容器的焦点与按压由其控件承载。loading 和 error 使用未知额度 — 而非零。重试、关闭、退出不被内容禁用状态阻断。

账户额外业务状态：未登录、授权中、暂无有效窗口、限流、未接入分别描述，不混为读取故障。授权中只提供取消；凭据损坏先显式断开再登录。按钮保留键盘聚焦、按压反馈和低动态适配。多应用每页最多三项，面板限高滚动，不扩展成贯穿桌面的长浮条。Gallery 始终固定示例，不代替真实账户验收。
