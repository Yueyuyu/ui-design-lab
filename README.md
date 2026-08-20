# UI Design Lab

一个“单仓库、多套系、强隔离”的 UI 设计系统实验室。每套设计拥有独立的 Token、组件、模式、文档和版本边界；只有 Gallery 与构建工具可以共享。

## 当前套系

### Suite 01 · Quiet Workspace / 静谧工作台

温润编辑感、克制效率工具和轻量桌面原生感的组合。核心特征包括暖白纸张表面、鼠尾草绿、清楚但克制的细边线、与信息类型匹配的状态载体和短促缓出的动效。当前版本为 `v0.3.0`。

- 视觉母版：`references/quiet-workspace-source.png`
- 套系文档：`systems/quiet-workspace/README.md`
- 设计 Token：`systems/quiet-workspace/foundations/tokens.json`
- CSS Token：`systems/quiet-workspace/foundations/tokens.css`
- Web 组件：`systems/quiet-workspace/web/`
- 组件七态契约：`systems/quiet-workspace/foundations/interaction-states.json`
- 状态载体与额度胶囊规范：`systems/quiet-workspace/standards/status-semantics.md`
- 图标、图表、中文文案与动效规范：`systems/quiet-workspace/standards/`

Gallery 提供五个入口：总览、基础规范、组件、内容与行为、页面模式。深色渐变桌面背景仅存在于 Gallery 展示场景，不属于任何 Quiet Workspace 核心 Token。

## 本地使用

```powershell
git clone https://github.com/Yueyuyu/ui-design-lab.git
cd .\ui-design-lab
npm install
npm run dev
```

完整检查：

```powershell
npm run check
npm run test:sites
```

## 新增套系

1. 在 `systems/<suite-id>/` 建立独立目录。
2. 为 Token、类名和组件使用独立前缀。
3. 将全部 CSS 限定在独立的 `data-ui-system` 作用域内。
4. 不允许引用其他套系的 Token、组件或视觉资产。
5. 只在 `src/` 的 Gallery 中注册展示入口。

当前 `quiet-workspace` 的命名空间为：

- 套系 ID：`quiet-workspace`
- CSS 作用域：`[data-ui-system="quiet-workspace"]`
- Token 前缀：`--qw-`
- 组件类名前缀：`.qw-`
