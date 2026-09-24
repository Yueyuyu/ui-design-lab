import { Fragment } from 'react';
import { ComponentNavigation } from './docs/ComponentNavigation.jsx';
import {
  Article,
  BookOpen,
  Flask,
  Gear,
  Palette,
  Rows,
  SquaresFour,
  TestTube
} from "@phosphor-icons/react";

const navigationIcons = {
  overview: BookOpen,
  foundations: Palette,
  components: SquaresFour,
  guidelines: Article,
  patterns: Rows,
  playground: TestTube,
  usage: Gear
};

export function LabSidebar({ currentSuite, navigation = [], componentEntries=[], activePage, activeSection, onCatalog, onNavigate }) {
  const browsingComponents=activePage==='components'&&!!activeSection&&componentEntries.length>0;
  return (
    <aside className={`lab-sidebar${browsingComponents?' lab-sidebar--components':''}`}>
      <button className="lab-brand" type="button" onClick={onCatalog} aria-label="返回 UI Design Lab 首页">
        <span className="lab-brand__icon"><Flask size={20} weight="fill" aria-hidden="true" /></span>
        <span><strong>UI Design Lab</strong><small>视觉系统实验室</small></span>
      </button>

      <section className="lab-active-suite" aria-label="当前设计套系">
        <span className="lab-active-suite__swatches" aria-hidden="true">
          {currentSuite.swatches.slice(0, 3).map((color) => <i key={color} style={{ backgroundColor: color }} />)}
        </span>
        <span><strong>{currentSuite.displayName}</strong><small>{currentSuite.localizedName}</small></span>
        <em>当前套系</em>
      </section>

      <nav className="lab-navigation" aria-label={`${currentSuite.displayName} 文档`}>
        {navigation.map((item, index) => {
          const Icon = navigationIcons[item.id] ?? BookOpen;
          return (
            <Fragment key={item.id}>
            {item.group !== navigation[index - 1]?.group && <div className="lab-sidebar-label">{item.group}</div>}
            <button
              type="button"
              key={item.id}
              data-active={activePage === item.id ? "true" : "false"}
              aria-current={activePage === item.id ? "page" : undefined}
              onClick={() => onNavigate(item.id)}
            >
              <Icon size={17} aria-hidden="true" />{item.label}<span>{item.index}</span>
            </button>
            </Fragment>
          );
        })}
      </nav>

      {browsingComponents&&<div className="lab-component-browser"><ComponentNavigation key={currentSuite.id} entries={componentEntries} suiteId={currentSuite.id} activeId={activeSection}/></div>}

      <footer className="lab-sidebar__footer">
        <span className="lab-sidebar__status"><i />本地设计源</span>
        <small>Registry-driven isolated suites</small>
      </footer>
    </aside>
  );
}
