const ensure=(value,message)=>{if(!value)throw Error(message);};
export async function settingsFlow({p,goto,id}){
 await goto("/#systems/"+id+"/playground");
 await p.getByRole("heading",{name:"交互试验场",exact:true}).waitFor({state:"visible"});
 const input=p.getByRole("textbox",{name:/工作区名称/});
 await input.fill("验收设置 "+id);
 await p.getByRole("combobox",{name:"场景状态",exact:true}).selectOption("error");
 await p.getByRole("button",{name:"保存设置",exact:true}).click();
 await p.getByRole("button",{name:"重试保存",exact:true}).waitFor({state:"visible"});
 ensure(await p.evaluate(()=>document.querySelector(".settings-playground input")?.value)==="验收设置 "+id,"保存失败丢失输入");
 await p.getByRole("button",{name:"重试保存",exact:true}).click();
 await p.getByText("已保存到本机",{exact:true}).waitFor({state:"visible"});
 await input.fill("应取消");await p.getByRole("button",{name:"取消",exact:true}).click();
 ensure(await p.evaluate(()=>document.querySelector(".settings-playground input")?.value)==="验收设置 "+id,"取消没有恢复");
}
export async function taskFlow({p,goto,id}){
 await goto("/#systems/"+id+"/workflows");
 await p.getByRole("searchbox",{name:"筛选任务列表",exact:true}).fill("内容目录");
 ensure(await p.getByRole("button",{name:"查看 季度客户洞察",exact:true}).count()===0,"筛选未缩小数据");
 await p.getByRole("button",{name:"查看 内容目录检查",exact:true}).click();
 await p.getByRole("dialog",{name:"内容目录检查",exact:true}).waitFor({state:"visible"});
 await p.getByRole("button",{name:"重试任务",exact:true}).click();
 await p.getByRole("heading",{name:"任务结果",exact:true}).waitFor({state:"visible"});
 await p.getByRole("button",{name:"关闭详情",exact:true}).click();
 await p.getByRole("searchbox",{name:"筛选任务列表",exact:true}).press("ControlOrMeta+A");
 await p.getByRole("searchbox",{name:"筛选任务列表",exact:true}).press("Backspace");
 await p.getByText("匹配 6 条；已选择 0 条（跨页保留）",{exact:true}).waitFor({state:"visible"});
 await p.getByRole("checkbox",{name:"选择本页全部",exact:true}).check();
 await p.getByRole("button",{name:"下一页",exact:true}).click();
 ensure((await p.getByRole("button",{name:"批量处理（5）",exact:true}).count())===1,"跨页选择丢失");
 await p.getByRole("button",{name:"清除选择",exact:true}).click();
 await p.getByRole("button",{name:"用量统计",exact:true}).click();
 ensure((await p.getByRole("heading",{name:/本会话累计用量/}).textContent()).includes("362"),"重试用量未一致累加");
}
export async function overlayFlow({p,goto,id}){
 await goto("/#systems/"+id+"/components-plus");
 await p.getByRole("tab",{name:"菜单、详情与通知",exact:true}).click();
 await p.getByRole("button",{name:"更多操作",exact:true}).click();
 await p.getByRole("menuitem",{name:"编辑详情",exact:true}).click();
 await p.getByRole("dialog",{name:"项目详情",exact:true}).waitFor({state:"visible"});
 await p.getByRole("button",{name:"关闭详情",exact:true}).press("Escape");
 ensure(await p.getByRole("dialog").count()===0,"Escape未关闭抽屉");
 ensure(await p.evaluate(()=>document.activeElement?.textContent.trim()==="更多操作"),"焦点没有恢复菜单触发器");
 await p.getByRole("button",{name:"新增通知",exact:true}).click();
 await p.getByRole("button",{name:"新增通知",exact:true}).click();
 ensure(await p.getByRole("button",{name:"关闭通知：新增一条可关闭的反馈",exact:true}).count()===2,"Toast被覆盖");
}
export async function themeFlow({p,goto,id}){
 await goto("/#systems/"+id+"/theme");
 await p.getByRole("button",{name:"显示配置",exact:true}).click();
 const input=p.getByRole("textbox",{name:"主题 JSON",exact:true});
 const original=JSON.parse(await p.evaluate(()=>document.querySelector("textarea[aria-label=\"主题 JSON\"]").value));
 const next={...original,density:"compact",values:{...original.values}};const brand=Object.keys(next.values).find(k=>k.endsWith("-brand"));next.values[brand]="#224488";
 await input.fill(JSON.stringify(next));await p.getByRole("button",{name:"导入 JSON",exact:true}).click();
 await p.getByRole("button",{name:"显示配置",exact:true}).click();
 ensure(JSON.parse(await p.evaluate(()=>document.querySelector("textarea[aria-label=\"主题 JSON\"]").value)).values[brand]==="#224488","主题往返不一致");
 await p.getByRole("button",{name:"保存主题",exact:true}).click();
 await p.getByRole("button",{name:"恢复默认",exact:true}).click();
 await p.getByRole("button",{name:"恢复保存",exact:true}).click();
 await p.getByRole("button",{name:"显示配置",exact:true}).click();
 ensure(JSON.parse(await p.evaluate(()=>document.querySelector("textarea[aria-label=\"主题 JSON\"]").value)).density==="compact","主题本地恢复丢失密度");
 await input.fill('{"bad":true}');await p.getByRole("button",{name:"导入 JSON",exact:true}).click();
 ensure((await p.getByRole("status").allTextContents({})).some(t=>t.includes("不匹配")),"非法主题未提示");
}
