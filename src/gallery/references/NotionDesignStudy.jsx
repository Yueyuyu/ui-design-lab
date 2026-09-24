import { ArrowLeft, ArrowSquareOut, DownloadSimple } from "@phosphor-icons/react";
import documentText from "../../../docs/design-references/notion-ui.md?raw";
import "./design-study.css";

const patterns = [
  { name: "页面是容器，块是内容", fact: "官方示例把正文、折叠列表、图片和数据库组合在同一页面中。", application: "先组织内容层级，再决定分组容器。阅读页面不必处处套卡片。" },
  { name: "同一份数据，多种视图", fact: "表格、看板、列表等呈现同一数据库；每个视图有自己的配置。", application: "记录保持一致，视图分别保存筛选、排序、分组和属性可见性。" },
  { name: "操作跟随当前内容", fact: "斜杠可选择块类型，块手柄可转换类型和拖动重排。", application: "菜单靠近编辑位置，同时补齐键盘和触摸入口，避免只有 hover 才能发现。" },
  { name: "详情有不同打开层级", fact: "Side peek 保留左侧列表可操作；Center peek 是模态；Full page 进入整页。", application: "连续处理用侧开，聚焦单条用模态，长文编辑用整页。三者不能使用相同焦点规则。" },
  { name: "正文与数据使用不同密度", fact: "官方示例使用正文、小标题和轻分隔线建立层级，数据库保留行列结构。", application: "正文控制阅读宽度，数据区按内容扩宽；层级来自排版与间距。" },
  { name: "复杂配置逐步展开", fact: "布局、属性、筛选、排序和分组集中在视图设置中。", application: "常用操作直接可见，复杂选项按任务展开，生效条件始终可查。" },
];
const groups = [
  { title: "导航与定位", items: ["工作区入口", "页面树", "面包屑", "快速搜索"] },
  { title: "页面与编辑", items: ["标题与属性", "正文与折叠块", "斜杠菜单", "块操作与重排"] },
  { title: "数据与详情", items: ["多视图切换", "表格与看板", "属性与筛选", "侧开与整页详情"] },
  { title: "反馈与协作", items: ["保存状态", "失败重试", "撤销恢复", "评论与权限（后续）"] },
];
const sources = [
  { title: "块与页面的组合方式", url: "https://www.notion.com/help/what-is-a-block" },
  { title: "数据库视图目录", url: "https://www.notion.com/help/category/database-views" },
  { title: "视图、筛选、排序与分组", url: "https://www.notion.com/help/views-filters-and-sorts" },
];
const suiteDirections = [
  ["静谧工作台", "文档层级、折叠内容与轻量操作", "保留后台任务、额度胶囊与温润阅读感"],
  ["午夜账盘", "筛选与连续查看详情", "保留高密度终端和收益方向语义"],
  ["澄明后台", "属性编辑、侧向详情与视图配置", "保留严格表格对齐与项目目录"],
  ["信号创作间", "内容块组合、素材属性与模板", "保留衬线排版、封面与横向导航"],
];

