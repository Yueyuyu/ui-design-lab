# Dialogue UI 接入

使用 ui-design-lab/dialogue-ui，引入同子路径的 tokens.css 与 components.css，并在根容器声明 data-ui-system="dialogue-ui"。

入口 DialogueChatWorkspace；数据与回调见 web/index.d.ts。默认示例仅保存在内存，刷新重置。onSend(prompt, {signal, conversationId, messages}) 返回 Promise<string>；应监听 AbortSignal。停止或切换后迟到结果被忽略；真实 AI 服务由你的项目提供。

基础控件受控值由业务项目持有；同名类别组件不跨套导入。React 18.2 / 19.2 为目标兼容版本，验收记录保存在实验室仓库的 docs/EXPANSION-VALIDATION.md。
