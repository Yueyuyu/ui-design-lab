import {
  ArrowRight,
  Bell,
  FolderOpen,
  Play,
  Trash,
} from "@phosphor-icons/react";
import { useState } from "react";
import {
  QuietButton,
  QuietCard,
  QuietDialog,
  QuietEmptyState,
  QuietField,
  QuietNotification,
  QuietQuotaPill,
  QuietSelect,
  QuietStatusChip,
  QuietTable,
  QuietTaskLight,
  QuietToggle,
  quietInteractionStates,
} from "../../systems/quiet-workspace/web/index.js";
import { GalleryBlock, SectionHeader } from "./SectionHeader.jsx";

const stateLabels = {
  default: "默认",
  hover: "悬停",
  pressed: "按下",
  focus: "聚焦",
  disabled: "禁用",
  loading: "加载",
  error: "错误",
  empty: "空状态",
};

const workspaceOptions = [
  { value: "research", label: "研究工作区" },
  { value: "data", label: "数据工作区" },
  { value: "monitor", label: "监控工作区" },
];

const tableColumns = [
  { key: "task", label: "任务" },
  { key: "owner", label: "负责人" },
  {
    key: "status",
    label: "状态",
    render: (row) => <QuietStatusChip tone={row.tone} dot>{row.status}</QuietStatusChip>,
  },
  { key: "updated", label: "更新时间", align: "end" },
];

const tableRows = [
  { id: "normal", task: "整理用户研究结论", owner: "千叶", status: "进行中", tone: "running", updated: "刚刚" },
  { id: "hover", task: "核对本周数据源", owner: "千叶", status: "需处理", tone: "attention", updated: "08:42", visualState: "hover" },
  { id: "pressed", task: "编写产品复盘", owner: "Codex", status: "执行中", tone: "running", updated: "07:18", visualState: "pressed" },
  { id: "focus", task: "更新设计规范", owner: "Codex", status: "已完成", tone: "success", updated: "昨天", visualState: "focus" },
  { id: "disabled", task: "归档历史项目", owner: "—", status: "已暂停", tone: "neutral", updated: "—", disabled: true },
];

function StateGrid({ children }) {
  return <div className="component-state-grid">{children}</div>;
}

function StateCell({ state, children }) {
  return (
    <article className="component-state-cell" data-state={state}>
      <span>{stateLabels[state]}</span>
      {children}
    </article>
  );
}

function StateSelector({ value, onChange, states = quietInteractionStates }) {
  return (
    <div className="component-state-selector" aria-label="组件状态">
      {states.map((state) => (
        <button
          type="button"
          key={state}
          data-active={value === state ? "true" : "false"}
          onClick={() => onChange(state)}
        >
          {stateLabels[state]}
        </button>
      ))}
    </div>
  );
}

