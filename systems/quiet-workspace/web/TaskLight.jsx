import { ArrowClockwise, Bell, CircleNotch, Pause, PushPin, WarningCircle, X } from "@phosphor-icons/react";
import { useState } from "react";
import { QuietButton, QuietIconButton, QuietStatusChip, QuietToggle } from "./primitives.jsx";

const defaultTasks = [
  {
    id: "migration",
    title: "应用数据库迁移",
    detail: "等待你批准执行命令",
    time: "刚刚",
    state: "attention",
  },
  {
    id: "latency",
    title: "分析交易信号延迟",
    detail: "正在读取运行日志",
    time: "08:42",
    state: "running",
  },
  {
    id: "responsive",
    title: "修复登录页响应式布局",
    detail: "正在运行界面测试",
    time: "03:15",
    state: "running",
  },
];

function TaskGroup({ label, state, tasks, onTaskActivate }) {
  if (tasks.length === 0) {
    return null;
  }

  return (
    <section className="qw-task-group" aria-label={label}>
      <header className="qw-task-group__label">
        <span>{label}</span>
        <span>{tasks.length}</span>
      </header>
      {tasks.map((task) => (
        <article className="qw-task-row" key={task.id} tabIndex={onTaskActivate?0:-1} role={onTaskActivate?"button":undefined} onClick={()=>onTaskActivate?.(task)} onKeyDown={event=>{if(onTaskActivate&&["Enter"," "].includes(event.key)){event.preventDefault();onTaskActivate(task);}}}>
          <span className={`qw-task-row__rail qw-task-row__rail--${state}`} aria-hidden="true" />
          <span className="qw-task-row__copy">
            <strong>{task.title}</strong>
            <span>{task.detail}</span>
          </span>
          <time>{task.time}</time>
        </article>
      ))}
    </section>
  );
}

export function QuietTaskLight({
  tasks = defaultTasks,
  title = "Codex 活动任务",
  defaultOpen = true,
  loading = false,
  error,
  disabled = false,
  onRetry,
  onTaskActivate,
}) {
  const [open, setOpen] = useState(defaultOpen);
  const [topMost, setTopMost] = useState(true);
  const attentionTasks = tasks.filter((task) => task.state === "attention");
  const runningTasks = tasks.filter((task) => task.state === "running");
  const state = error ? "error" : loading ? "loading" : disabled ? "disabled" : "default";
  const isIdle = !loading && !error && !disabled && attentionTasks.length === 0 && runningTasks.length === 0;

  return (
    <div className="qw-task-light" data-density="compact" data-state={state} data-open={open ? "true" : "false"}>
      <button
        type="button"
        className="qw-task-light__handle"
        aria-expanded={open}
        aria-busy={loading || undefined}
        disabled={disabled}
        onClick={() => !disabled && setOpen((value) => !value)}
      >
        {loading ? <span className="qw-task-light__segment"><CircleNotch className="qw-spin" size={14} aria-hidden="true" />正在同步</span> : null}
        {error ? <span className="qw-task-light__segment"><WarningCircle size={14} weight="bold" aria-hidden="true" />读取失败</span> : null}
        {disabled ? <span className="qw-task-light__segment"><Pause size={14} aria-hidden="true" />监控已暂停</span> : null}
        {isIdle ? <span className="qw-task-light__segment"><span className="qw-signal qw-signal--success" aria-hidden="true" />当前空闲</span> : null}
        {!loading && !error && !disabled && !isIdle ? (
          <>
            <span className="qw-task-light__segment">
              <span className="qw-signal qw-signal--attention" aria-hidden="true" />
              需处理 {attentionTasks.length}
            </span>
            <span className="qw-task-light__segment">
              <span className="qw-signal qw-signal--running" aria-hidden="true" />
              执行中 {runningTasks.length}
            </span>
          </>
        ) : null}
      </button>

      {open ? (
        <section className="qw-task-panel" aria-label={title}>
          <header className="qw-task-panel__header">
            <span>
              <h3>{title}</h3>
              <span className="qw-task-panel__chips">
                {loading ? <QuietStatusChip tone="neutral" state="loading">正在同步</QuietStatusChip> : null}
                {error ? <QuietStatusChip tone="attention" state="error">读取失败</QuietStatusChip> : null}
                {disabled ? <QuietStatusChip tone="neutral">监控已暂停</QuietStatusChip> : null}
                {isIdle ? <QuietStatusChip tone="success" dot>当前空闲</QuietStatusChip> : null}
                {!loading && !error && !disabled && !isIdle ? (
                  <>
                    <QuietStatusChip tone="attention">需要处理 {attentionTasks.length}</QuietStatusChip>
                    <QuietStatusChip tone="running">执行中 {runningTasks.length}</QuietStatusChip>
                  </>
                ) : null}
              </span>
            </span>
            <QuietIconButton icon={X} label="收起任务列表" onClick={() => setOpen(false)} />
          </header>
          <div className="qw-task-panel__body">
            {loading ? <div className="qw-task-panel__message"><CircleNotch className="qw-spin" size={18} aria-hidden="true" />正在同步任务状态…</div> : null}
            {error ? (
              <div className="qw-task-panel__message qw-task-panel__message--error" role="alert">
                <WarningCircle size={18} weight="bold" aria-hidden="true" />
                <span>{error}</span>
                {onRetry ? <QuietButton size="small" variant="secondary" icon={ArrowClockwise} onClick={onRetry}>重新加载</QuietButton> : null}
              </div>
            ) : null}
            {disabled ? <div className="qw-task-panel__message"><Pause size={18} aria-hidden="true" />任务监控已暂停。</div> : null}
            {isIdle ? <div className="qw-task-panel__message"><span className="qw-signal qw-signal--success" aria-hidden="true" />当前没有执行中的任务。</div> : null}
            {!loading && !error && !disabled && !isIdle ? (
              <>
                <TaskGroup onTaskActivate={onTaskActivate} label="需要处理" state="attention" tasks={attentionTasks} />
                <TaskGroup onTaskActivate={onTaskActivate} label="执行中" state="running" tasks={runningTasks} />
              </>
            ) : null}
          </div>
          <footer className="qw-task-panel__footer">
            <span className="qw-task-notice"><Bell size={14} aria-hidden="true" />仅在完成或需处理时通知</span>
            <span className="qw-task-pin">
              <PushPin size={14} aria-hidden="true" />
              <QuietToggle checked={topMost} onChange={setTopMost} label="始终置顶" disabled={disabled} />
            </span>
          </footer>
        </section>
      ) : null}
    </div>
  );
}
