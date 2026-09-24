import type { ButtonHTMLAttributes, ForwardRefExoticComponent, RefAttributes, ReactNode } from 'react';
export declare const suiteId: 'folio-workspace';
export type FolioBlockType = 'paragraph' | 'heading' | 'todo' | 'toggle';
export type FolioRecordStatus = '未开始' | '进行中' | '已完成';
export type FolioView = 'table' | 'board' | 'list';
export interface FolioBlock { id:string; type:FolioBlockType; text:string; checked?:boolean; open?:boolean; detail?:string; }
export interface FolioRecord { id:string; title:string; status:FolioRecordStatus; category:string; note:string; }
export interface FolioViewConfig { query:string; status:'全部' | FolioRecordStatus; sort:'manual' | 'title'; }
export interface FolioPage { id:string; title:string; parentId:string | null; icon?:string; blocks:FolioBlock[]; records:FolioRecord[]; drafts:Record<string,FolioRecord>; view:FolioView; views:Record<FolioView,FolioViewConfig>; }
export interface FolioDocument { version:1; activePage:string; pages:FolioPage[]; }
export declare const FolioButton:ForwardRefExoticComponent<ButtonHTMLAttributes<HTMLButtonElement> & {tone?:'quiet'|'solid'|'danger';loading?:boolean} & RefAttributes<HTMLButtonElement>>;
export declare function FolioStatus(props:{value:string}):ReactNode;
export declare function FolioCallout(props:{children:ReactNode;tone?:'note'|'error';action?:ReactNode}):ReactNode;
export declare function FolioPageHeader(props:{title:string;onChange:(title:string)=>void;disabled?:boolean}):ReactNode;
export declare function FolioPageTree(props:{pages:FolioPage[];activeId:string;onSelect:(id:string)=>void;onCreate:(parentId:string|null)=>void;disabled?:boolean}):ReactNode;
export declare function FolioBreadcrumbs(props:{pages:FolioPage[];activeId:string;onSelect:(id:string)=>void}):ReactNode;
export declare function FolioBlockEditor(props:{blocks:FolioBlock[];onChange:(blocks:FolioBlock[])=>void;disabled?:boolean}):ReactNode;
export declare function FolioViewTabs(props:{value:FolioView;onChange:(view:FolioView)=>void;panelId:string}):ReactNode;
export declare function FolioDatabase(props:{records:FolioRecord[];view:FolioView;config:FolioViewConfig;onViewChange:(view:FolioView)=>void;onConfigChange:(patch:Partial<FolioViewConfig>)=>void;onOpen:(id:string,trigger:HTMLButtonElement)=>void;onCreate:(trigger:HTMLButtonElement)=>void;disabled?:boolean;activeId?:string|null;draftIds?:string[]}):ReactNode;
export declare function FolioRecordDetail(props:{record:FolioRecord;onChange:(record:FolioRecord)=>void;onSave:(record:FolioRecord)=>void;onCancel:()=>void;onClose:()=>void;disabled?:boolean;autoFocus?:boolean}):ReactNode;
export declare function FolioWorkspace(props:{storageKey?:string|null}):ReactNode;
export declare function createFolioDocument():FolioDocument;
export declare function createFolioPage(title?:string,parentId?:string|null):FolioPage;
export declare function validateFolioDocument(value:unknown):FolioDocument;
export declare function filterFolioRecords(records:FolioRecord[],config:FolioViewConfig):FolioRecord[];