export function ComponentsGallery({ density, onNotify }) {
  const [notifications, setNotifications] = useState(true);
  const [projectName, setProjectName] = useState("周度产品复盘");
  const [workspace, setWorkspace] = useState("research");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogState, setDialogState] = useState("default");
  const [tableState, setTableState] = useState("default");
  const [emptyState, setEmptyState] = useState("default");

  return (
    <>
      <SectionHeader
        eyebrow="COMPONENTS · 7-STATE CONTRACT"
        title="组件与完整状态"
        description="按钮、表单、浮层、数据展示和反馈组件共享同一套七态契约；密度只改变空间，不缩小关键文字。"
        aside={<span className="component-density">当前：{density === "compact" ? "紧凑" : "舒适"} · 七态完整</span>}
      />

      <div className="component-state-contract" role="note">
        <strong>统一状态顺序</strong>
        {quietInteractionStates.map((state) => <span key={state}>{stateLabels[state]}</span>)}
      </div>

      <GalleryBlock eyebrow="ACTIONS" title="按钮" description="七种状态保持同一宽高；加载与错误不会让标签或布局跳动。">
        <StateGrid>
          {quietInteractionStates.map((state) => (
            <StateCell state={state} key={state}>
              <QuietButton
                variant="primary"
                visualState={state}
                disabled={state === "disabled"}
                loading={state === "loading"}
                error={state === "error"}
              >
                保存更改
              </QuietButton>
            </StateCell>
          ))}
        </StateGrid>
        <div className="component-stage component-stage--buttons component-stage--subsection">
          <QuietButton icon={Play} onClick={() => onNotify("主操作已触发")}>开始执行</QuietButton>
          <QuietButton variant="secondary" trailingIcon={ArrowRight} onClick={() => onNotify("已进入详情")}>查看详情</QuietButton>
          <QuietButton variant="ghost" icon={Bell} onClick={() => onNotify("提醒已设置")}>设置提醒</QuietButton>
          <QuietButton variant="danger" icon={Trash} onClick={() => onNotify("危险操作示例")}>删除</QuietButton>
        </div>
      </GalleryBlock>

      <GalleryBlock eyebrow="FORM" title="输入框" description="字段状态由边线、焦点环、图标和说明文字共同表达。">
        <StateGrid>
          {quietInteractionStates.map((state) => (
            <StateCell state={state} key={state}>
              <QuietField
                label="项目名称"
                defaultValue="周度产品复盘"
                hint="最多32个字符"
                visualState={state}
                disabled={state === "disabled"}
                loading={state === "loading"}
                error={state === "error" ? "名称已被使用。请换一个名称。" : undefined}
              />
            </StateCell>
          ))}
        </StateGrid>
      </GalleryBlock>

      <GalleryBlock eyebrow="SELECTION" title="下拉框" description="保留原生选择语义，外观与输入框保持一致。">
        <StateGrid>
          {quietInteractionStates.map((state) => (
            <StateCell state={state} key={state}>
              <QuietSelect
                label="工作区类型"
                options={workspaceOptions}
                defaultValue="research"
                hint="决定默认页面结构"
                visualState={state}
                disabled={state === "disabled"}
                loading={state === "loading"}
                error={state === "error" ? "选项不可用。请重新选择。" : undefined}
              />
            </StateCell>
          ))}
        </StateGrid>
      </GalleryBlock>

      <div className="component-grid">
        <GalleryBlock eyebrow="LIVE FORM" title="组合使用">
          <div className="component-stage component-stage--form">
            <QuietField
              label="项目名称"
              value={projectName}
              onChange={(event) => setProjectName(event.target.value)}
              hint="最多32个字符"
            />
            <QuietSelect
              label="工作区类型"
              options={workspaceOptions}
              value={workspace}
              onChange={(event) => setWorkspace(event.target.value)}
              hint="可随时在项目设置中更改"
            />
          </div>
        </GalleryBlock>

        <GalleryBlock eyebrow="SETTING" title="开关与卡片">
          <div className="component-stage component-stage--stacked">
            <QuietToggle
              checked={notifications}
              onChange={setNotifications}
              label="任务完成通知"
              description="只在完成或需要介入时提醒"
            />
            <QuietCard
              eyebrow="WEEKLY REVIEW"
              title="数据完整性检查"
              action={<QuietStatusChip tone="success">通过</QuietStatusChip>}
            >
              <p className="component-card-copy">所有主要数据源均已完成校验，下次更新安排在明天09:00。</p>
            </QuietCard>
          </div>
        </GalleryBlock>
      </div>

      <GalleryBlock eyebrow="OVERLAY" title="对话框" description="选择状态后打开对话框，检查焦点、加载、错误和禁用反馈。">
        <div className="component-stage component-stage--interactive">
          <StateSelector value={dialogState} onChange={setDialogState} />
          <QuietButton onClick={() => setDialogOpen(true)}>打开对话框</QuietButton>
        </div>
        <QuietDialog
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          title="保存工作区设置"
          description="这些设置会应用到当前项目。"
          visualState={["hover", "pressed", "focus"].includes(dialogState) ? dialogState : undefined}
          disabled={dialogState === "disabled"}
          loading={dialogState === "loading"}
          error={dialogState === "error" ? "设置未保存。请检查网络后重试。" : undefined}
          actions={(
            <>
              <QuietButton variant="ghost" onClick={() => setDialogOpen(false)}>取消</QuietButton>
              <QuietButton
                visualState={["hover", "pressed", "focus"].includes(dialogState) ? dialogState : undefined}
                disabled={dialogState === "disabled"}
                loading={dialogState === "loading"}
                error={dialogState === "error"}
                onClick={() => {
                  onNotify("工作区设置已保存");
                  setDialogOpen(false);
                }}
              >
                保存设置
              </QuietButton>
            </>
          )}
        >
          <p className="component-dialog-copy">保存后，工作台会使用当前密度、通知和默认视图设置。</p>
        </QuietDialog>
      </GalleryBlock>

      <GalleryBlock eyebrow="DATA DISPLAY" title="表格" description="默认表格已同时展示行级悬停、按下、聚焦和禁用；加载、错误与空状态通过切换检查。">
        <StateSelector value={tableState} onChange={setTableState} states={["default", "loading", "error", "empty"]} />
        <div className="component-stage component-stage--flush">
          <QuietTable
            caption="后台任务"
            columns={tableColumns}
            rows={tableState === "empty" ? [] : tableRows}
            state={tableState}
            onRetry={() => setTableState("loading")}
            onRowActivate={(row) => onNotify(`已选择：${row.task}`)}
          />
        </div>
      </GalleryBlock>

      <GalleryBlock eyebrow="FEEDBACK" title="通知" description="标题说明结果，正文解释影响，操作文字直接给出下一步。">
        <div className="notification-gallery-grid">
          <QuietNotification
            tone="success"
            title="规则已保存"
            description="新规则会从下一次任务开始生效。"
            actionLabel="查看规则"
            onAction={() => onNotify("正在打开规则")}
            onDismiss={() => onNotify("通知已关闭")}
          />
          <QuietNotification
            tone="warning"
            title="任务需要确认"
            description="数据库迁移正在等待批准。"
            actionLabel="查看任务"
            onAction={() => onNotify("正在打开任务")}
          />
          <QuietNotification
            error
            title="数据同步失败"
            description="连接已中断。请检查网络后重试。"
            actionLabel="重新同步"
            onAction={() => onNotify("正在重新同步")}
          />
          <QuietNotification
            loading
            title="正在生成周报"
            description="完成后会自动发送通知。"
          />
        </div>
      </GalleryBlock>

      <GalleryBlock eyebrow="EMPTY STATE" title="空状态" description="空状态不是死胡同：始终解释原因，并提供一个最可能的下一步。">
        <StateSelector value={emptyState} onChange={setEmptyState} />
        <div className="component-stage component-stage--flush">
          <QuietEmptyState
            icon={FolderOpen}
            title="还没有研究资料"
            description="导入第一份资料后，摘要和引用会显示在这里。"
            actionLabel="导入资料"
            visualState={["hover", "pressed", "focus"].includes(emptyState) ? emptyState : undefined}
            disabled={emptyState === "disabled"}
            loading={emptyState === "loading"}
            error={emptyState === "error"}
            onAction={() => onNotify(emptyState === "error" ? "正在重新加载" : "正在选择资料")}
          />
        </div>
      </GalleryBlock>

      <GalleryBlock
        id="quota-pill"
        eyebrow="SIGNATURE COMPONENT · COMPACT"
        title="周额度胶囊"
        description="单一连续额度使用整块低饱和语义表面；只显示百分比，不重复叠加状态点、图标或粗黑文字。"
      >
        <div className="quota-component-layout">
          <section className="quota-live-stage" aria-label="周额度胶囊真实桌面场景">
            <span className="quota-live-stage__label">真实交互 · 点击胶囊收起或展开</span>
            <div className="quota-host-row">
              <span className="quota-host-row__avatar" aria-hidden="true">千</span>
              <strong>baichuan</strong>
              <QuietQuotaPill
                remainingPercent={76}
                resetText="8月20日 11:29 重置"
                defaultOpen
                panelAlign="end"
                onRefresh={() => onNotify("额度已刷新")}
                onExit={() => onNotify("退出额度显示示例")}
              />
              <span className="quota-host-row__utility">语音</span>
            </div>
          </section>

          <div className="quota-tone-grid" aria-label="额度阈值">
            <article>
              <QuietQuotaPill remainingPercent={76} />
              <span><strong>额度充足</strong><small>&gt;40% · 极浅绿与深灰绿</small></span>
            </article>
            <article>
              <QuietQuotaPill remainingPercent={32} />
              <span><strong>注意余量</strong><small>21–40% · 极浅橙与深灰橙</small></span>
            </article>
            <article>
              <QuietQuotaPill remainingPercent={12} />
              <span><strong>额度偏低</strong><small>≤20% · 极浅红与深灰红</small></span>
            </article>
            <p>详情面板始终使用白色纸张表面，不继承胶囊状态色。</p>
          </div>
        </div>

        <div className="quota-state-heading">
          <strong>七态契约</strong>
          <span>状态变化不改变 58 × 26px 的视觉占位</span>
        </div>
        <div className="component-state-grid quota-state-grid">
          {quietInteractionStates.map((state) => (
            <StateCell state={state} key={state}>
              <QuietQuotaPill
                remainingPercent={69}
                visualState={state}
                panelAlign="center"
                disabled={state === "disabled"}
                loading={state === "loading"}
                error={state === "error" ? "额度读取失败，请立即刷新。" : undefined}
              />
            </StateCell>
          ))}
        </div>
      </GalleryBlock>

      <GalleryBlock eyebrow="SIGNATURE COMPONENT · COMPACT" title="桌面任务灯" description="任务灯始终使用紧凑密度；切换 Gallery 密度不会改变它。">
        <div className="task-light-stage">
          <QuietTaskLight />
        </div>
      </GalleryBlock>
    </>
  );
}
