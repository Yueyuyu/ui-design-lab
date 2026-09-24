# 可访问性

控件使用原生 button/input/textarea/select；所有字段有名称。页面树使用嵌套列表与按钮，不伪装未实现方向键行为的 ARIA tree。视图页签支持左右键、Home/End 与单一 Tab 停靠。块菜单支持方向键、Home/End、Escape，关闭恢复焦点；输入法 isComposing 或 keyCode 229 不触发斜杠。侧开详情是 aside，不设 aria-modal，不锁定背景；打开聚焦标题，关闭恢复触发点，Escape 保留草稿。最小辅助字 11px，中性文字对比达 4.5:1；错误同时有文字。窄屏内容顺排，表格仅在自身容器横向滚动。
