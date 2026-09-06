import { ArrowRight, Copy, FileText, FolderOpen, TrendDown, TrendUp } from "@phosphor-icons/react";
import {
  LedgerButton as Button, LedgerPanel as Panel, LedgerField as Field, LedgerToggle as Toggle,
  LedgerTable as Table, LedgerBarChart as Chart, LedgerStatusBadge as Badge,
  LedgerNotification as Notification, LedgerEmptyState as EmptyState,
} from "../web/index.js";
import "../foundations/tokens.css";
import "../web/components.css";

export function Status({ suite }) {
  return <Badge tone="positive" dot>{({ stable: "稳定", experimental: "实验", draft: "草稿", deprecated: "已弃用" })[suite.status]}</Badge>;
}

function Metrics({ data, visualState }) {
  return <div className="comparison-metrics">{data.metrics.map((metric) => {
    const Trend = metric.direction === "down" ? TrendDown : TrendUp;
    return <div className="ml-comparison-metric" key={metric.id} data-state={visualState}>
      <small>{metric.label}</small>
      <strong>{visualState === "loading" ? "同步中" : visualState === "error" ? "读取失败" : metric.value}</strong>
      <em><Trend size={14} aria-hidden="true" />{visualState === "default" ? metric.delta : visualState === "loading" ? "正在同步" : "请重新加载"}</em>
    </div>;
  })}</div>;
}

function RevenueChart({ data, visualState, onRetry }) {
  return <Chart title="近六月收入" description="单位：万元" data={data.revenue} unit="万" state={visualState} onRetry={onRetry} />;
}

function Form({ visualState, formName, onFormNameChange, onNotify, onCopy }) {
  const loading = visualState === "loading";
  const error = visualState === "error";
  return <div className="comparison-form">
    <Field label="复盘名称" value={formName} onChange={(event) => onFormNameChange(event.target.value)} hint="显示在项目目录中" loading={loading} error={error ? "名称校验失败。请检查后重试。" : undefined} />
    <div className="comparison-form__actions">
      <Button trailingIcon={ArrowRight} loading={loading} error={error} onClick={() => onNotify("示例复盘已确认")}>确认复盘</Button>
      <Button variant="secondary" icon={Copy} onClick={onCopy}>复制指令</Button>
    </div>
  </div>;
}

function Settings({ settings, onSettingsChange, visualState }) {
  const loading = visualState === "loading";
  return <Panel eyebrow="REPORT SETTINGS" title="复盘设置"><div className="comparison-settings">
    <Field label="负责人" value={settings.owner} onChange={(event) => onSettingsChange("owner", event.target.value)} hint="用于任务分配与通知" loading={loading} error={visualState === "error" ? "负责人暂时无法校验。请稍后重试。" : undefined} />
    <Field label="抄送邮箱" value={settings.email} onChange={(event) => onSettingsChange("email", event.target.value)} hint="复盘完成后发送摘要" loading={loading} />
    <Toggle checked={settings.autoSave} onChange={(value) => onSettingsChange("autoSave", value)} label="自动保存草稿" description="每30秒保存一次当前编辑内容" loading={loading} error={visualState === "error" ? "保存服务暂时不可用。" : undefined} />
    <Toggle checked={settings.notify} onChange={(value) => onSettingsChange("notify", value)} label="完成后发送通知" description="向负责人和抄送成员发送结果" disabled={loading} />
  </div></Panel>;
}

function DataTable({ data, visualState, onRetry, onNotify }) {
  const renderStatus = (value) => <Badge tone={value === "已确认" ? "positive" : value === "待复核" ? "warning" : "negative"}>{value}</Badge>;
  const columns = [
    { key: "customer", label: "客户" }, { key: "amount", label: "本月收入", align: "end" },
    { key: "owner", label: "负责人" },
    { key: "status", label: "状态", render: renderStatus },
  ];
  return <Panel eyebrow="CUSTOMER LEDGER" title="客户收入明细">
    <Table caption="2026年8月 · 已结算订单" columns={columns} rows={data.tableRows} state={visualState} onRetry={onRetry} onRowActivate={(row) => onNotify("示例客户：" + row.customer)} />
  </Panel>;
}

function Detail({ data, formName, settings, visualState, onRetry }) {
  return <>
    <Panel eyebrow="REVIEW DETAIL" title={formName}>
      <div className="comparison-detail">
        <div className="comparison-detail__summary"><span><FileText size={20} aria-hidden="true" /></span><div><strong>本月收入回升</strong><p>核心客户续费和新签项目共同贡献本月增量，退款率保持在目标线以内。</p></div></div>
        <dl>{data.detailItems.map((item) => <div key={item.label}><dt>{item.label}</dt><dd>{visualState === "loading" ? "同步中" : visualState === "error" ? "读取失败" : item.label === "负责人" ? settings.owner : item.value}</dd></div>)}</dl>
      </div>
    </Panel>
    <Notification tone={visualState === "error" ? "error" : "success"} title={visualState === "error" ? "详情同步中断" : "数据口径已确认"} description={visualState === "error" ? "当前字段值已保留，请重新加载。" : "收入、退款与客户指标均来自同一示例快照。"} actionLabel={visualState === "error" ? "重新加载" : undefined} onAction={onRetry} loading={visualState === "loading"} error={visualState === "error"} />
  </>;
}

export function Scene({ scenarioId, ...props }) {
  if (scenarioId === "monthly-review") return <>
    <Panel eyebrow="MONTHLY REVIEW" title="月度经营复盘" action={<Badge tone="warning">待确认</Badge>}>
      <Metrics {...props} /><RevenueChart {...props} />
    </Panel>
    <Panel eyebrow="DECISION" title="下一步"><Form {...props} /></Panel>
  </>;
  if (scenarioId === "data-table") return <DataTable {...props} />;
  if (scenarioId === "settings-form") return <Settings {...props} />;
  if (scenarioId === "detail-page") return <Detail {...props} />;
  return <EmptyState icon={FolderOpen} title="还没有复盘记录" description="创建第一份月度复盘后，收入趋势和后续任务会显示在这里。" actionLabel="创建月度复盘" onAction={props.onRetry} loading={props.visualState === "loading"} error={props.visualState === "error"} />;
}

export function Module({ moduleId, ...props }) {
  const content = moduleId === "metrics" ? <Metrics {...props} />
    : moduleId === "chart" ? <RevenueChart {...props} />
    : moduleId === "form" ? <Form {...props} />
    : <div className="comparison-button-states">
      <Button onClick={() => props.onNotify("示例按钮已执行")}>确认复盘</Button>
      <Button variant="secondary" icon={Copy} onClick={props.onCopy}>复制指令</Button>
      <Button loading>正在处理</Button><Button disabled>暂不可用</Button>
    </div>;
  return <Panel>{content}</Panel>;
}
