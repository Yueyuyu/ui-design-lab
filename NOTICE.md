# 授权与第三方素材说明

本仓库原创程序代码、原创 Token 定义和原创说明文档按根目录 MIT License 提供；第三方材料不因被收录而获得 MIT 再授权。MIT 不授予第三方商标、产品品牌、商业外观或专有字体的使用权。

## 参考材料

| 范围 | 来源与用途 | 授权边界 |
|---|---|---|
| references/midnight-ledger-source.png、midnight-ledger-compact-source.png | TradeGenius 产品视觉参考 | 第三方产品截图，权利属于原权利人，不纳入本仓库 MIT 授权 |
| references/midnight-ledger-live-source.png | https://theclues.pro/cockpit 的界面采样 | 第三方页面截图，仅用于说明视觉来源；未宣称获得素材再授权 |
| references/folio-workspace-source.png | 2026-09-06 捕获 https://www.notion.com/help/what-is-a-block 的官方块布局示例 | 第三方截图仅供研究，权利属于原权利人，不纳入 MIT 或组件包；Folio 名称、示例与实现独立，不表示 Notion 关联或背书 |
| references/orchard-ui-source.png | 2026-09-18 捕获 Apple HIG 公开侧栏示例 | 仅用于研究，不纳入 MIT 或组件包；Orchard 为独立 Web 实现，不表示 Apple 关联或背书 |
| references/dialogue-ui-source.png、dialogue-ui-settings-source.png | 2026-09-18 捕获 ChatGPT 未登录公开界面 | 不含私人会话；仅用于研究，不纳入 MIT 或组件包；Dialogue 不表示 OpenAI 关联或背书 |
| references/quiet-workspace-source.png、comparison-workbench-source.png | 项目已有视觉母版 | 来源授权未单独核验，不承诺通过本仓库再授权 |
| references/thumbnails/*.webp | 早期母版缩略图，仅保留溯源，当前首页不使用 | 继承对应母版的权利边界 |
| references/thumbnails/*.png | 1140×720 原创组件场景实际截图 | 不含第三方参考截图；组件/图标仍遵循各自许可 |
| artifacts-*.png、implementation-*.png、design-qa-*.png、其他页面截图 | 项目展示和验收记录，可能包含第三方界面或标识 | 不作为可自由复用设计资产授权；复用前逐项核验 |

参考材料保留用于溯源和研究。拟将第三方截图、标识或相似产品外观用于对外产品时，应自行取得所需权利；可移除参考图片，组件包本身不分发这些材料。

## 依赖和字体

- React / React DOM、Vite、Phosphor React 图标等依赖遵循各自随包附带的许可证。项目许可证不替代依赖许可证。
- Phosphor 图标家族：https://phosphoricons.com/，使用 @phosphor-icons/react，依赖许可证为 MIT。
- 系统字体仅在 CSS 中引用，不随本仓库分发。Inter 也未内置字体文件；若自行引入，应同时保留其 SIL Open Font License。
- 展示中的 TradeGenius、CluesAI、Codex 等名称仅用于示例或来源标识，不表示关联或背书。

分发脚本只打包组件代码、规范、Token 和明确列入发布清单的原创资产，不打包 references、Gallery 或验收截图。

## 本轮新增原创视觉

2026-09-23 公共页头与目录新增 Noto Sans SC 可变字重 WOFF2 子集，来自 Google Fonts，适用 SIL Open Font License 1.1。字体、字符覆盖清单、来源说明及完整许可证位于 `src/gallery/fonts/`。该字体仅供 Gallery 公共层使用，不改变或随套系组件包分发；不得按本仓库 MIT License 重新许可字体。

公共页头 `src/gallery/assets/github-mark.svg` 为 GitHub 官方圆形品牌标志，2026-09-23 获取自 https://github.githubassets.com/favicons/favicon.svg ，原文件保持不变，仅用于指向本项目的 GitHub 仓库。不属于项目原创或 Phosphor 图标，GitHub 品牌权利仍归其权利人；品牌说明见 https://github.com/logos 。

references/clearline-console-source.png、references/signal-studio-source.png 为本项目通过内置图像生成工具生成并自主选定的设计参考；不包含第三方产品截图。Signal Studio 的 assets/field-notes.png、momentum.png、signals.png 为同流程生成的原创演示素材；应随分发保留本说明。它们不表示任何第三方品牌授权或商标清查。Phosphor 图标依其 MIT 许可，系统字体只声明字体栈，不捆绑商业字体文件。原两套参考截图仍仅供研究，未取得新的第三方再分发许可。首页使用真实组件封面，付费宣传不得直接使用未授权截图。

Signal Studio 的同名 `.webp` 是上述原创 PNG 的缩放/压缩衍生，不改变艺术内容；组件包包含这些 WebP。封面可在本地服务运行后执行 `npm run covers` 重建（需要已安装 Playwright Chromium）；本轮由内置浏览器捕获同一导出路由。

Orchard UI 的 `assets/orchard-files.png`、`assets/orchard-music.png` 为 2026-09-18 使用内置图像生成工具制作的原创应用图像，随组件包独立分发并适用本仓库 MIT License；复用时保留本说明。它们不是 Apple 官方软件图标、SF Symbols 或第三方品牌资产。`OrchardSymbol` 的语义符号来自 Phosphor，依其 MIT 许可。

## Pulse Desktop 原版适配（本机验证）

Pulse Desktop 的 OpenAI SVG 来自 qunqin24/Pulse / Lobe Icons，许可证与品牌声明位于 systems/pulse-desktop/licenses/Pulse-THIRD-PARTY-NOTICES.md。上游布局、配色、人格编排和动作移植遵循 Pulse Apache-2.0，许可证保存在同目录 Pulse-Apache-2.0.txt。修改为 JavaScript/SVG 和 Windows 宿主；无官方关联。

机器人原始几何及同源引擎第三方素材授权未解决，仅在 gitignored .local-cache 本机资源中，不包含在普通 Gallery/组件包/公开发布中。详见 systems/pulse-desktop/UPSTREAM.md，不能把根许可证用于覆盖该素材。
