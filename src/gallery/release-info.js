import { version } from "../../package.json";

export const betaVersion = version;
export const packageFilename = `ui-design-lab-${version}.tgz`;
export const starterFilename = (suiteId, kitId) => `ui-design-lab-starter-${suiteId}${kitId ? `-${kitId}` : ''}-${version}.tgz`;

export function integrationSteps(suiteId, path = "new") {
  return path === "new"
    ? `# 在网站使用方式中下载 ${starterFilename(suiteId)}，放到新的空目录\ntar -xzf ${starterFilename(suiteId)}\nnpm install\nnpm run dev\n# 完成修改后验证\nnpm run build`
    : `# 在网站下载 ${packageFilename}，放到你的 React 18.2 / 19.2 项目根目录\nnpm install ./${packageFilename}\n# 按 API 示例导入组件、两份 CSS 和套系作用域\nnpm run build`;
}
