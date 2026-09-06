# 在新项目中使用 UI Design Lab

需要 Node.js 22+、npm 和 React / React DOM 19.2+。当前候选版本为 1.0.0-beta.1。Chromium、Firefox 153 与 WebKit 26.5 已有本地自动化证据；具体覆盖范围见 COMPATIBILITY.md，WebKit 不代表 Safari 实机验收。

如果收到 Beta Starter：解压到空目录，在有 package.json 的目录执行 `npm install`、`npm run dev` 即可。组件包已包含在 vendor/，无需克隆原仓库。修改 `src/workbench/demo-data.js` 的任务名和 `WorkflowDemo.jsx` 的列定义，然后执行 `npm run build`。

## 1. 生成本地组件包

在本仓库执行：

```sh
npm ci
npm run check
npm pack
```

生成 `ui-design-lab-1.0.0-beta.1.tgz`。当前保留 `private: true`，没有发布 npm 包；不要直接执行 `npm install ui-design-lab` 期待获取本仓库版本。npm pack 会先构建组件分发文件。

## 2. 从可运行示例开始

```sh
cd examples/consumer
npm install
npm run dev
```

示例运行于 http://127.0.0.1:5174，可切换四套 UI 和三个场景，包含任务、详情、用量、设置、研究资料与报表。它只导入组件包和组件 CSS，不依赖 Gallery。

也可以把 `examples/consumer` 复制到新目录，然后将该项目的 `ui-design-lab` 依赖改为 tgz 的实际路径：

```sh
npm install /绝对路径/ui-design-lab-1.0.0-beta.1.tgz
npm run build
```

也可直接生成独立目录（已存在的目标会被拒绝，不覆盖已有项目）：

```sh
node scripts/create-starter.mjs --target=../my-workbench --suite=clearline-console
```

省略 `--suite` 提供四套选择；进入新目录运行 npm install / npm run dev。生成文件独立，组件包复制到 vendor/ 并使用相对路径，可以将完整目录交给其他机器。生成前若未运行 npm pack，将报出缺失包路径且不创建半成品。任务、上传和报表业务接口边界见 [场景交付](docs/SCENARIO-DELIVERY.md)。

## 3. 在现有 React 项目中接入

```jsx
import { QuietButton } from "ui-design-lab/quiet-workspace";
import "ui-design-lab/quiet-workspace/tokens.css";
import "ui-design-lab/quiet-workspace/components.css";

export function Page() {
  return (
    <main data-ui-system="quiet-workspace" data-density="comfortable">
      <QuietButton onClick={() => console.log("保存")}>保存</QuietButton>
    </main>
  );
}
```

Midnight Ledger 对应 `ui-design-lab/midnight-ledger`、`LedgerButton` 与 `data-ui-system="midnight-ledger"`。不要跨套系导入 Token 或组件；在 Gallery 或示例中比较时，分别放入两个独立作用域。

密度为 `comfortable` 或 `compact`。Dialog 保留触发位置的密度，自动进入原生模态层并恢复焦点，不需要业务方手动搬动 DOM。

组件包提供 ESM、React peerDependencies 和套系子路径 TypeScript 声明。构建文件中不会打包第二份 React。按需导入套系子路径；根入口用于兼容命名空间导入。

## 4. 查看组件 API

- [Quiet Workspace API](systems/quiet-workspace/API.md)
- [Midnight Ledger API](systems/midnight-ledger/API.md)
- [Clearline Console API](systems/clearline-console/API.md)
- [Signal Studio API](systems/signal-studio/API.md)
- 各套系 `web/index.d.ts`：参数类型、回调签名和泛型约束。

给 Codex 的上下文位于本仓库 `systems/<suite-id>/`；安装后位于 `node_modules/ui-design-lab/systems/<suite-id>/`。优先读取 suite.json、DESIGN.md、foundations、standards、API.md 和 web 源码。

## 5. 验证分发结果

```sh
npm run test:consumer
```

该命令将包安装到操作系统临时目录的新项目并构建，避免父目录依赖掩盖问题。命令需要访问 npm；打印生成的临时项目路径供复查。

参考截图及其缩略图不包含在组件包中，授权范围见 [NOTICE.md](NOTICE.md)。

## 6. 生成 Beta 交付目录

执行 `npm run release:prepare`，完成工程与 Sites 检查后在 dist/releases/ 下生成独立候选目录，含组件包、四套 Starter、静态演示站、说明及 SHA256SUMS.txt。浏览器测试和真实试用是另一个验收层；生成候选目录不会提交、推送或发布。
