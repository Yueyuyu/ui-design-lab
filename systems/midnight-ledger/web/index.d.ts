import type { ReactNode, ComponentPropsWithoutRef, JSX } from "react";
import type { Icon } from "@phosphor-icons/react";

export type InteractionState = "default" | "hover" | "pressed" | "focus" | "disabled" | "loading" | "error";
export type DataState = InteractionState | "empty";
export interface StateProps { visualState?: InteractionState; loading?: boolean; error?: boolean | string; disabled?: boolean; }
export interface ButtonProps extends Omit<ComponentPropsWithoutRef<"button">, "size">, StateProps {
  variant?: "primary" | "secondary" | "ghost" | "danger"; icon?: Icon; trailingIcon?: Icon;
}
export interface IconButtonProps extends ComponentPropsWithoutRef<"button">, StateProps { label: string; icon: Icon; }
export interface FieldProps extends ComponentPropsWithoutRef<"input">, Omit<StateProps, "error"> { label: string; hint?: string; error?: string; }
export interface SelectProps extends ComponentPropsWithoutRef<"select">, Omit<StateProps, "error"> { label: string; options: Array<{value: string; label: string}>; hint?: string; error?: string; }
export interface ToggleProps extends StateProps { checked: boolean; onChange?: (checked: boolean) => void; label: string; description?: string; }
export interface DialogProps extends StateProps { open: boolean; onOpenChange: (open: boolean) => void; title: string; description?: string; children?: ReactNode; actions?: ReactNode; }
export interface PanelProps extends Omit<ComponentPropsWithoutRef<"section">, "title">, StateProps { title?: ReactNode; eyebrow?: string; action?: ReactNode; tone?: "default" | "ledger"; }
export interface NotificationProps extends StateProps { tone?: "info" | "success" | "warning" | "error"; title: string; description?: string; actionLabel?: string; onAction?: () => void; onDismiss?: () => void; }
export interface EmptyProps extends StateProps { icon?: Icon; title?: string; description?: string; actionLabel?: string; onAction?: () => void; }
export interface Row { id?: string | number; disabled?: boolean; state?: InteractionState; }
export interface Column<T> { key: Extract<keyof T, string>; label: string; align?: "start" | "end"; render?: (value: T[keyof T], row: T) => ReactNode; }
export interface TableProps<T extends Row> { caption?: string; columns: Column<T>[]; rows: T[]; state?: DataState; onRetry?: () => void; onRowActivate?: (row: T) => void;  }
export interface BarChartProps { title?: string; description?:string; period?:string; source?:string; updatedAt?:string; data: Array<{label: string; value: number}>; unit?: string; state?: InteractionState; onRetry?: () => void; }

export declare function LedgerButton(props: ButtonProps): JSX.Element;
export declare function LedgerIconButton(props: IconButtonProps): JSX.Element;
export declare function LedgerField(props: FieldProps): JSX.Element;
export declare function LedgerSelect(props: SelectProps): JSX.Element;
export declare function LedgerToggle(props: ToggleProps): JSX.Element;
export declare function LedgerDialog(props: DialogProps): JSX.Element;
export declare function LedgerPanel(props: PanelProps): JSX.Element;
export declare function LedgerNotification(props: NotificationProps): JSX.Element;
export declare function LedgerEmptyState(props: EmptyProps): JSX.Element;
export declare function LedgerTable<T extends Row>(props: TableProps<T>): JSX.Element;
export declare function LedgerBarChart(props: Omit<BarChartProps, "data"> & { data?: BarChartProps["data"]; values?: number[] }): JSX.Element;

export declare function LedgerStatusBadge(props: StateProps & {children?: ReactNode; tone?: "neutral" | "positive" | "negative" | "warning" | "info" | "option"; dot?: boolean}): JSX.Element;
export declare function LedgerMetric(props: StateProps & {label: string; value: ReactNode; delta?: string; tone?: "neutral" | "positive" | "negative"; className?: string}): JSX.Element;
export declare function LedgerLineChart(props: {title?: string; value?: string; data?: number[]; labels?:string[]; unit?:string; description?:string; period?:string; source?:string; updatedAt?:string; state?: InteractionState | "empty"; onRetry?: () => void}): JSX.Element;
export declare function LedgerTerminalPreview(props: {mode?: "overview" | "compact" | "cockpit"; onNotify?: (message: string) => void}): JSX.Element;
export declare const ledgerInteractionStates: InteractionState[];


