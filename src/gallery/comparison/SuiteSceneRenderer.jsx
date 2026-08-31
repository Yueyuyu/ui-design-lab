import {
  ArrowRight,
  Copy,
  FileText,
  FolderOpen,
  TrendDown,
  TrendUp,
} from "@phosphor-icons/react";
import {
  QuietBarChart,
  QuietButton,
  QuietCard,
  QuietEmptyState,
  QuietField,
  QuietNotification,
  QuietStatusChip,
  QuietTable,
  QuietToggle,
} from "../../../systems/quiet-workspace/web/index.js";
import "../../../systems/quiet-workspace/foundations/tokens.css";
import "../../../systems/quiet-workspace/web/components.css";
import {
  LedgerBarChart,
  LedgerButton,
  LedgerEmptyState,
  LedgerField,
  LedgerMetric,
  LedgerNotification,
  LedgerPanel,
  LedgerStatusBadge,
  LedgerTable,
  LedgerToggle,
} from "../../../systems/midnight-ledger/web/index.js";
import "../../../systems/midnight-ledger/foundations/tokens.css";
import "../../../systems/midnight-ledger/web/components.css";
import { sharedSceneData } from "./scenarios.js";

const rendererIds = new Set(["quiet-workspace", "midnight-ledger"]);

function metricValue(metric, visualState) {
  if (visualState === "loading") return "同步中";
  if (visualState === "error") return "读取失败";
  return metric.value;
}

export function ComparisonMetrics({ suiteId, visualState = "default" }) {
  if (suiteId === "midnight-ledger") {
    return (
      <div className="comparison-metrics">
        {sharedSceneData.metrics.map((metric) => (
          <LedgerMetric
            key={metric.id}
            label={metric.label}
            value={metric.value}
            delta={metric.delta}
            tone="positive"
            loading={visualState === "loading"}
            error={visualState === "error"}
          />
        ))}
      </div>
    );
  }

  return (
    <div className="comparison-metrics">
      {sharedSceneData.metrics.map((metric) => {
        const TrendIcon = metric.direction === "down" ? TrendDown : TrendUp;
        return (
          <span className="comparison-qw-metric" key={metric.id} data-state={visualState}>
            <small>{metric.label}</small>
            <strong>{metricValue(metric, visualState)}</strong>
            <em><TrendIcon size={14} aria-hidden="true" />{visualState === "default" ? metric.delta : visualState === "loading" ? "正在同步" : "请重新加载"}</em>
          </span>
        );
      })}
    </div>
  );
}

export function ComparisonChart({ suiteId, visualState = "default", onRetry }) {
  if (suiteId === "midnight-ledger") {
    return (
      <LedgerBarChart
        title="近六月收入"
        data={sharedSceneData.revenue}
        unit="万"
        state={visualState}
        onRetry={onRetry}
      />
    );
  }
  return (
    <QuietBarChart
      title="近六月收入"
      description="单位：万元"
      data={sharedSceneData.revenue}
      unit="万"
      state={visualState}
      onRetry={onRetry}
    />
  );
}

export function ComparisonForm({ suiteId, visualState, formName, onFormNameChange, onNotify }) {
  const isLoading = visualState === "loading";
  const error = visualState === "error" ? "名称校验失败。请检查后重试。" : undefined;

  if (suiteId === "midnight-ledger") {
    return (
      <div className="comparison-form">
        <LedgerField label="复盘名称" value={formName} onChange={(event) => onFormNameChange(event.target.value)} hint="显示在项目目录中" loading={isLoading} error={error} />
        <div className="comparison-form__actions">
          <LedgerButton trailingIcon={ArrowRight} loading={isLoading} error={visualState === "error"} onClick={() => onNotify("Midnight Ledger 复盘已确认")}>确认复盘</LedgerButton>
          <LedgerButton variant="secondary" icon={Copy} onClick={() => onNotify("请使用右侧面板复制完整套系指令")}>复制指令</LedgerButton>
        </div>
      </div>
    );
  }

  return (
    <div className="comparison-form">
      <QuietField label="复盘名称" value={formName} onChange={(event) => onFormNameChange(event.target.value)} hint="显示在项目目录中" loading={isLoading} error={error} />
      <div className="comparison-form__actions">
        <QuietButton trailingIcon={ArrowRight} loading={isLoading} error={visualState === "error"} onClick={() => onNotify("Quiet Workspace 复盘已确认")}>确认复盘</QuietButton>
        <QuietButton variant="secondary" icon={Copy} onClick={() => onNotify("请使用右侧面板复制完整套系指令")}>复制指令</QuietButton>
      </div>
    </div>
  );
}

function QuietMonthlyScene(props) {
  return (
    <>
      <QuietCard eyebrow="MONTHLY REVIEW" title="月度经营复盘" action={<QuietStatusChip tone="running">待确认</QuietStatusChip>} state={props.visualState === "error" ? "error" : "default"}>
        <ComparisonMetrics suiteId="quiet-workspace" visualState={props.visualState} />
        <ComparisonChart suiteId="quiet-workspace" visualState={props.visualState} onRetry={props.onRetry} />
      </QuietCard>
      <QuietCard eyebrow="DECISION" title="下一步">
        <ComparisonForm suiteId="quiet-workspace" {...props} />
      </QuietCard>
    </>
  );
}

