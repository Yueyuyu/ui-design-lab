import type * as React from 'react';
export type OrchardSymbolName = 'folder'|'document'|'notes'|'image'|'camera'|'music'|'microphone'|'heart'|'mail'|'chat'|'people'|'bell'|'home'|'settings'|'search'|'shield'|'calendar'|'timer'|'check'|'star'|'globe'|'cloud'|'download'|'moon';
export type OrchardIconTone = 'blue'|'rose'|'amber'|'green'|'violet'|'slate';
export const orchardSymbols:readonly {id:OrchardSymbolName;label:string;category:string;icon:React.ElementType}[];
export function OrchardSymbol(props:{name:OrchardSymbolName;size?:number;weight?:'thin'|'light'|'regular'|'bold'|'fill'|'duotone';label?:string}):React.JSX.Element;
export function OrchardAppIcon(props:{symbol?:OrchardSymbolName;src?:string;label?:string;size?:number;tone?:OrchardIconTone;badge?:string}):React.JSX.Element;
export function OrchardIconPicker(props:OrchardBoundary & {value?:OrchardSymbolName;onChange?:(name:OrchardSymbolName)=>void;label?:string}):React.JSX.Element;
export interface OrchardAppItem {id:string;name:string;symbol?:OrchardSymbolName;src?:string;tone?:OrchardIconTone;description?:string;badge?:string;disabled?:boolean;}
export function OrchardAppLauncher(props:OrchardBoundary & {items?:OrchardAppItem[];onLaunch?:(item:OrchardAppItem)=>void;label?:string}):React.JSX.Element;
export interface OrchardCommandItem {id:string;label:string;symbol?:OrchardSymbolName;description?:string;shortcut?:string;disabled?:boolean;}
export function OrchardCommandMenu(props:OrchardBoundary & {items?:OrchardCommandItem[];onSelect?:(item:OrchardCommandItem)=>void;label?:string}):React.JSX.Element;
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
