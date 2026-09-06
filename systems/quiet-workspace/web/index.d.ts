import type { ReactNode, ComponentPropsWithoutRef, JSX } from "react";
import type { Icon } from "@phosphor-icons/react";

export type InteractionState = "default" | "hover" | "pressed" | "focus" | "disabled" | "loading" | "error";
export type DataState = InteractionState | "empty";
export interface StateProps { visualState?: InteractionState; loading?: boolean; error?: boolean | string; disabled?: boolean; }
export interface ButtonProps extends Omit<ComponentPropsWithoutRef<"button">, "size">, StateProps {
  variant?: "primary" | "secondary" | "ghost"; icon?: Icon; trailingIcon?: Icon; size?: "small" | "medium";
}
export interface IconButtonProps extends ComponentPropsWithoutRef<"button">, StateProps { label: string; icon: Icon; }
export interface FieldProps extends ComponentPropsWithoutRef<"input">, Omit<StateProps, "error"> { label: string; hint?: string; error?: string; }
export interface SelectProps extends ComponentPropsWithoutRef<"select">, Omit<StateProps, "error"> { label: string; options: Array<{value: string; label: string}>; hint?: string; error?: string; }
export interface ToggleProps extends StateProps { checked: boolean; onChange?: (checked: boolean) => void; label: string; description?: string; }
export interface DialogProps extends StateProps { open: boolean; onOpenChange: (open: boolean) => void; title: string; description?: string; children?: ReactNode; actions?: ReactNode; }
export interface PanelProps { title?: ReactNode; eyebrow?: string; action?: ReactNode; children?: ReactNode; className?: string; state?: DataState; }
export interface NotificationProps extends StateProps { tone?: "info" | "success" | "warning" | "error"; title: string; description?: string; actionLabel?: string; onAction?: () => void; onDismiss?: () => void; }
export interface EmptyProps extends StateProps { icon?: Icon; title?: string; description?: string; actionLabel?: string; onAction?: () => void; }
export interface Row { id: string | number; disabled?: boolean; visualState?: InteractionState; }
export interface Column<T> { key: Extract<keyof T, string>; label: string; align?: "start" | "end"; render?: (row: T) => ReactNode; }
export interface TableProps<T extends Row> { caption?: string; columns: Column<T>[]; rows: T[]; state?: DataState; onRetry?: () => void; onRowActivate?: (row: T) => void; error?: string; empty?: string; }
export interface BarChartProps { title?: string; description?: string; period?:string; source?:string; updatedAt?:string; data: Array<{label: string; value: number}>; unit?: string; state?: DataState; disabled?: boolean; onRetry?: () => void; }

export declare function QuietButton(props: ButtonProps): JSX.Element;
export declare function QuietIconButton(props: IconButtonProps): JSX.Element;
export declare function QuietField(props: FieldProps): JSX.Element;
export declare function QuietSelect(props: SelectProps): JSX.Element;
export declare function QuietToggle(props: ToggleProps): JSX.Element;
export declare function QuietDialog(props: DialogProps): JSX.Element;
export declare function QuietCard(props: PanelProps): JSX.Element;
export declare function QuietNotification(props: NotificationProps): JSX.Element;
export declare function QuietEmptyState(props: EmptyProps): JSX.Element;
export declare function QuietTable<T extends Row>(props: TableProps<T>): JSX.Element;
export declare function QuietBarChart(props: BarChartProps): JSX.Element;

export declare function QuietStatusChip(props: {children?: ReactNode; tone?: "neutral" | "running" | "attention" | "success" | "offline"; dot?: boolean; state?: InteractionState}): JSX.Element;
export declare function QuietQuotaPill(props: StateProps & { remainingPercent?: number | null; resetText?: string; title?: string; defaultOpen?: boolean; panelAlign?: "start" | "center" | "end"; onRefresh?: () => void; onExit?: () => void }): JSX.Element;
export interface Task { id: string; title: string; detail: string; state: "attention" | "running" | "success" | "offline"; time: string; }
export declare function QuietTaskLight(props: Omit<StateProps, "visualState"> & { tasks?: Task[]; title?: string; defaultOpen?: boolean; onTaskActivate?:(task:Task)=>void; onRetry?: () => void }): JSX.Element;
export declare function QuietWorkspacePreview(): JSX.Element;
export declare const quietInteractionStates: InteractionState[];

