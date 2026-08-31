# Component States

所有可复用组件按固定顺序记录 default、hover、pressed、focus、disabled、loading、error。

- 容器没有直接 hover/pressed 时，由其所属操作或行表达状态，并在组件说明中明确。
- loading 保持原有占位，避免金额、按钮和表格列跳动。
- error 必须说明影响与恢复动作，不能只把边线变红。
