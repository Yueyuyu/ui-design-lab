import { buildDesignContext } from './design-context.js';

const types = import.meta.glob("../../systems/*/web/index.d.ts",{eager:true,query:"?raw",import:"default"});
const designs = import.meta.glob("../../systems/*/DESIGN.md",{eager:true,query:"?raw",import:"default"});
const extensions = import.meta.glob("../../systems/*/standards/extension.md",{eager:true,query:"?raw",import:"default"});
export function suiteApiContext(suite) {
 return [
 "套系："+suite.id+" / 版本 "+suite.version+" / "+suite.status,
 buildDesignContext(suite, designs[`../../systems/${suite.id}/DESIGN.md`], extensions[`../../systems/${suite.id}/standards/extension.md`]),
 "## 现有实现与接口边界",
 "当前可复用组件（不是设计能力上限）："+suite.capabilities.components.join(", "),
 "能力边界："+(suite.selection?.limitations??[]).join("；"),
 ...(suite.status === 'draft' ? [
   "本套尚无公开包入口；使用 systems/"+suite.id+" 中的实验室源码，遵守本套来源与适配边界。"
 ] : [
   "仓库路径：systems/"+suite.id+"；外部路径：node_modules/ui-design-lab/systems/"+suite.id,
   'import "ui-design-lab/'+suite.id+'/tokens.css";',
   'import "ui-design-lab/'+suite.id+'/components.css";',
 ]),
 "使用根作用域 "+suite.scope+"；先读取 API.md / 类型，再编写代码。",
 "真实 API 声明：\n\u0060\u0060\u0060ts\n"+(types["../../systems/"+suite.id+"/web/index.d.ts"]??"该套系尚无公开类型")+"\n\u0060\u0060\u0060",
 "调用库组件时只使用类型声明中的真实导出；需要的新组件可以在业务项目内按上述设计规则实现。现有 API 边界与本地设计扩展分开说明。"
 ].join("\n");
}
