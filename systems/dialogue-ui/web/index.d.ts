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
