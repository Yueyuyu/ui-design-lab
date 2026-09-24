# 组件状态

11 个组件的 default/hover/pressed/focus/disabled/loading/error 合同以 ../foundations/interaction-states.json 为准。静态状态标签和容器不伪造 hover/pressed；由所属操作表达。保存指示表示浏览器 localStorage 写入，不代表服务器。读取失败禁止用示例覆盖原值，写入失败保留内存、允许重试和导出。块删除提供单次撤销；草稿跨页面与视图保留，保存合并到同一记录集合，取消仅丢弃当前草稿。
