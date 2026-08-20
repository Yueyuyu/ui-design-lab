import {
  Broadcast,
  ChartBar,
  Database,
  FileText,
  TrendUp,
} from "@phosphor-icons/react";
import { QuietBarChart } from "./Chart.jsx";

const navigation = [
  { label: "项目周报", icon: FileText, current: true },
  { label: "产品调研", icon: ChartBar },
  { label: "数据备忘", icon: Database },
  { label: "交易系统", icon: TrendUp, group: "工作区" },
  { label: "前沿情报", icon: Broadcast },
];

export function QuietWorkspacePreview() {
  return (
    <section className="qw-workspace-preview" aria-label="Quiet Workspace 页面模式预览">
      <header className="qw-workspace-preview__bar">
        <span className="qw-workspace-preview__window-markers" aria-hidden="true">
          <i />
          <i />
          <i />
        </span>
        <span>项目研究 · 周度复盘</span>
        <span className="qw-workspace-preview__actions" aria-hidden="true">
          <i />
          <i />
        </span>
      </header>
      <div className="qw-workspace-preview__body">
        <aside className="qw-preview-sidebar">
          <div className="qw-preview-sidebar__brand">
            <span>W</span>
            工作资料
          </div>
          <div className="qw-preview-sidebar__label">最近使用</div>
          {navigation.map((item, index) => {
            const Icon = item.icon;
            return (
              <div key={item.label}>
                {item.group ? <div className="qw-preview-sidebar__label">{item.group}</div> : null}
                <div className="qw-preview-sidebar__item" data-current={item.current ? "true" : "false"}>
                  <Icon size={15} aria-hidden="true" />
                  {item.label}
                </div>
              </div>
            );
          })}
        </aside>
        <article className="qw-preview-document">
          <p className="qw-preview-document__kicker">WEEKLY REVIEW · 08 / 19</p>
          <h2>本周产品与数据进展</h2>
          <p className="qw-preview-document__lead">
            你正在处理其他工作。多个任务在后台继续执行，状态组件负责在完成或需要介入时提醒。
          </p>
          <div className="qw-preview-document__grid">
            <section className="qw-preview-summary">
              <h3>重点摘要</h3>
              <span />
              <span />
              <span />
              <span />
            </section>
            <QuietBarChart
              title="任务进度"
              description="最近六个周期"
              unit="%"
              data={[
                { label: "一", value: 38 },
                { label: "二", value: 62 },
                { label: "三", value: 48 },
                { label: "四", value: 76 },
                { label: "五", value: 67 },
                { label: "六", value: 88 },
              ]}
            />
          </div>
        </article>
      </div>
    </section>
  );
}
