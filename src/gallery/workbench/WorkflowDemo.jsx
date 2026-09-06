import { useTaskSimulation } from "./useTaskSimulation.js";
import { useEffect, useState } from "react";
import { initialDocuments, downloadText, csv } from "./demo-data.js";
import { SettingsPlayground } from "../SettingsPlayground.jsx";
export function WorkflowDemo({
  ui: U,
  suiteId,
  kind = "tasks",
  onNotify = () => {}
}) {
  const [page, setPage] = useState("list"),
    [active, setActive] = useState(null),
    [docs, setDocs] = useState(initialDocuments),
    [docId, setDocId] = useState("d1"),
    [content, setContent] = useState(initialDocuments[0].content),
    [query, setQuery] = useState(""),
    [range, setRange] = useState({
      start: "",
      end: ""
    }),
    [exportState, setExportState] = useState("idle"),
    [exportFail, setExportFail] = useState(false),
    [viewName, setViewName] = useState("我的报表"),
    [notice, setNotice] = useState(""),
    [alerts, setAlerts] = useState(true),
    [threshold, setThreshold] = useState("200");
  const {
    tasks,
    setTasks,
    run,
    cancel
  } = useTaskSimulation();
  useEffect(() => {
    setPage("list");
    setActive(null);
  }, [kind]);
  const task = tasks.find(t => t.id === active);
  const notify = message => {
    setNotice(message);
    onNotify(message);
  };
  const nav = kind === "tasks" ? [{
    id: "list",
    label: "任务列表"
  }, {
    id: "usage",
    label: "用量统计"
  }, {
    id: "settings",
    label: "工作区设置"
  }] : kind === "research" ? [{
    id: "list",
    label: "项目与资料"
  }, {
    id: "upload",
    label: "导入资料"
  }, {
    id: "history",
    label: "版本历史"
  }] : [{
    id: "list",
    label: "运营概览"
  }, {
    id: "details",
    label: "明细报表"
  }, {
    id: "alerts",
    label: "告警设置"
  }];
  const selectedDocs = docs.filter(d => [d.name, d.folder, d.content].join(" ").includes(query));
  const currentDoc = docs.find(d => d.id === docId) ?? docs[0];
  const openDoc = id => {
    const d = docs.find(x => x.id === id);
    if (d) {
      setDocId(id);
      setContent(d.content);
    }
  };
  const reportRows = tasks.filter(t => (!range.start || t.date >= range.start) && (!range.end || t.date <= range.end));
  const formatCount = value => U.format ? U.format(value, {
    digits: 0
  }) : new Intl.NumberFormat("zh-CN").format(value);
  const reportColumns = [{
    key: "name",
    label: "项目"
  }, {
    key: "date",
    label: "日期"
  }, {
    key: "usage",
    label: "用量（次）",
    render: value => formatCount(value)
  }, {
    key: "status",
    label: "状态"
  }];
  const exportReport = async (fail = exportFail) => {
    setExportState("running");
    await new Promise(resolve => setTimeout(resolve, 450));
    if (fail) {
      setExportState("error");
      return;
    }
    downloadText("operations.csv", "\uFEFF" + csv(reportRows, reportColumns), "text/csv;charset=utf-8");
    setExportState("done");
  };
  const saveView = () => {
    try {
      localStorage.setItem("ui-lab-report:" + suiteId, JSON.stringify({
        version: 1,
        name: viewName,
        range
      }));
      notify("视图已保存到本机");
    } catch {
      notify("保存失败，本地存储不可用");
    }
  };
  const loadView = () => {
    try {
      const v = JSON.parse(localStorage.getItem("ui-lab-report:" + suiteId));
      if (!v || v.version !== 1 || typeof v.name !== "string" || typeof v.range?.start !== "string" || typeof v.range?.end !== "string") throw Error();
      setViewName(v.name);
      setRange(v.range);
      notify("视图已恢复");
    } catch {
      notify("没有可恢复的有效视图");
    }
  };
  return <section className="workflow-demo"><p className="workbench-boundary">可运行 UI 示例 · 数据保存在当前演示会话；任务执行和上传使用明确的本地模拟适配器。</p>
 <U.Shell brand={kind === "tasks" ? "Task / 用量" : kind === "research" ? "Research / 内容" : "Operations / 分析"} navigation={nav} activeId={page} onNavigate={setPage} title={nav.find(n => n.id === page)?.label ?? "任务详情"} actions={<U.Popover label="交付边界">包含页面、状态、演示数据与接口示例。真实存储、任务服务、登录、邮件和支付由你的业务服务接入。</U.Popover>}>
 {notice ? <p role="status">{notice}</p> : null}
 {kind === "tasks" && page === "list" ? <>{U.TaskLight ? <U.TaskLight title="活动任务" tasks={tasks.filter(t => t.status !== "已完成" && t.status !== "已取消").map(t => ({
          id: t.id,
          title: t.name,
          detail: t.status,
          time: t.date,
          state: t.status === "执行中" ? "running" : "attention"
        }))} onTaskActivate={t => setActive(t.id)} /> : null}<U.DataTable rows={tasks} columns={[{
          key: "name",
          label: "任务"
        }, {
          key: "status",
          label: "状态"
        }, {
          key: "owner",
          label: "负责人"
        }, {
          key: "usage",
          label: "用量"
        }]} caption="任务列表" onRowActivate={t => setActive(t.id)} onBulkAction={ids => {
          ids.forEach(run);
          notify("已开始 " + ids.length + " 个本地模拟任务");
        }} /><U.Button onClick={() => setTasks(v => [...v, {
          id: crypto.randomUUID(),
          name: "新研究任务 " + (v.length + 1),
          status: "等待",
          progress: 0,
          usage: 0,
          owner: "我",
          date: "2026-09-05",
          result: "",
          history: ["创建任务"]
        }])}>新建任务</U.Button></> : null}
 {kind === "tasks" && page === "usage" ? <><h3>本会话累计用量：{formatCount(tasks.reduce((sum, t) => sum + t.usage, 0))} 次</h3><U.Chart title="各任务用量" data={tasks.map(t => ({
          label: t.name,
          value: t.usage
        }))} unit="次" description="演示任务累计消耗，不代表真实计费" />{U.Quota ? <U.Quota remainingPercent={Math.max(0, 100 - Math.round(tasks.reduce((sum, t) => sum + t.usage, 0) / 10))} /> : null}</> : null}
 {kind === "tasks" && page === "settings" ? <SettingsPlayground suiteId={suiteId} {...U} onNotify={notify} /> : null}
 {kind === "research" ? <><U.Field label="搜索资料" value={query} onChange={e => setQuery(e.target.value)} />
 {page === "upload" ? U.FileUpload ? <U.FileUpload upload={(file, {
          signal,
          onProgress
        }) => new Promise((resolve, reject) => {
          let progress = 0;
          const timer = setInterval(() => {
            progress += 25;
            onProgress(progress);
            if (progress === 100) {
              clearInterval(timer);
              resolve({
                id: crypto.randomUUID(),
                name: file.name
              });
            }
          }, 180);
          signal.addEventListener("abort", () => {
            clearInterval(timer);
            reject(new Error("已取消"));
          }, {
            once: true
          });
        })} onComplete={(_, file) => {
          const d = {
            id: crypto.randomUUID(),
            name: file.name,
            folder: "导入资料",
            content: "已导入文件元数据：" + file.name + "（" + file.size + " 字节）。演示不持久存储原文件。",
            versions: []
          };
          setDocs(v => [...v, d]);
          notify("已导入 " + file.name + " 的演示记录");
        }} /> : <p>该套系未提供文件上传组件，请选择支持该能力的套系。</p> : page === "history" ? <><h3>{currentDoc.name} · 历史版本</h3>{currentDoc.versions.map(v => <U.Panel key={v.version} title={"版本 " + v.version + " · " + v.date}><p>{v.content}</p><U.Button variant="secondary" onClick={() => {
              setContent(v.content);
              setPage("list");
              notify("历史内容已载入编辑器，保存后创建新版本");
            }}>载入此版本</U.Button></U.Panel>)}</> : <div className="research-layout"><div>{U.Tree ? <U.Tree nodes={[...new Set(selectedDocs.map(d => d.folder))].map(folder => ({
              id: folder,
              label: folder,
              children: selectedDocs.filter(d => d.folder === folder).map(d => ({
                id: d.id,
                label: d.name
              }))
            }))} value={docId} onChange={openDoc} /> : selectedDocs.map(d => <U.Button key={d.id} onClick={() => openDoc(d.id)}>{d.name}</U.Button>)}</div><U.Panel title={currentDoc.name}><U.Textarea label="资料内容" value={content} onChange={e => setContent(e.target.value)} /><U.Button onClick={() => {
              if (!content.trim()) {
                notify("资料内容不能为空");
                return;
              }
              setDocs(v => v.map(d => d.id === docId ? {
                ...d,
                content,
                versions: [...d.versions, {
                  version: d.versions.length + 1,
                  content,
                  date: new Date().toLocaleString("zh-CN")
                }]
              } : d));
              notify("已保存新版本");
            }}>保存新版本</U.Button><U.Button variant="secondary" onClick={() => setContent(currentDoc.content)}>取消编辑</U.Button></U.Panel></div>}
 </> : null}
 {kind === "reports" ? <><U.DateRange label="报表日期" value={range} onChange={setRange} />{page === "alerts" ? <U.Panel title="告警偏好"><U.Checkbox label="启用用量提醒" checked={alerts} onChange={setAlerts} /><U.Field type="number" label="提醒阈值（次）" value={threshold} onChange={e => setThreshold(e.target.value)} /><U.Button onClick={() => {
            if (!Number.isFinite(Number(threshold)) || Number(threshold) <= 0) {
              notify("请输入大于零的阈值");
              return;
            }
            try {
              localStorage.setItem("ui-lab-alert:" + suiteId, JSON.stringify({
                alerts,
                threshold
              }));
              notify("偏好已保存到本机；未接入邮件或推送服务");
            } catch {
              notify("本地存储不可用");
            }
          }}>保存告警偏好</U.Button></U.Panel> : <>{page === "list" ? <><h3>区间用量：{formatCount(reportRows.reduce((s, t) => s + t.usage, 0))} 次</h3><U.Chart title="区间项目用量" data={reportRows.map(t => ({
              label: t.name,
              value: t.usage
            }))} unit="次" period={[range.start || "不限", range.end || "不限"].join(" 至 ")} source="演示任务记录" /></> : null}<U.DataTable caption="运营明细" rows={reportRows} columns={reportColumns} onRowActivate={t => setActive(t.id)} /><U.Field label="视图名称" value={viewName} onChange={e => setViewName(e.target.value)} /><div className="workbench-actions"><U.Button onClick={saveView}>保存视图</U.Button><U.Button variant="secondary" onClick={loadView}>恢复视图</U.Button><U.Button loading={exportState === "running"} onClick={() => exportReport()}>导出当前明细 CSV</U.Button></div><U.Checkbox label="模拟导出失败" checked={exportFail} onChange={setExportFail} />{exportState === "error" ? <p role="alert">导出失败，筛选条件仍保留。<U.Button onClick={() => {
              setExportFail(false);
              exportReport(false);
            }}>重试导出</U.Button></p> : exportState === "done" ? <p role="status">CSV 已生成并触发下载。</p> : null}</>}</> : null}
 </U.Shell>
 <U.Drawer open={!!task} onOpenChange={v => {
      if (!v) setActive(null);
    }} title={task?.name ?? "任务详情"}>{task ? <><p>状态：{task.status}</p><U.Progress label="任务进度" value={task.progress} /><h3>操作历史</h3><ol>{task.history.map((h, i) => <li key={i}>{h}</li>)}</ol>{task.status === "执行中" ? <U.Button onClick={() => cancel(task.id)}>取消任务</U.Button> : task.status !== "已完成" ? <U.Button onClick={() => run(task.id)}>{task.status === "失败" ? "重试任务" : "开始任务"}</U.Button> : <><h3>任务结果</h3><p>{task.result}</p><U.Button onClick={() => downloadText(task.name + ".txt", task.result)}>下载结果</U.Button></>}</> : null}</U.Drawer>
 </section>;
}
