# Clearline Console API

本地 v0.1.0，公开声明位于 web/index.d.ts。所有组件使用 Clear 前缀。

- button：可复用导出，行为与参数参考类型和业务组件展示。
- field：可复用导出，行为与参数参考类型和业务组件展示。
- select：可复用导出，行为与参数参考类型和业务组件展示。
- toggle：可复用导出，行为与参数参考类型和业务组件展示。
- panel：可复用导出，行为与参数参考类型和业务组件展示。
- badge：可复用导出，行为与参数参考类型和业务组件展示。
- bar-chart：可复用导出，行为与参数参考类型和业务组件展示。
- shell：可复用导出，行为与参数参考类型和业务组件展示。
- data-table：可复用导出，行为与参数参考类型和业务组件展示。
- textarea：可复用导出，行为与参数参考类型和业务组件展示。
- checkbox：可复用导出，行为与参数参考类型和业务组件展示。
- radio-group：可复用导出，行为与参数参考类型和业务组件展示。
- combobox：可复用导出，行为与参数参考类型和业务组件展示。
- multi-select：可复用导出，行为与参数参考类型和业务组件展示。
- date-picker：可复用导出，行为与参数参考类型和业务组件展示。
- date-range：可复用导出，行为与参数参考类型和业务组件展示。
- tabs：可复用导出，行为与参数参考类型和业务组件展示。
- breadcrumb：可复用导出，行为与参数参考类型和业务组件展示。
- pagination：可复用导出，行为与参数参考类型和业务组件展示。
- dropdown-menu：可复用导出，行为与参数参考类型和业务组件展示。
- tooltip：可复用导出，行为与参数参考类型和业务组件展示。
- popover：可复用导出，行为与参数参考类型和业务组件展示。
- drawer：可复用导出，行为与参数参考类型和业务组件展示。
- progress：可复用导出，行为与参数参考类型和业务组件展示。
- skeleton：可复用导出，行为与参数参考类型和业务组件展示。
- toast-queue：可复用导出，行为与参数参考类型和业务组件展示。

DataTable 为客户端分页；远程接口由调用方提供。日期为本地日历字符串。套系提供浅色与两档密度，不暗示支持深色。

DataTable 列 render(value, row) 接收单元格值与整行；它与早期静态 Table 的行渲染约定分开。菜单、Popover 和 Tooltip 使用原生 popover 顶层；目标浏览器须支持 Popover API。

## 组件文档与业务组合

组件目录位于 `#/systems/clearline-console/components`，每个公开 UI 导出都有独立详情、实际预览、七态和从 `web/index.d.ts` 提取的参数定义。整页示例归入页面组合，不计入基础/业务组件数量。

`ClearProjectTable` 接收 rows/selectedId/onSelect；`ClearProjectDetails` 接收 project/onStatusChange/onClose。工作台组合负责持有项目集合，详情状态回写同一记录。

## ClearSlider

受控数值滑块：label、value 必填；min/max/step 定义范围；unit 显示单位；onChange(value) 返回数值。支持 hint、error、loading、disabled，原生方向键和 Home/End 操作。保存由调用方负责。

## 工作台数据与保存

完整受控示例、初始数据与加载/失败/取消合同见 [INTEGRATION.md](INTEGRATION.md)。公开参数以 web/index.d.ts 为准。不传参数保留演示兼容性；传入受控集合但没有变更回调时只读。保存回调必须返回完整记录；取消只阻止界面接纳迟到结果，不保证撤销服务端写入。

ClearDataTable 可用 showToolbar=false 隐藏内置筛选/列设置、selectable=false 隐藏多选操作，交由上层流程持有这些交互；默认行为不变。
