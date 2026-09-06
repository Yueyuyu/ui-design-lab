export const initialTasks = [
 {id:"t1",name:"季度客户洞察",status:"已完成",progress:100,usage:180,owner:"林简",date:"2026-09-01",result:"高频需求集中在批量导入与报表分享。建议优先完善接入文档。",history:["创建任务","整理资料","生成结果"]},
 {id:"t2",name:"内容目录检查",status:"失败",progress:42,usage:64,owner:"许清",date:"2026-09-02",result:"",history:["创建任务","资料格式检查失败"]},
 {id:"t3",name:"周度运营复盘",status:"等待",progress:0,usage:0,owner:"林简",date:"2026-09-03",result:"",history:["创建任务"]},
 {id:"t4",name:"产品反馈分类",status:"已完成",progress:100,usage:98,owner:"许清",date:"2026-09-03",result:"已整理 12 类反馈。演示结果可替换为业务产物。",history:["创建任务","分类完成"]},
 {id:"t5",name:"素材标签整理",status:"等待",progress:0,usage:0,owner:"陈远",date:"2026-09-04",result:"",history:["创建任务"]},
 {id:"t6",name:"新用户入门评估",status:"等待",progress:0,usage:0,owner:"陈远",date:"2026-09-05",result:"",history:["创建任务"]}
];
export const initialDocuments = [
 {id:"d1",name:"产品定位",folder:"产品研究",content:"面向独立开发者和小型 SaaS 团队，提供完整视觉语言与可运行的工作台流程。",versions:[{version:1,content:"面向独立开发者和小型 SaaS 团队，提供完整视觉语言与可运行的工作台流程。",date:"2026-09-01"}]},
 {id:"d2",name:"访谈问题",folder:"用户研究",content:"请使用自己的项目接入一套 UI，记录安装、字段与状态恢复时遇到的问题。",versions:[{version:1,content:"请使用自己的项目接入一套 UI，记录安装、字段与状态恢复时遇到的问题。",date:"2026-09-02"}]}
];
export function downloadText(name,content,type="text/plain") { const url=URL.createObjectURL(new Blob([content],{type}));const link=document.createElement("a");link.href=url;link.download=name;link.click();setTimeout(()=>URL.revokeObjectURL(url),1000); }
export function csv(rows,columns) { const cell=v=>'"'+String(v??"").replaceAll('"','""')+'"';return [columns.map(c=>cell(c.label)).join(","),...rows.map(row=>columns.map(c=>cell(row[c.key])).join(","))].join("\r\n"); }