function LedgerMonthlyScene(props) {
  return (
    <>
      <LedgerPanel eyebrow="MONTHLY REVIEW" title="月度经营复盘" action={<LedgerStatusBadge tone="warning">待确认</LedgerStatusBadge>}>
        <ComparisonMetrics suiteId="midnight-ledger" visualState={props.visualState} />
        <ComparisonChart suiteId="midnight-ledger" visualState={props.visualState} onRetry={props.onRetry} />
      </LedgerPanel>
      <LedgerPanel eyebrow="DECISION" title="下一步">
        <ComparisonForm suiteId="midnight-ledger" {...props} />
      </LedgerPanel>
    </>
  );
}

function QuietDataTable({ visualState, onRetry, onNotify }) {
  const columns = [
    { key: "customer", label: "客户" },
    { key: "amount", label: "本月收入", align: "end" },
    { key: "owner", label: "负责人" },
    { key: "status", label: "状态", render: (row) => <QuietStatusChip tone={row.status === "已确认" ? "success" : row.status === "待复核" ? "running" : "attention"}>{row.status}</QuietStatusChip> },
  ];
  return (
    <QuietCard eyebrow="CUSTOMER LEDGER" title="客户收入明细">
      <QuietTable caption="2026年8月 · 已结算订单" columns={columns} rows={sharedSceneData.tableRows} state={visualState} onRetry={onRetry} onRowActivate={(row) => onNotify(`已打开 ${row.customer}`)} />
    </QuietCard>
  );
}

function LedgerDataTable({ visualState, onRetry, onNotify }) {
  const columns = [
    { key: "customer", label: "客户" },
    { key: "amount", label: "本月收入", align: "end" },
    { key: "owner", label: "负责人" },
    { key: "status", label: "状态", render: (value) => <LedgerStatusBadge tone={value === "已确认" ? "positive" : value === "待复核" ? "warning" : "negative"}>{value}</LedgerStatusBadge> },
  ];
  return (
    <LedgerPanel eyebrow="CUSTOMER LEDGER" title="客户收入明细">
      <LedgerTable caption="2026年8月 · 已结算订单" columns={columns} rows={sharedSceneData.tableRows} state={visualState} onRetry={onRetry} onRowActivate={(row) => onNotify(`已打开 ${row.customer}`)} />
    </LedgerPanel>
  );
}

function SettingsScene({ suiteId, visualState, settings, onSettingsChange }) {
  const isLedger = suiteId === "midnight-ledger";
  const Field = isLedger ? LedgerField : QuietField;
  const Toggle = isLedger ? LedgerToggle : QuietToggle;
  const Container = isLedger ? LedgerPanel : QuietCard;
  return (
    <Container eyebrow="REPORT SETTINGS" title="复盘设置">
      <div className="comparison-settings">
        <Field label="负责人" value={settings.owner} onChange={(event) => onSettingsChange("owner", event.target.value)} hint="用于任务分配与通知" loading={visualState === "loading"} error={visualState === "error" ? "负责人暂时无法校验。请稍后重试。" : undefined} />
        <Field label="抄送邮箱" value={settings.email} onChange={(event) => onSettingsChange("email", event.target.value)} hint="复盘完成后发送摘要" loading={visualState === "loading"} />
        <Toggle checked={settings.autoSave} onChange={(value) => onSettingsChange("autoSave", value)} label="自动保存草稿" description="每30秒保存一次当前编辑内容" loading={visualState === "loading"} error={visualState === "error" ? "保存服务暂时不可用。" : undefined} />
        <Toggle checked={settings.notify} onChange={(value) => onSettingsChange("notify", value)} label="完成后发送通知" description="向负责人和抄送成员发送结果" disabled={visualState === "loading"} />
      </div>
    </Container>
  );
}

function DetailScene({ suiteId, visualState, onRetry }) {
  const isLedger = suiteId === "midnight-ledger";
  const Container = isLedger ? LedgerPanel : QuietCard;
  const Notification = isLedger ? LedgerNotification : QuietNotification;
  return (
    <>
      <Container eyebrow="REVIEW DETAIL" title="八月增长复盘">
        <div className="comparison-detail">
          <div className="comparison-detail__summary">
            <span><FileText size={20} aria-hidden="true" /></span>
            <div><strong>收入连续第三个月增长</strong><p>核心客户续费和新签项目共同贡献本月增量，退款率保持在目标线以内。</p></div>
          </div>
          <dl>{sharedSceneData.detailItems.map((item) => <div key={item.label}><dt>{item.label}</dt><dd>{visualState === "loading" ? "同步中" : visualState === "error" ? "读取失败" : item.value}</dd></div>)}</dl>
        </div>
      </Container>
      <Notification
        tone={visualState === "error" ? "error" : "success"}
        title={visualState === "error" ? "详情同步中断" : "数据口径已确认"}
        description={visualState === "error" ? "当前字段值已保留，请重新加载。" : "收入、退款与客户指标均来自同一结算快照。"}
        actionLabel={visualState === "error" ? "重新加载" : undefined}
        onAction={onRetry}
        loading={visualState === "loading"}
        error={visualState === "error"}
      />
    </>
  );
}

