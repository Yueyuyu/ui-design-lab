# Apple / ChatGPT 理念套系扩展验收

日期：2026-09-18。范围为本地实现、网站展示、组件分发和独立消费者验证；没有提交、推送、部署或真实业务采用。

## 本次交付

| 套系 | 公开组件 | 页面组合 | 当前入口 |
| --- | --- | --- | --- |
| Orchard UI / 果序 · Apple 风格 | 20 | OrchardSettingsWorkspace | #/systems/orchard-ui/components |
| Dialogue UI / 对谈 · ChatGPT 风格 | 21 | DialogueChatWorkspace | #/systems/dialogue-ui/components |

两套均为 experimental，版本 0.1.0，独立 Token、CSS 作用域、组件实现和类型声明。均提供浅色、舒适/紧凑密度；设置与对话是验证组件的页面组合，不限定套系只能用于该业务。新增后为 7 套、8 个公共场景。

来源见 [Orchard 研究](design-references/orchard-ui.md) 与 [Dialogue 研究](design-references/dialogue-ui.md)。布局、字号和数值是本项目面向 Web/中文的适配，不是第三方官方 Token。第三方参考图不进入组件 tarball。

## 有效执行结果

| 检查 | 结果与范围 |
| --- | --- |
| `npm run check` | 7 套隔离、JSON/CSS Token、文档/导出一致性、严格类型、组件包、网站构建通过；Node 28/28 |
| `npm run test:sites` | 4/4；dist/client/index.html、dist/server/index.js、dist/.openai/hosting.json 齐全 |
| 公共页面、采用路径、7 套组件详情与消费回归 | Chromium 43/43；后续按钮聚焦修正另由下方最终三浏览器回归覆盖 |
| `philosophy-suites.spec.mjs` 最终回归 | Chromium 8/8、Firefox 153 8/8、WebKit 26.5 8/8，同一批 24/24 |
| 独立消费者 | React 18.2.0、19.2.0 分别安装实际 tarball，严格类型和 Vite 构建通过；Chromium 各 5/5 |
| 独立场景 Starter | 两套场景归档分别解压到仓库外新目录，npm install、build 与包内 check-consumer 通过 |
| 本地下载 | 当前源码生成 16 个文件：1 个组件包、7 个套系 Starter、8 个场景 Starter；SHA-256 和大小写入 public/downloads/manifest.json |

本轮最终组件包 SHA-256：`9a76b6f60095ddd85ec62144480213b5ebca0e62f3ee2ca934c11cc2726dd7a2`。网站下载文件与用于独立消费的仓库根目录 tarball 哈希一致。工程检查日志位于 `.local-cache/expansion-check.log`，最终三浏览器运行目录为 `.local-cache/expansion-verified-browser`；最终包外运行目录为 `.local-cache/expansion-consumer18-verified` 与 `.local-cache/expansion-consumer19-verified`。

以上批次有重叠，不能累加成不重复测试总数。最初跨浏览器执行缺少 Playwright 浏览器二进制，安装对应版本后重跑；开发服务器并行导航超时的批次没有记为通过；保持原断言和超时限制，改为单服务、单 worker 后对最终 React 18/19 消费包分别重跑。最终三浏览器批次没有跳过或放宽断言。

## 验证过的交互

- Orchard：失败保留草稿，成功才更新保存基线，取消恢复，取消/卸载后拒绝忽略 AbortSignal 的迟到保存。
- Dialogue：中文组合输入不误发送，Shift+Enter 换行，停止后不再提交，失败重试不重复插入用户消息，切换后拒绝迟到回复，等待期间的新草稿不会被旧回复清空，搜索和复制可用。
- 两套：菜单方向键与 Escape，Tabs 跳过禁用项，分段首尾键，忙碌模态保持关闭可用、锁滚动和焦点恢复。
- 展示：全部 41 个新增组件与 2 个页面组合都有真实预览、参数、七态和源码。1440/900/390 宽度无页面横向溢出，减少动态模式生效。

修复的实际问题包括停止按钮切回发送后触发表单默认提交，以及 WebKit 点击按钮不默认聚焦导致的弹窗焦点恢复偏差。测试夹具故意使用不响应 AbortSignal 的适配器，避免只验证配合取消的演示服务。

## 消费方式与边界

通过 #/usage 选择套系下载 Starter 或组件包，按套系子路径导入。Agent 继续使用 suite.json → DESIGN.md → API.md / web/index.d.ts → 消费校验的路径；实验室运行 suite:check，消费项目运行包内 check-consumer。

默认设置和会话只在内存中；Dialogue 返回明确标注的本地示例。真实保存与消息服务分别由 onSave/onSend 接入。首版不含深色、流式协议、Markdown 引擎、云历史、认证、上传服务或原生移动手势。两套 comparison=null，明确暂不支持同场景对比。

包仍为本地 1.0.0-beta.1 候选，未发布 npm。WebKit 自动化不等于 Safari/iOS 实机验收，未进行屏幕阅读器或全站 WCAG 认证。后续 Linear、小米等仍为候选，没有生成空套系计入数量。