export interface Choice { value: string; label: string; disabled?: boolean; }
export interface SearchSelectProps extends StateProps {label: string; options: Choice[]; value: string; onChange?: (value: string) => void;}
export declare function QuietTextarea(props: ComponentPropsWithoutRef<"textarea"> & StateProps & {label: string; hint?: string}): JSX.Element;
export declare function QuietCheckbox(props: StateProps & {label: string; checked: boolean; onChange?: (value: boolean) => void; hint?: string}): JSX.Element;
export declare function QuietRadioGroup(props: SearchSelectProps): JSX.Element;
export declare function QuietCombobox(props: SearchSelectProps): JSX.Element;
export declare function QuietMultiSelect(props: Omit<SearchSelectProps,"value"|"onChange"> & {value: string[]; onChange?: (value: string[])=>void}): JSX.Element;
export interface DatePickerProps extends StateProps {label: string; value?: string; onChange?: (value: string)=>void; min?: string; max?: string;}
export declare function QuietDatePicker(props: DatePickerProps): JSX.Element;
export interface DateRangeValue {start: string; end: string;}
export declare function QuietDateRange(props: Omit<DatePickerProps,"value"|"onChange"> & {value: DateRangeValue; onChange?: (value:DateRangeValue)=>void}): JSX.Element;
export declare function QuietShell(props: {brand: ReactNode; navigation:Array<{id:string;label:string}>; activeId:string; onNavigate?:(id:string)=>void; title:ReactNode; actions?:ReactNode; children?:ReactNode}): JSX.Element;
export declare function QuietTabs(props: {items:Array<{id:string;label:string;content?:ReactNode;disabled?:boolean}>; value:string; onChange?:(id:string)=>void; label?:string; disabled?:boolean}): JSX.Element;
export declare function QuietBreadcrumb(props:{items:Array<{label:string;href?:string;onClick?:()=>void}>;label?:string}):JSX.Element;
export declare function QuietPagination(props:{page:number;pageCount:number;onChange?:(page:number)=>void;disabled?:boolean}):JSX.Element;
export declare function QuietDataTable<T extends Row>(props: {rows:T[];columns:Array<Omit<Column<T>,"render">&{sortable?:boolean;render?:(value:T[keyof T],row:T)=>ReactNode}>;caption?:string;pageSize?:number;selection?:T["id"][];onSelectionChange?:(ids:T["id"][])=>void;onBulkAction?:(ids:T["id"][])=>void;onRowActivate?:(row:T)=>void;loading?:boolean;disabled?:boolean;error?:string;onRetry?:()=>void}):JSX.Element;
export declare function QuietDrawer(props:DialogProps):JSX.Element;
export declare function QuietDropdownMenu(props:{label?:string;items:Array<{id:string;label:string;disabled?:boolean;danger?:boolean;onSelect?:()=>void}>;disabled?:boolean}):JSX.Element;
export declare function QuietPopover(props:{label:string;children?:ReactNode;disabled?:boolean}):JSX.Element;
export declare function QuietTooltip(props:{label:string;children?:ReactNode}):JSX.Element;
export declare function QuietProgress(props:{label:string;value?:number;max?:number}):JSX.Element;
export declare function QuietSkeleton(props:{label?:string;rows?:number}):JSX.Element;
export declare function QuietToastQueue(props:{items:Array<{id:string;message:string;tone?:string;onRetry?:()=>void}>;onDismiss?:(id:string)=>void}):JSX.Element;


export declare function QuietFileUpload(props: {upload:(file:File, context:{signal:AbortSignal;onProgress:(value:number)=>void})=>Promise<unknown>;accept?:string;multiple?:boolean;maxBytes?:number;disabled?:boolean;onComplete?:(result:unknown,file:File)=>void}):JSX.Element;
export interface TreeNode {id:string;label:string;children?:TreeNode[];}
export declare function QuietTree(props:{nodes:TreeNode[];value?:string;onChange?:(id:string)=>void;label?:string;disabled?:boolean}):JSX.Element;
