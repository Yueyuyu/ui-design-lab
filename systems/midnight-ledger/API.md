# Midnight Ledger 组件 API

入口：`ui-design-lab/midnight-ledger`。必须导入同子路径下的 tokens.css 和 components.css，并使用 `data-ui-system="midnight-ledger"` 包装页面。完整参数类型见 [web/index.d.ts](web/index.d.ts)，运行示例见 [examples/consumer](../../examples/consumer)。

## 基础组件

| 组件 | 主要参数 | 事件与说明 |
|---|---|---|
| LedgerButton | children、variant、disabled、loading、error、icon | onClick 为 React 鼠标事件；loading 禁止重复提交 |
| LedgerIconButton | label、icon、disabled、loading | label 是必须提供的可访问名称 |
| LedgerField | label、value/defaultValue、hint、error | onChange(event)，通过 event.target.value 读取值 |
| LedgerSelect | label、options、value | options 为 {value,label}[]，onChange(event) |
| LedgerToggle | label、description、checked | onChange(boolean)，由业务方更新 checked |
| LedgerPanel | title、eyebrow、action、children | 使用容器承载自己的内容状态 |
| LedgerStatusBadge | children、tone、dot | tone 为 neutral/positive/negative/warning/info/option |
| LedgerDialog | open、onOpenChange、title、description、children、actions | 受控弹窗；Escape/背景/关闭按钮请求 onOpenChange(false) |
| LedgerNotification | title、description、tone、actionLabel | onAction、onDismiss；tone 为 info/success/warning/error |
| LedgerEmptyState | title、description、icon、actionLabel | onAction 提供下一步；error 表达失败与恢复 |
| LedgerTable | caption、columns、rows、state | onRowActivate(row)、onRetry；columns 的 render 接收 value 与 row 两个参数 |
| LedgerBarChart | title、data、unit、state | data 为 {label,value}[]；onRetry 用于错误恢复 |
| LedgerMetric | label、value、delta、tone | 指标使用符号与文字共同表达趋势 |
| LedgerLineChart | title、value、data、state | data 为 number[]，onRetry 错误恢复 |
| LedgerTerminalPreview | mode、onNotify | mode 为 overview/compact/cockpit；只展示示例 |

## 受控表单与弹窗

```jsx
const [open, setOpen] = useState(false);
const [name, setName] = useState("新项目");

<LedgerButton onClick={() => setOpen(true)}>编辑</LedgerButton>
<LedgerDialog
  open={open}
  onOpenChange={setOpen}
  title="编辑项目"
  actions={<LedgerButton onClick={() => setOpen(false)}>保存</LedgerButton>}
>
  <LedgerField label="项目名称" value={name} onChange={(event) => setName(event.target.value)} />
</LedgerDialog>
```

Dialog 使用 Portal 和原生模态层，保持套系作用域和触发位置密度。打开后聚焦关闭按钮；Tab/Shift+Tab 在可用控件间循环，背景不可交互且滚动锁定；关闭后恢复触发器焦点。loading/disabled 时表单与提交操作不可交互，关闭入口仍可用。title ID 每个实例独立。较长内容在弹窗内部滚动。

## 状态约定

通用七态为 default、hover、pressed、focus、disabled、loading、error。visualState 用于静态展示视觉状态；真实交互请传 disabled/loading/error，不能只把控件染成禁用样式。表格与图表通过 state 选择加载、错误和空数据状态；业务数据、保存与请求由消费项目管理。

loading、error 的实际含义以各组件类型和实现为准。例如 Field 的 error 是解释文本；Button 的 error 可以是布尔值。不要把所有组件强制套成相同事件签名。

## 边界

套系只提供 UI 和交互，不包含账号、数据存储、网络请求、订单执行或业务风控。第三方参考截图不随包授权，见 [NOTICE.md](../../NOTICE.md)。


## 业务组件（本地未发布扩展）

- shell：从套系入口导入。参数及事件以 web/index.d.ts 为准；业务组件展示页含可操作组合。
- data-table：从套系入口导入。参数及事件以 web/index.d.ts 为准；业务组件展示页含可操作组合。
- textarea：从套系入口导入。参数及事件以 web/index.d.ts 为准；业务组件展示页含可操作组合。
- checkbox：从套系入口导入。参数及事件以 web/index.d.ts 为准；业务组件展示页含可操作组合。
- radio-group：从套系入口导入。参数及事件以 web/index.d.ts 为准；业务组件展示页含可操作组合。
- combobox：从套系入口导入。参数及事件以 web/index.d.ts 为准；业务组件展示页含可操作组合。
- multi-select：从套系入口导入。参数及事件以 web/index.d.ts 为准；业务组件展示页含可操作组合。
- date-picker：从套系入口导入。参数及事件以 web/index.d.ts 为准；业务组件展示页含可操作组合。
- date-range：从套系入口导入。参数及事件以 web/index.d.ts 为准；业务组件展示页含可操作组合。
- tabs：从套系入口导入。参数及事件以 web/index.d.ts 为准；业务组件展示页含可操作组合。
- breadcrumb：从套系入口导入。参数及事件以 web/index.d.ts 为准；业务组件展示页含可操作组合。
- pagination：从套系入口导入。参数及事件以 web/index.d.ts 为准；业务组件展示页含可操作组合。
- dropdown-menu：从套系入口导入。参数及事件以 web/index.d.ts 为准；业务组件展示页含可操作组合。
- tooltip：从套系入口导入。参数及事件以 web/index.d.ts 为准；业务组件展示页含可操作组合。
- popover：从套系入口导入。参数及事件以 web/index.d.ts 为准；业务组件展示页含可操作组合。
- drawer：从套系入口导入。参数及事件以 web/index.d.ts 为准；业务组件展示页含可操作组合。
- progress：从套系入口导入。参数及事件以 web/index.d.ts 为准；业务组件展示页含可操作组合。
- skeleton：从套系入口导入。参数及事件以 web/index.d.ts 为准；业务组件展示页含可操作组合。
- toast-queue：从套系入口导入。参数及事件以 web/index.d.ts 为准；业务组件展示页含可操作组合。

DataTable 支持客户端筛选、排序、分页、跨页选择与列显隐，适合有限数据集；大规模远程数据由调用方请求与分页。危险操作由业务方通过 Dialog 二次确认。Combobox 使用搜索输入 + 原生 select，MultiSelect 使用原生 checkbox，保留系统键盘行为。DateRange 的 value 为日期字符串，不转换 UTC。ToastQueue 由调用方管理 id 与移除，不自动隐藏失败。

DataTable 列 render(value, row) 接收单元格值与整行；它与早期静态 Table 的行渲染约定分开。菜单、Popover 和 Tooltip 使用原生 popover 顶层；目标浏览器须支持 Popover API。
