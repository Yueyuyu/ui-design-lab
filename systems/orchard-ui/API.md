# Orchard UI API

## 范围与数据所有权

20 个组件与 1 个页面组合。OrchardNavigationList 为分类导航；OrchardSettingRow 负责标签、说明、图标和控件排列；OrchardSettingsGroup 聚合多行设置。它们可用于任意业务，不限制为演示设置页。

OrchardSettingsWorkspace 默认仅在内存保存。onSave 返回 Promise<Partial<OrchardSettings> | void>；成功返回值与已提交草稿合并成为新基线。失败保留输入，取消恢复基线并触发 AbortSignal；即使适配器不响应中止，迟到结果也不会覆盖当前草稿。名称保存为偏好值；首选语言不翻译演示界面。真实认证、权限和持久化由消费项目实现。

## 接入

以下 /api 路径为消费项目示例接口，本包不提供该服务。

```jsx
import {OrchardSettingsWorkspace} from 'ui-design-lab/orchard-ui';
import 'ui-design-lab/orchard-ui/tokens.css';
import 'ui-design-lab/orchard-ui/components.css';

<section data-ui-system="orchard-ui" data-density="comfortable">
<OrchardSettingsWorkspace
  initialValues={{name: '团队空间', density: 'comfortable'}}
  onSave={async (values, {signal}) => {
    const response = await fetch('/api/preferences', {
      method: 'PUT', signal,
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(values),
    });
    if (!response.ok) throw new Error('保存失败，请重试');
    return response.json();
  }}
/>
</section>
```

## 通用约定

基础控件采用受控数据：Field/Textarea/Select 返回原生 change 事件；Toggle/Checkbox 返回 boolean；Slider 返回 number；Tabs/SegmentedControl 返回字符串 ID。按钮 variant 支持 primary、secondary、ghost、danger。

DropdownMenu 支持方向键、Home/End、Escape 与焦点恢复。Dialog 使用原生 modal；loading/disabled 禁用内容和 footer，关闭始终可用。只读容器不伪造 disabled/loading/error 参数，状态由拥有的控件或内容承接。逐项合同见 foundations/interaction-states.json。

所有组件只导入本套子路径；模式为 light，密度支持 comfortable/compact。首次传入的 initial 数据只用于初始化，业务切换可用 React key 重建页面。

## 完整类型接口

类型源以 web/index.d.ts 为准。页面组合不计入组件数。

```ts
import type * as React from 'react';
export interface OrchardBoundary {disabled?:boolean;loading?:boolean;error?:string;}
export interface OrchardOption {value:string;label:string;disabled?:boolean;}
export interface OrchardButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {variant?:'primary'|'secondary'|'ghost'|'danger';loading?:boolean;error?:string;}
export function OrchardButton(props:OrchardButtonProps):React.JSX.Element;
export function OrchardIconButton(props:OrchardButtonProps & {icon:React.ElementType;label:string}):React.JSX.Element;
export function OrchardField(props:React.InputHTMLAttributes<HTMLInputElement> & OrchardBoundary & {label:string;hint?:string}):React.JSX.Element;
export function OrchardTextarea(props:React.TextareaHTMLAttributes<HTMLTextAreaElement> & OrchardBoundary & {label:string;hint?:string}):React.JSX.Element;
export function OrchardSelect(props:React.SelectHTMLAttributes<HTMLSelectElement> & OrchardBoundary & {label:string;hint?:string;options:OrchardOption[]}):React.JSX.Element;
export function OrchardToggle(props:OrchardBoundary & {label:string;checked:boolean;onChange?:(checked:boolean)=>void}):React.JSX.Element;
export function OrchardCheckbox(props:OrchardBoundary & {label:string;checked:boolean;onChange?:(checked:boolean)=>void}):React.JSX.Element;
export function OrchardSlider(props:OrchardBoundary & {label:string;value:number;onChange?:(value:number)=>void;min?:number;max?:number;step?:number;unit?:string;hint?:string}):React.JSX.Element;
export function OrchardSegmentedControl(props:{label?:string;options:OrchardOption[];value:string;onChange?:(value:string)=>void;disabled?:boolean}):React.JSX.Element;
export function OrchardTabs(props:{items:{id:string;label:React.ReactNode;content?:React.ReactNode;disabled?:boolean}[];value:string;onChange?:(value:string)=>void;disabled?:boolean}):React.JSX.Element;
export function OrchardBadge(props:{children?:React.ReactNode;tone?:'neutral'|'success'|'error'}):React.JSX.Element;
export function OrchardCard(props:{title?:string;description?:string;action?:React.ReactNode;children?:React.ReactNode}):React.JSX.Element;
export function OrchardDropdownMenu(props:{label?:string;items:{id:string;label:string;disabled?:boolean;onSelect?:()=>void}[];disabled?:boolean}):React.JSX.Element;
export function OrchardDialog(props:OrchardBoundary & {open:boolean;onOpenChange:(open:boolean)=>void;title:string;children?:React.ReactNode;footer?:React.ReactNode}):React.JSX.Element|null;
export function OrchardProgress(props:{label:string;value?:number;max?:number}):React.JSX.Element;
export function OrchardEmptyState(props:{title?:string;description?:string;actionLabel?:string;onAction?:()=>void}):React.JSX.Element;
export function OrchardNotification(props:{title:string;description?:string;tone?:'info'|'error';actionLabel?:string;onAction?:()=>void}):React.JSX.Element;
export function OrchardNavigationList(props:{label?:string;items:{id:string;label:string;icon?:React.ElementType;description?:string}[];value:string;onChange?:(value:string)=>void}):React.JSX.Element;
export function OrchardSettingRow(props:{title:string;description?:string;icon?:React.ElementType;children?:React.ReactNode}):React.JSX.Element;
export function OrchardSettingsGroup(props:{title:string;description?:string;children?:React.ReactNode}):React.JSX.Element;
export interface OrchardSettings {name:string;density:'comfortable'|'compact';notifications:boolean;previews:boolean;scale:number;language:string;}
export function OrchardSettingsWorkspace(props:{initialValues?:Partial<OrchardSettings>;onSave?:(values:OrchardSettings,context:{signal:AbortSignal})=>Promise<Partial<OrchardSettings>|void>}):React.JSX.Element;
```
