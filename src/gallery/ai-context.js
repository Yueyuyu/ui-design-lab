const types = import.meta.glob("../../systems/*/web/index.d.ts",{eager:true,query:"?raw",import:"default"});
export function suiteApiContext(suite) {
 return [
 "套系："+suite.id+" / 版本 "+suite.version+" / "+suite.status,
 "可用组件："+suite.capabilities.components.join(", "),
 "能力边界："+(suite.selection?.limitations??[]).join("；"),
 "仓库路径：systems/"+suite.id+"；外部路径：node_modules/ui-design-lab/systems/"+suite.id,
 'import "ui-design-lab/'+suite.id+'/tokens.css";',
 'import "ui-design-lab/'+suite.id+'/components.css";',
 "使用根作用域 "+suite.scope+"；先读取 API.md / 类型，再编写代码。",
 "真实 API 声明：\n\u0060\u0060\u0060ts\n"+(types["../../systems/"+suite.id+"/web/index.d.ts"]??"该套系尚无公开类型")+"\n\u0060\u0060\u0060",
 "不要猜测接口，不跨套系导入。为新增页面复用 Shell / DataTable / Field / Drawer。"
 ].join("\n");
}