export interface Choice { value: string; label: string; disabled?: boolean; }
export interface SearchSelectProps extends StateProps {label: string; options: Choice[]; value: string; onChange?: (value: string) => void;}
export declare function LedgerTextarea(props: ComponentPropsWithoutRef<"textarea"> & StateProps & {label: string; hint?: string}): JSX.Element;
export declare function LedgerCheckbox(props: StateProps & {label: string; checked: boolean; onChange?: (value: boolean) => void; hint?: string}): JSX.Element;
export declare function LedgerRadioGroup(props: SearchSelectProps): JSX.Element;
export declare function LedgerCombobox(props: SearchSelectProps): JSX.Element;
export declare function LedgerMultiSelect(props: Omit<SearchSelectProps,"value"|"onChange"> & {value: string[]; onChange?: (value: string[])=>void}): JSX.Element;
export interface DatePickerProps extends StateProps {label: string; value?: string; onChange?: (value: string)=>void; min?: string; max?: string;}
export declare function LedgerDatePicker(props: DatePickerProps): JSX.Element;
export interface DateRangeValue {start: string; end: string;}
export declare function LedgerDateRange(props: Omit<DatePickerProps,"value"|"onChange"> & {value: DateRangeValue; onChange?: (value:DateRangeValue)=>void}): JSX.Element;
export declare function LedgerShell(props: {brand: ReactNode; navigation:Array<{id:string;label:string}>; activeId:string; onNavigate?:(id:string)=>void; title:ReactNode; actions?:ReactNode; children?:ReactNode}): JSX.Element;
export declare function LedgerTabs(props: {items:Array<{id:string;label:string;content?:ReactNode;disabled?:boolean}>; value:string; onChange?:(id:string)=>void; label?:string; disabled?:boolean}): JSX.Element;
export declare function LedgerBreadcrumb(props:{items:Array<{label:string;href?:string;onClick?:()=>void}>;label?:string}):JSX.Element;
export declare function LedgerPagination(props:{page:number;pageCount:number;onChange?:(page:number)=>void;disabled?:boolean}):JSX.Element;
export declare function LedgerDataTable<T extends Row>(props: {rows:T[];columns:Array<Column<T>&{sortable?:boolean}>;caption?:string;pageSize?:number;selection?:T["id"][];onSelectionChange?:(ids:T["id"][])=>void;onBulkAction?:(ids:T["id"][])=>void;onRowActivate?:(row:T)=>void;loading?:boolean;disabled?:boolean;error?:string;onRetry?:()=>void}):JSX.Element;
export declare function LedgerDrawer(props:DialogProps):JSX.Element;
export declare function LedgerDropdownMenu(props:{label?:string;items:Array<{id:string;label:string;disabled?:boolean;danger?:boolean;onSelect?:()=>void}>;disabled?:boolean}):JSX.Element;
export declare function LedgerPopover(props:{label:string;children?:ReactNode;disabled?:boolean}):JSX.Element;
export declare function LedgerTooltip(props:{label:string;children?:ReactNode}):JSX.Element;
export declare function LedgerProgress(props:{label:string;value?:number;max?:number}):JSX.Element;
export declare function LedgerSkeleton(props:{label?:string;rows?:number}):JSX.Element;
export declare function LedgerToastQueue(props:{items:Array<{id:string;message:string;tone?:string;onRetry?:()=>void}>;onDismiss?:(id:string)=>void}):JSX.Element;


export declare function ledgerFormat(value:number,options?:{kind?:"number"|"money"|"percent";currency?:string;digits?:number;sign?:boolean;locale?:string}):string;
