import {suiteApiContext} from "./ai-context.js";
import { integrationSteps } from "./release-info.js";
export function suiteUsage(suite) {
  const namespace = suite.id;
  const isDraft = suite.status === 'draft';
  return {
    install: isDraft ? "本套为设计验证草案，尚无公开包入口。请在实验室中查看与验证。" : integrationSteps(namespace, "existing"),
    prompt: [
      "以 UI Design Lab 的 " + namespace + " 为设计基础，为我的产品设计页面和所需组件。",
      suiteApiContext(suite),
      "",
      "读取 suite.json、DESIGN.md、standards/extension.md、foundations/、其他相关 standards、API.md 与 web/index.d.ts；需要行为细节时查看 web/ 源码。",
      "使用 " + suite.scope + " 及 --" + suite.prefix + "-* Token；禁止混入其他套系。",
      ...(isDraft ? [
        "从 systems/" + namespace + " 读取源码，不使用不存在的包导出。在实验室运行 npm run suite:check，并验证本地页面与宿主适配。",
      ] : [
        "通过 ui-design-lab/" + namespace + " 导入现有组件，并导入对应 tokens.css 和 components.css。本地新增组件从业务项目自身目录导入。",
        "消费技能：node_modules/ui-design-lab/skills/consume-suite/SKILL.md。",
        "消费项目静态入口检查：node node_modules/ui-design-lab/scripts/check-consumer.mjs --suite=" + namespace + " --source=src。然后运行项目自己的构建和测试；修改实验室时额外运行 npm run suite:check。",
      ]),
    ].join("\n"),
  };
}
