import { version } from "../../package.json";

export const betaVersion = version;
export const packageFilename = `ui-design-lab-${version}.tgz`;

export function integrationSteps(suiteId, path = "new") {
  const prepare = "# 在 UI Design Lab 源码根目录\nnpm ci\nnpm pack";
  return path === "new"
    ? `${prepare}\nnode scripts/create-starter.mjs --suite=${suiteId} --target=./my-workbench\ncd my-workbench\nnpm install\nnpm run dev\n# 修改 src/workbench/demo-data.js 后验证\nnpm run build`
    : `${prepare}\n\n# 切换到你的 React 19 项目，将下方路径替换为包的实际位置\nnpm install /绝对路径/${packageFilename}\n# 按下方 API 示例导入组件、两份 CSS 和套系作用域\nnpm run build`;
}
