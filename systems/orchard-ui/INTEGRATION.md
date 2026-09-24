# Orchard UI 接入

使用 ui-design-lab/orchard-ui，引入同子路径的 tokens.css 与 components.css，并在根容器声明 data-ui-system="orchard-ui"。

入口 OrchardSettingsWorkspace；数据与回调见 web/index.d.ts。默认示例仅保存在内存，刷新重置。onSave(values, {signal}) 返回 Promise，成功值更新设置基线，失败抛出 Error；应监听 AbortSignal。

基础控件受控值由业务项目持有；同名类别组件不跨套导入。React 18.2 / 19.2 为目标兼容版本，验收记录保存在实验室仓库的 docs/EXPANSION-VALIDATION.md。