function downloadStudy() {
  const url = URL.createObjectURL(new Blob([documentText], { type: "text/markdown;charset=utf-8" }));
  const link = document.createElement("a");
  link.href = url;
  link.download = "notion-ui-design-reference.md";
  document.body.append(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export function NotionDesignStudy() {
  return <main className="design-study">
    <a className="design-study__back" href="#/usage"><ArrowLeft size={16} /> 返回使用方式</a>
    <header className="design-study__intro">
      <p className="design-study__eyebrow">设计参考 / NOTION</p>
      <h1>让内容组织起工作台</h1>
      <p>从页面、块与数据库视图，理解 Notion 的设计方式，并明确它可以怎样用于现有项目。</p>
      <div className="design-study__meta"><span>产品设计研究</span><span>核对日期 · 2026.09.06</span><span>已落地为 Folio Workspace</span></div>
      <button className="design-study__download" type="button" onClick={downloadStudy}><DownloadSimple size={17} /> 下载完整设计文档</button>
    </header>
    <p><a href="#/systems/folio-workspace/overview">打开 Folio Workspace / 页集工作台 →</a></p><div className="design-study__layout">
      <nav className="design-study__contents" aria-label="设计参考目录">{[["patterns", "设计规则"], ["components", "组件清单"], ["adoption", "项目应用"], ["delivery", "落地顺序"], ["sources", "官方来源"]].map(([id, label], index) => <button type="button" key={id} onClick={() => document.getElementById(`notion-${id}`)?.scrollIntoView({ behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth" })}><span>0{index + 1}</span>{label}</button>)}</nav>
      <div className="design-study__body">
        <section id="notion-patterns"><h2>值得借鉴的设计规则</h2><p>“来源观察”对应官方帮助文档与示例；“项目建议”是 UI Design Lab 的实现取舍。</p><div className="design-study__patterns">{patterns.map((pattern, index) => <article key={pattern.name}><span className="design-study__number">0{index + 1}</span><div><h3>{pattern.name}</h3><p><strong>来源观察</strong>{pattern.fact}</p><p><strong>项目建议</strong>{pattern.application}</p></div></article>)}</div></section>
        <section id="notion-components"><h2>组件与交互清单</h2><p>下面列出后续设计与验收的范围。完整文档逐项说明行为、七态与可访问性要求。</p><div className="design-study__component-groups">{groups.map(group => <article key={group.title}><h3>{group.title}</h3><ul>{group.items.map(item => <li key={item}>{item}</li>)}</ul></article>)}</div><p className="design-study__note">清单不代表当前已经导出的组件。协作、权限和同步需要真实后端支持。</p></section>
        <section id="notion-adoption"><h2>怎么应用到现有项目</h2><div className="design-study__table" role="region" aria-label="现有套系的设计借鉴" tabIndex={0}><table><thead><tr><th>套系</th><th>借鉴方向</th><th>保留的特点</th></tr></thead><tbody>{suiteDirections.map(row => <tr key={row[0]}>{row.map((cell, index) => index === 0 ? <th scope="row" key={cell}>{cell}</th> : <td key={cell}>{cell}</td>)}</tr>)}</tbody></table></div><p>新增页集工作台的识别点落在页面树、块编辑、多视图记录和详情联动上；首页继续遵循统一画幅与独立内部结构的展示规范。</p></section>
        <section id="notion-delivery"><h2>按完整流程分步落地</h2><ol className="design-study__delivery"><li><strong>研究与设计合同 <span>本次已整理</span></strong><p>官方来源、视觉观察、组件清单、状态规范与开发任务参考。</p></li><li><strong>核心工作台试验 <span>已实现本地流程</span></strong><p>建页面 → 写内容 → 插入块 → 建立记录集合 → 切换视图 → 侧开编辑。</p></li><li><strong>独立套系与本地验收 <span>已建立</span></strong><p>选定视觉源，建立自己的 Token、组件 API、七态和展示栏目，覆盖中文输入、键盘操作与失败恢复。</p></li><li><strong>协作与交付场景 <span>后续验证</span></strong><p>围绕知识库、研究资料台或客户项目门户，验证权限、版本历史、数据迁移与真实使用需求。</p></li></ol></section>
        <section id="notion-sources"><h2>官方来源与使用范围</h2><ul className="design-study__sources">{sources.map(source => <li key={source.url}><a href={source.url} target="_blank" rel="noreferrer">{source.title}<ArrowSquareOut size={15} /></a><span>notion.com / help</span></li>)}</ul><p>研究已核对官方文档及块布局示例，未登录编辑器验证协作与离线行为。建议尺寸不是 Notion 官方 Token；本页不包含私人工作区资料或第三方品牌资产。</p></section>
      </div>
    </div>
  </main>;
}
