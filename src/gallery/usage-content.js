import {suiteApiContext} from "./ai-context.js";
import { integrationSteps } from "./release-info.js";
export function suiteUsage(suite) {
  const namespace = suite.id;
  return {
    install: integrationSteps(namespace, "existing"),
    prompt: [
      "使用 UI Design Lab 的 " + namespace + " 套系实现当前页面。",
      suiteApiContext(suite),
      "",
      "先定位套系根目录：本仓库使用 systems/" + namespace + "；安装包后使用 node_modules/ui-design-lab/systems/" + namespace + "。",
      "读取 suite.json、DESIGN.md、foundations/、standards/、API.md 与 web/index.d.ts；需要行为细节时查看 web/ 源码。",
      "通过 ui-design-lab/" + namespace + " 导入组件，并导入对应 tokens.css 和 components.css。",
      "使用 " + suite.scope + " 及 --" + suite.prefix + "-* Token；禁止混入其他套系。",
      "在消费项目运行构建和测试；修改本仓库时额外运行 npm run check。",
    ].join("\n"),
  };
}
