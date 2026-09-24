# Orchard UI · Apple 设计参考

采集日期：2026-09-18。套系为自主 Web 实现，非 Apple 官方组件库。

## 官方来源

- https://developer.apple.com/design/human-interface-guidelines/sidebars ：侧栏用于顶层内容导航；有限空间可使用更紧凑导航；图标颜色服务语义，支持隐藏/展开。已查看当前页面与界面示例。
- https://support.apple.com/zh-cn/guide/mac-help/mchlp1225/26/mac/26 ：当前 macOS Tahoe 26 外观设置的选项说明，包含强调色、侧栏图标大小等。
- https://support.apple.com/zh-cn/guide/mac-help/mchl52e1c2d2/mac ：已查看浅色/深色选项的官方示意图。

## 已观察的结构

官方侧栏示例用图标与短标签导航，主内容独立阅读。设置按具名选项调整，不依赖宣传卡片。参考截图保存在 references/orchard-ui-source.png，为 HIG 的公开侧栏图片浏览器截图，仅用于来源记录。

## 本项目适配

以分组设置、主从导航、克制蓝色、清晰标签和直接反馈形成首版 Web 语言。没有逐像素复刻 Apple 某个完整页面；示例没有使用官方照片、商标或 SF 字体资产。字号、尺寸、密度与 Token 是本项目的跨平台适配值。

首版仅浅色。设置页、控件和菜单为可操作实现；原生 OS 设置、Liquid Glass、系统通知权限和设备能力均不在交付范围。官网来源只用于研究，组件包不包含参考截图。
