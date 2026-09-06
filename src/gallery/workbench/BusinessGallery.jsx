import { businessExample } from "./usage-example.js";
import { useState } from "react";
import { getSuiteById } from "../../registry/suites.js";
import { copyText } from "../copyText.js";
export function BusinessGallery({
  ui: U,
  suiteId,
  onNotify
}) {
  const [text, setText] = useState("准备下一轮研究"),
    [check, setCheck] = useState(false),
    [radio, setRadio] = useState("week"),
    [choice, setChoice] = useState(""),
    [multi, setMulti] = useState([]),
    [range, setRange] = useState({
      start: "",
      end: ""
    }),
    [tab, setTab] = useState("form"),
    [open, setOpen] = useState(false),
    [items, setItems] = useState([]),
    [confirm, setConfirm] = useState(false);
  const suite = getSuiteById(suiteId),
    options = [{
      value: "week",
      label: "每周复盘"
    }, {
      value: "month",
      label: "每月总结"
    }, {
      value: "project",
      label: "按项目"
    }];
  const code = businessExample(suite);
  const add = message => setItems(v => [...v, {
    id: crypto.randomUUID(),
    message
  }]);
  return <section className="business-gallery"><h1>业务组件与能力</h1><p>可复用导出与真实交互示例 · 套系 v{suite.version} · 本地未发布扩展</p><U.Breadcrumb items={[{
      label: "套系总览",
      href: "#systems/" + suiteId + "/overview"
    }, {
      label: "业务组件"
    }]} />
 <U.Tabs value={tab} onChange={setTab} items={[{
      id: "form",
      label: "表单与选择",
      content: <div className="business-grid"><U.Panel title="字段和选择"><U.Textarea label="说明" value={text} onChange={e => setText(e.target.value)} hint="最多建议三段说明" /><U.Checkbox label="包含归档项目" checked={check} onChange={setCheck} /><U.RadioGroup label="复盘频率" options={options} value={radio} onChange={setRadio} /><U.Combobox label="默认模板" options={options} value={choice} onChange={setChoice} /><U.MultiSelect label="启用模板" options={options} value={multi} onChange={setMulti} /></U.Panel><U.Panel title="日期与加载"><U.DateRange label="统计日期" value={range} onChange={setRange} /><U.Progress label="准备进度" value={64} /><U.Skeleton label="正在读取模板…" rows={3} /></U.Panel></div>
    }, {
      id: "actions",
      label: "菜单、详情与通知",
      content: <U.Panel title="操作反馈"><div className="workbench-actions"><U.DropdownMenu items={[{
            id: "edit",
            label: "编辑详情",
            onSelect: () => setOpen(true)
          }, {
            id: "copy",
            label: "复制示例名称",
            onSelect: async () => {
              try {
                await copyText(text);
                add("已复制");
              } catch {
                add("复制不可用，请手动复制");
              }
            }
          }, {
            id: "delete",
            label: "删除演示记录",
            danger: true,
            onSelect: () => setConfirm(true)
          }]} /><U.Popover label="指标定义">完成率 = 已完成任务 / 区间内全部任务。演示不连接统计后端。</U.Popover><U.Tooltip label="使用提示">Tab 可访问所有控件，Escape 关闭浮层。</U.Tooltip><U.Button onClick={() => setOpen(true)}>打开详情抽屉</U.Button><U.Button onClick={() => add("新增一条可关闭的反馈")}>新增通知</U.Button></div><U.ToastQueue items={items} onDismiss={id => setItems(v => v.filter(x => x.id !== id))} /></U.Panel>
    }, {
      id: "contract",
      label: "能力与接入",
      content: <><table className="capability-table"><caption>版本 {suite.version} · 能力与实现范围</caption><thead><tr><th>能力</th><th>交付</th><th>验证边界</th></tr></thead><tbody>{suite.capabilities.components.map(c => <tr key={c}><td>{c}</td><td>{c.endsWith("preview") ? "组合演示" : "套系本地导出"}</td><td>{["table", "data-table"].includes(c) ? "客户端数据操作；远程请求由调用方提供" : "公开参数见套系 API / 类型；七态见规范"}</td></tr>)}</tbody></table><p>rows 由调用方持有；列 render(value, row) 返回显示内容；onRowActivate(row) 打开详情；selection / onSelectionChange(ids) 支持受控选择。loading / error / onRetry 负责请求边界。以下示例包含编辑与保存，关闭抽屉取消草稿。</p><pre>{code}</pre><button type="button" onClick={async () => {
          try {
            await copyText(code);
            onNotify?.("导入示例已复制");
          } catch {
            onNotify?.("请手动复制示例");
          }
        }}>复制导入示例</button><p><a href="#systems">返回目录选择接入路径</a></p></>
    }]} />
 <U.Drawer open={open || confirm} onOpenChange={v => {
      setOpen(v);
      if (!v) setConfirm(false);
    }} title={confirm ? "确认删除演示记录" : "项目详情"}><p>{confirm ? "只清空当前说明，取消会保留内容。" : "编辑说明后可返回列表继续操作。"}</p>{confirm ? <><U.Button onClick={() => {
          setText("");
          setConfirm(false);
          setOpen(false);
          add("演示说明已清空");
        }}>确认删除</U.Button><U.Button variant="secondary" onClick={() => setConfirm(false)}>取消删除</U.Button></> : <U.Textarea label="说明" value={text} onChange={e => setText(e.target.value)} />}</U.Drawer></section>;
}
