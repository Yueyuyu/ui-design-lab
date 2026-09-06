import type {ReactNode,ComponentPropsWithoutRef,JSX} from "react";
import type {Icon} from "@phosphor-icons/react";
export type InteractionState = "default"|"hover"|"pressed"|"focus"|"disabled"|"loading"|"error";
export interface StateProps {disabled?:boolean;loading?:boolean;error?:string|boolean;}
export interface Row {id:string|number;disabled?:boolean;}
export interface Column<T> {key:Extract<keyof T,string>;label:string;render?:(row:T)=>ReactNode;}
export interface DialogProps extends StateProps {open:boolean;onOpenChange:(open:boolean)=>void;title:string;children?:ReactNode;actions?:ReactNode;}
export declare function ClearButton(props:ComponentPropsWithoutRef<"button">&StateProps&{variant?:"primary"|"secondary"|"ghost"|"danger";icon?:Icon}):JSX.Element;
export declare function ClearField(props:ComponentPropsWithoutRef<"input">&StateProps&{label:string;hint?:string}):JSX.Element;
export declare function ClearSelect(props:ComponentPropsWithoutRef<"select">&StateProps&{label:string;hint?:string;options:Array<{label:string;value:string;disabled?:boolean}>}):JSX.Element;
export declare function ClearToggle(props:StateProps&{label:string;description?:string;checked:boolean;onChange?:(value:boolean)=>void}):JSX.Element;
export declare function ClearPanel(props:{title?:ReactNode;eyebrow?:string;action?:ReactNode;children?:ReactNode}):JSX.Element;
export declare function ClearBadge(props:{children?:ReactNode}):JSX.Element;
export declare function ClearBarChart(props:{title?:string;description?:string;period?:string;source?:string;updatedAt?:string;data?:Array<{label:string;value:number}>;unit?:string;state?:InteractionState|"empty";disabled?:boolean;onRetry?:()=>void}):JSX.Element;

export interface Choice { value: string; label: string; disabled?: boolean; }
export interface SearchSelectProps extends StateProps {label: string; options: Choice[]; value: string; onChange?: (value: string) => void;}
export declare function ClearTextarea(props: ComponentPropsWithoutRef<"textarea"> & StateProps & {label: string; hint?: string}): JSX.Element;
export declare function ClearCheckbox(props: StateProps & {label: string; checked: boolean; onChange?: (value: boolean) => void; hint?: string}): JSX.Element;
export declare function ClearRadioGroup(props: SearchSelectProps): JSX.Element;
export declare function ClearCombobox(props: SearchSelectProps): JSX.Element;
export declare function ClearMultiSelect(props: Omit<SearchSelectProps,"value"|"onChange"> & {value: string[]; onChange?: (value: string[])=>void}): JSX.Element;
export interface DatePickerProps extends StateProps {label: string; value?: string; onChange?: (value: string)=>void; min?: string; max?: string;}
export declare function ClearDatePicker(props: DatePickerProps): JSX.Element;
export interface DateRangeValue {start: string; end: string;}
export declare function ClearDateRange(props: Omit<DatePickerProps,"value"|"onChange"> & {value: DateRangeValue; onChange?: (value:DateRangeValue)=>void}): JSX.Element;
export declare function ClearShell(props: {brand: ReactNode; navigation:Array<{id:string;label:string;icon?:ReactNode}>; activeId:string; onNavigate?:(id:string)=>void; title:ReactNode; actions?:ReactNode; children?:ReactNode}): JSX.Element;
export declare function ClearTabs(props: {items:Array<{id:string;label:string;content?:ReactNode;disabled?:boolean}>; value:string; onChange?:(id:string)=>void; label?:string; disabled?:boolean}): JSX.Element;
export declare function ClearBreadcrumb(props:{items:Array<{label:string;href?:string;onClick?:()=>void}>;label?:string}):JSX.Element;
export declare function ClearPagination(props:{page:number;pageCount:number;onChange?:(page:number)=>void;disabled?:boolean}):JSX.Element;
export declare function ClearDataTable<T extends Row>(props: {rows:T[];columns:Array<Omit<Column<T>,"render">&{sortable?:boolean;render?:(value:T[keyof T],row:T)=>ReactNode}>;caption?:string;pageSize?:number;selection?:T["id"][];onSelectionChange?:(ids:T["id"][])=>void;onBulkAction?:(ids:T["id"][])=>void;onRowActivate?:(row:T)=>void;loading?:boolean;disabled?:boolean;error?:string;onRetry?:()=>void}):JSX.Element;
export declare function ClearDrawer(props:DialogProps):JSX.Element;
export declare function ClearDropdownMenu(props:{label?:string;items:Array<{id:string;label:string;disabled?:boolean;danger?:boolean;onSelect?:()=>void}>;disabled?:boolean}):JSX.Element;
export declare function ClearPopover(props:{label:string;children?:ReactNode;disabled?:boolean}):JSX.Element;
export declare function ClearTooltip(props:{label:string;children?:ReactNode}):JSX.Element;
export declare function ClearProgress(props:{label:string;value?:number;max?:number}):JSX.Element;
export declare function ClearSkeleton(props:{label?:string;rows?:number}):JSX.Element;
export declare function ClearToastQueue(props:{items:Array<{id:string;message:string;tone?:string;onRetry?:()=>void}>;onDismiss?:(id:string)=>void}):JSX.Element;
export declare function ClearProjectWorkspace():JSX.Element;
