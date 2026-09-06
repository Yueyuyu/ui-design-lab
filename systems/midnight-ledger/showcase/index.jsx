import { BusinessPage, WorkflowPage, ThemePage } from "./WorkbenchPages.jsx";
import "../foundations/tokens.css";
import "../web/components.css";
import "./showcase.css";
import { ComponentsGallery } from "./ComponentsGallery.jsx";
import { FoundationsGallery } from "./FoundationsGallery.jsx";
import { GuidelinesGallery } from "./GuidelinesGallery.jsx";
import { OverviewGallery } from "./OverviewGallery.jsx";
import { PatternsGallery } from "./PatternsGallery.jsx";
import { PlaygroundGallery } from "./PlaygroundGallery.jsx";
import { UsageGallery } from "./UsageGallery.jsx";

export const navigation = [
 {id:"components-plus",label:"业务组件",index:"08"},{id:"workflows",label:"完整场景",index:"09"},{id:"theme",label:"主题编辑",index:"10"},
  { id: "overview", label: "总览", index: "01" },
  { id: "foundations", label: "基础规范", index: "02" },
  { id: "components", label: "组件与状态", index: "03" },
  { id: "guidelines", label: "内容与行为", index: "04" },
  { id: "patterns", label: "页面模式", index: "05" },
  { id: "playground", label: "Playground", index: "06" },
  { id: "usage", label: "使用指南", index: "07" }
];

export const pages = {
 "components-plus":BusinessPage, workflows:WorkflowPage, theme:ThemePage, overview: OverviewGallery, foundations: FoundationsGallery, components: ComponentsGallery, guidelines: GuidelinesGallery, patterns: PatternsGallery, playground: PlaygroundGallery, usage: UsageGallery };