function EmptyScene({ suiteId, visualState, onRetry }) {
  const EmptyState = suiteId === "midnight-ledger" ? LedgerEmptyState : QuietEmptyState;
  return (
    <EmptyState
      icon={FolderOpen}
      title="还没有复盘记录"
      description="创建第一份月度复盘后，收入趋势和后续任务会显示在这里。"
      actionLabel="创建月度复盘"
      onAction={onRetry}
      loading={visualState === "loading"}
      error={visualState === "error"}
    />
  );
}

function SuiteScene({ suiteId, scenarioId, ...props }) {
  if (scenarioId === "monthly-review") return suiteId === "midnight-ledger" ? <LedgerMonthlyScene {...props} /> : <QuietMonthlyScene {...props} />;
  if (scenarioId === "data-table") return suiteId === "midnight-ledger" ? <LedgerDataTable {...props} /> : <QuietDataTable {...props} />;
  if (scenarioId === "settings-form") return <SettingsScene suiteId={suiteId} {...props} />;
  if (scenarioId === "detail-page") return <DetailScene suiteId={suiteId} {...props} />;
  return <EmptyScene suiteId={suiteId} {...props} />;
}

export function supportsComparisonSuite(suiteId) {
  return rendererIds.has(suiteId);
}

export function SuiteSceneRenderer({
  suite,
  scenario,
  viewport,
  density,
  visualState,
  formName,
  settings,
  onFormNameChange,
  onSettingsChange,
  onNotify,
}) {
  if (!supportsComparisonSuite(suite.id)) {
    return (
      <section className="comparison-unsupported">
        <strong>{suite.displayName} 尚未提供“{scenario.label}”比较适配器</strong>
        <p>该套系仍可在目录中独立查看；补齐场景渲染器后会自动加入 A/B 画布。</p>
      </section>
    );
  }

  const isLedger = suite.id === "midnight-ledger";
  const suiteDescription = scenario.id === "monthly-review"
    ? suite.id === "quiet-workspace"
      ? "同一场景 · 温润编辑型工作台"
      : "同一场景 · 深色高密度账盘"
    : scenario.description;
  return (
    <div className="comparison-canvas__viewport" data-viewport={viewport}>
      <section className="comparison-suite-scene" data-ui-system={suite.id} data-density={density}>
        <header className="comparison-suite-scene__header">
          <span>
            <small>SUITE {String(suite.order).padStart(2, "0")}</small>
            <h2>{suite.displayName}</h2>
            <p>{suiteDescription}</p>
          </span>
          {isLedger
            ? <LedgerStatusBadge tone="warning" dot>{suite.status === "stable" ? "稳定" : "实验"}</LedgerStatusBadge>
            : <QuietStatusChip tone="success" dot>{suite.status === "stable" ? "稳定" : "实验"}</QuietStatusChip>}
        </header>
        <div className="comparison-suite-scene__content">
          <SuiteScene
            suiteId={suite.id}
            scenarioId={scenario.id}
            visualState={visualState}
            formName={formName}
            settings={settings}
            onFormNameChange={onFormNameChange}
            onSettingsChange={onSettingsChange}
            onNotify={onNotify}
            onRetry={() => onNotify(visualState === "error" ? "已重新加载当前场景" : "已创建月度复盘")}
          />
        </div>
      </section>
    </div>
  );
}

export function ComparisonButtonStates({ suiteId, onNotify }) {
  if (suiteId === "midnight-ledger") {
    return (
      <div className="comparison-button-states">
        <LedgerButton onClick={() => onNotify("默认按钮已执行")}>确认复盘</LedgerButton>
        <LedgerButton variant="secondary" icon={Copy}>复制指令</LedgerButton>
        <LedgerButton loading>正在处理</LedgerButton>
        <LedgerButton disabled>暂不可用</LedgerButton>
      </div>
    );
  }
  return (
    <div className="comparison-button-states">
      <QuietButton onClick={() => onNotify("默认按钮已执行")}>确认复盘</QuietButton>
      <QuietButton variant="secondary" icon={Copy}>复制指令</QuietButton>
      <QuietButton loading>正在处理</QuietButton>
      <QuietButton disabled>暂不可用</QuietButton>
    </div>
  );
}

export function ComparisonSuiteStatus({ suite }) {
  if (suite.id === "midnight-ledger") return <LedgerStatusBadge tone="warning">{suite.status === "stable" ? "稳定" : "实验"}</LedgerStatusBadge>;
  if (suite.id === "quiet-workspace") return <QuietStatusChip tone="success">{suite.status === "stable" ? "稳定" : "实验"}</QuietStatusChip>;
  return <span className="comparison-neutral-status">{suite.status}</span>;
}
