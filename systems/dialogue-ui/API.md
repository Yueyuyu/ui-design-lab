# Dialogue UI API

## 范围与数据所有权

21 个组件与 1 个页面组合。DialogueMessage 呈现消息与复制/重试；DialogueComposer 管理输入与发送/停止事件；DialogueConversationList 支持搜索与选择；DialoguePromptSuggestions 以建议填充输入。基础控件可独立组合为设置、搜索或内容页面。

DialogueChatWorkspace 默认返回明确标注的本地示例，刷新后清空。onSend 返回 Promise<string>，messages 已包含本次用户消息；服务只需返回整条助手正文。失败后重试复用原用户消息。停止或切换会中止请求并忽略迟到返回，草稿保留；之后再次发送视为新消息。用户可在等待期间编辑下一条草稿，回复到达不会清空新草稿。

首版不提供 Markdown 引擎、流式协议、云历史与文件上传服务。独立 Composer 的 onFiles 仅返回 File[]，页面默认不显示附件按钮。浏览器剪贴板不可用时提供手动复制说明。

## 接入

以下 /api 路径为消费项目示例接口，本包不提供该服务。

```jsx
import {DialogueChatWorkspace} from 'ui-design-lab/dialogue-ui';
import 'ui-design-lab/dialogue-ui/tokens.css';
import 'ui-design-lab/dialogue-ui/components.css';

<section data-ui-system="dialogue-ui" data-density="comfortable">
<DialogueChatWorkspace
  onSend={async (prompt, {signal, conversationId, messages}) => {
    const response = await fetch('/api/chat', {
      method: 'POST', signal,
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({prompt, conversationId, messages}),
    });
    if (!response.ok) throw new Error('回复失败，请重试');
    const data = await response.json();
    return data.text;
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
export interface DialogueBoundary {disabled?:boolean;loading?:boolean;error?:string;}
export interface DialogueOption {value:string;label:string;disabled?:boolean;}
export interface DialogueButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {variant?:'primary'|'secondary'|'ghost'|'danger';loading?:boolean;error?:string;}
export function DialogueButton(props:DialogueButtonProps):React.JSX.Element;
export function DialogueIconButton(props:DialogueButtonProps & {icon:React.ElementType;label:string}):React.JSX.Element;
export function DialogueField(props:React.InputHTMLAttributes<HTMLInputElement> & DialogueBoundary & {label:string;hint?:string}):React.JSX.Element;
export function DialogueTextarea(props:React.TextareaHTMLAttributes<HTMLTextAreaElement> & DialogueBoundary & {label:string;hint?:string}):React.JSX.Element;
export function DialogueSelect(props:React.SelectHTMLAttributes<HTMLSelectElement> & DialogueBoundary & {label:string;hint?:string;options:DialogueOption[]}):React.JSX.Element;
export function DialogueToggle(props:DialogueBoundary & {label:string;checked:boolean;onChange?:(checked:boolean)=>void}):React.JSX.Element;
export function DialogueCheckbox(props:DialogueBoundary & {label:string;checked:boolean;onChange?:(checked:boolean)=>void}):React.JSX.Element;
export function DialogueSlider(props:DialogueBoundary & {label:string;value:number;onChange?:(value:number)=>void;min?:number;max?:number;step?:number;unit?:string;hint?:string}):React.JSX.Element;
export function DialogueSegmentedControl(props:{label?:string;options:DialogueOption[];value:string;onChange?:(value:string)=>void;disabled?:boolean}):React.JSX.Element;
export function DialogueTabs(props:{items:{id:string;label:React.ReactNode;content?:React.ReactNode;disabled?:boolean}[];value:string;onChange?:(value:string)=>void;disabled?:boolean}):React.JSX.Element;
export function DialogueBadge(props:{children?:React.ReactNode;tone?:'neutral'|'success'|'error'}):React.JSX.Element;
export function DialogueCard(props:{title?:string;description?:string;action?:React.ReactNode;children?:React.ReactNode}):React.JSX.Element;
export function DialogueDropdownMenu(props:{label?:string;items:{id:string;label:string;disabled?:boolean;onSelect?:()=>void}[];disabled?:boolean}):React.JSX.Element;
export function DialogueDialog(props:DialogueBoundary & {open:boolean;onOpenChange:(open:boolean)=>void;title:string;children?:React.ReactNode;footer?:React.ReactNode}):React.JSX.Element|null;
export function DialogueProgress(props:{label:string;value?:number;max?:number}):React.JSX.Element;
export function DialogueEmptyState(props:{title?:string;description?:string;actionLabel?:string;onAction?:()=>void}):React.JSX.Element;
export function DialogueNotification(props:{title:string;description?:string;tone?:'info'|'error';actionLabel?:string;onAction?:()=>void}):React.JSX.Element;
export interface DialogueChatMessage {id:string;role:'user'|'assistant';content:string;}
export interface DialogueConversation {id:string;title:string;messages:DialogueChatMessage[];}
export function DialogueMessage(props:{role?:'user'|'assistant';children?:React.ReactNode;loading?:boolean;error?:string;onRetry?:()=>void}):React.JSX.Element;
export function DialogueComposer(props:{value:string;onChange?:(value:string)=>void;onSend?:()=>void;onStop?:()=>void;loading?:boolean;disabled?:boolean;error?:string;placeholder?:string;onFiles?:(files:File[])=>void}):React.JSX.Element;
export function DialogueConversationList(props:{items:{id:string;title:string}[];value:string;onChange?:(value:string)=>void;onCreate?:()=>void}):React.JSX.Element;
export function DialoguePromptSuggestions(props:{items:{id:string;title:string;description:string;prompt:string}[];onSelect?:(prompt:string)=>void;disabled?:boolean}):React.JSX.Element;
export function DialogueChatWorkspace(props:{initialConversations?:DialogueConversation[];onSend?:(prompt:string,context:{signal:AbortSignal;conversationId:string;messages:DialogueChatMessage[]})=>Promise<string>}):React.JSX.Element;
```
