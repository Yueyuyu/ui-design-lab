import {useEffect,useState} from "react";
import {suites} from "../../registry/suites.js";
import {copyText} from "../copyText.js";
import {downloadText} from "../workbench/demo-data.js";
const scenarios=["monthly-review","data-table","settings-form","detail-page","empty-state"];
export function validateComparison(value) {
 if(!value||value.schemaVersion!==1||!scenarios.includes(value.scenarioId)||!["a","b"].includes(value.activeSlot)||!["desktop","tablet","mobile"].includes(value.viewport)||!["comfortable","compact"].includes(value.density)||!["default","loading","error"].includes(value.visualState)||typeof value.formName!=="string"||typeof value.settings?.owner!=="string"||typeof value.settings?.email!=="string"||typeof value.settings?.notify!=="boolean"||typeof value.settings?.autoSave!=="boolean")throw Error("比较配置格式不完整。");
 for(const id of [value.suiteAId,value.suiteBId]){const suite=suites.find(s=>s.id===id);if(!suite||suite.version!==value.versions?.[id])throw Error("比较套系或版本不匹配。");if(!suite.comparison?.scenarios.includes(value.scenarioId))throw Error("该套系不支持所选比较场景。");}
 return value;
}
export function ComparisonPersistence({snapshot,onRestore,onNotify}) {
 const [input,setInput]=useState(""),[message,setMessage]=useState("");
 const restore=raw=>{try{onRestore(validateComparison(JSON.parse(raw)));setMessage("比较配置已恢复");}catch(e){setMessage(e.message);}};
 useEffect(()=>{const shared=new URLSearchParams(location.hash.split("?")[1]).get("comparison");if(shared)restore(shared);},[]);
 return <details className="comparison-persistence"><summary>保存、恢复与分享比较配置</summary><p>本机保存和 JSON 包含当前演示表单内容。分享链接会包含这些内容，请先清除不适合分享的信息。</p><div className="workbench-actions"><button type="button" onClick={()=>{try{localStorage.setItem("ui-lab-comparison",JSON.stringify(snapshot));setMessage("比较已保存到本机");}catch{setMessage("本地存储不可用，请导出配置");}}}>保存比较</button><button type="button" onClick={()=>{try{restore(localStorage.getItem("ui-lab-comparison"));}catch{setMessage("本地存储不可用");}}}>恢复比较</button><button type="button" onClick={()=>downloadText("comparison.json",JSON.stringify(snapshot,null,2),"application/json")}>导出比较 JSON</button><button type="button" onClick={async()=>{try{const url=new URL(location.href);url.hash="compare?comparison="+encodeURIComponent(JSON.stringify(snapshot));if(url.href.length>12000)throw Error();await copyText(url.href);onNotify?.("包含当前演示内容的分享链接已复制");}catch{setMessage("复制失败或内容过长，请导出 JSON");}}}>复制含当前内容的分享链接</button><button type="button" onClick={()=>setInput(JSON.stringify(snapshot,null,2))}>显示当前配置</button></div><label>比较 JSON<textarea rows={5} value={input} onChange={e=>setInput(e.target.value)}/></label><button type="button" onClick={()=>restore(input)}>导入比较</button><p role="status">{message}</p></details>;
}
