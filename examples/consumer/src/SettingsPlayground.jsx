import { useState } from "react";
import { useSavedForm } from "./useSavedForm.js";
export function SettingsPlayground({ suiteId, Button, Field, Select, Toggle, Panel, onNotify }) {
  const form = useSavedForm("ui-lab-settings:"+suiteId,{name:"产品研究工作台",workspace:"research",notifications:true});
  const [scenario,setScenario] = useState("default");
  const pending = form.status === "saving" || scenario === "loading";
  return <section className="settings-playground">
    <h1>交互试验场</h1><p>修改会保存在当前浏览器。可模拟失败、保留输入并重试；取消恢复最近保存值。</p>
    <label>场景状态 <select aria-label="场景状态" value={scenario} onChange={e=>setScenario(e.target.value)}><option value="default">正常</option><option value="loading">加载</option><option value="error">错误</option></select></label>
    <Panel title="工作区设置"><form onSubmit={async e=>{e.preventDefault(); if (await form.save(scenario === "error")) onNotify?.("设置已保存到本机");}}>
      <Field label="工作区名称" value={form.draft.name} onChange={e=>form.update("name",e.target.value)} loading={pending} error={form.error || undefined}/>
      <Select label="工作区类型" value={form.draft.workspace} onChange={e=>form.update("workspace",e.target.value)} options={[{value:"research",label:"研究工作区"},{value:"monitor",label:"监控工作区"},{value:"writing",label:"写作工作区"}]} loading={pending}/>
      <Toggle label="桌面通知" description="保存的是偏好；演示不会请求系统权限。" checked={form.draft.notifications} onChange={v=>form.update("notifications",v)} loading={pending}/>
      <p role="status">{pending ? "正在保存或加载…" : form.dirty ? "有未保存的修改" : form.status === "saved" ? "已保存到本机" : "与已保存内容一致"}</p>
      {form.error ? <p role="alert">{form.error}</p> : null}
      <div className="playground-actions"><Button type="submit" loading={pending}>保存设置</Button><Button variant="secondary" disabled={pending} onClick={form.cancel}>取消</Button>{form.status === "error" ? <Button disabled={pending} onClick={async()=>{setScenario("default");if(await form.save(false))onNotify?.("设置已保存到本机");}}>重试保存</Button> : null}</div>
    </form></Panel>
  </section>;
}
