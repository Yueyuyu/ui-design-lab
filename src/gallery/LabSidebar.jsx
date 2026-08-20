import {
  BookOpen,
  Article,
  Flask,
  Palette,
  Plus,
  Rows,
  SquaresFour,
} from "@phosphor-icons/react";

const navigation = [
  { id: "overview", label: "总览", icon: BookOpen },
  { id: "foundations", label: "基础规范", icon: Palette },
  { id: "components", label: "组件", icon: SquaresFour },
  { id: "guidelines", label: "内容与行为", icon: Article },
  { id: "patterns", label: "页面模式", icon: Rows },
];

export function LabSidebar({ activePage, onNavigate }) {
  return (
    <aside className="lab-sidebar">
      <header className="lab-brand">
        <span className="lab-brand__icon"><Flask size={20} weight="fill" aria-hidden="true" /></span>
        <span>
          <strong>UI Design Lab</strong>
          <small>视觉系统实验室</small>
        </span>
      </header>

      <section className="lab-suite-list" aria-label="设计套系">
        <div className="lab-sidebar-label">DESIGN SYSTEMS</div>
        <button className="lab-suite-card" type="button" aria-current="true">
          <span className="lab-suite-card__swatches" aria-hidden="true">
            <i />
            <i />
            <i />
          </span>
          <span>
            <strong>Quiet Workspace</strong>
            <small>静谧工作台</small>
          </span>
          <span className="lab-suite-card__index">01</span>
        </button>
        <div className="lab-future-suite">
          <Plus size={15} aria-hidden="true" />
          下一套系将在独立命名空间创建
        </div>
      </section>

      <nav className="lab-navigation" aria-label="Quiet Workspace 文档">
        <div className="lab-sidebar-label">QUIET WORKSPACE</div>
        {navigation.map((item) => {
          const Icon = item.icon;
          return (
            <button
              type="button"
              key={item.id}
              data-active={activePage === item.id ? "true" : "false"}
              aria-current={activePage === item.id ? "page" : undefined}
              onClick={() => onNavigate(item.id)}
            >
              <Icon size={17} aria-hidden="true" />
              {item.label}
              <span>{item.id === "overview" ? "01" : ""}</span>
            </button>
          );
        })}
      </nav>

      <footer className="lab-sidebar__footer">
        <span className="lab-sidebar__status"><i />本地设计源</span>
        <small>Strongly isolated suites</small>
      </footer>
    </aside>
  );
}
