# 组件状态规范

所有可复用组件必须覆盖 `default`、`hover`、`pressed`、`focus`、`disabled`、`loading` 和 `error` 七种状态。结构化定义位于 `foundations/interaction-states.json`。

- 交互反馈不得改变组件占位尺寸，避免界面跳动。
- Hover 只作为增强，不能承载触屏和键盘用户无法获得的信息。
- Pressed 使用颜色和位置反馈，不缩放文字或改变布局。
- Focus 必须独立于 Hover，并在键盘操作时清楚可见。
- Loading 保留原标签或提供等价的 `aria-label`，同时设置 `aria-busy`。
- Error 必须说明发生了什么以及用户下一步可以做什么。
- 容器型组件的 Hover、Pressed 和 Focus 由其拥有的操作控件或可交互行承载。

密度只改变控件高度、行高、内边距和间距，不缩小关键字号。桌面任务灯和宿主工具栏内的额度胶囊固定使用紧凑密度；额度胶囊的视觉高度由宿主槽位决定，不能反向缩小字体。
