import {packageFilename,starterFilename} from './release-info.js';

export function suiteImportExample(suite) {
 const component=suite.starter?.component ?? `${suite.componentPrefix}Button`;
 const content=suite.starter?.component ? `<${component} ${Object.entries(suite.starter.props ?? {}).map(([key,value])=>`${key}={${JSON.stringify(value)}}`).join(' ')} />` : `<${component}>开始使用</${component}>`;
 return `import { ${component} } from 'ui-design-lab/${suite.id}';\nimport 'ui-design-lab/${suite.id}/tokens.css';\nimport 'ui-design-lab/${suite.id}/components.css';\n\nexport default function App() {\n  return (\n    <main data-ui-system="${suite.id}" data-density="${suite.densities[0]}" style={{padding: 24, minHeight: '100vh'}}>\n      ${content}\n    </main>\n  );\n}`;
}
export function onboardingSteps(suite,path,kit) {
 if(path==='existing') return [
  {title:'下载组件包',context:'使用下载按钮。包内包含设计原则、扩展方法、Token、组件、类型与源码，既可直接复用，也可指导 Codex 设计新页面和新组件。',location:'浏览器下载目录'},
  {title:'安装到现有项目',context:`把 ${packageFilename} 放到你的 React 18.2 / 19.2 项目根目录，再安装。`,location:'你的 React 项目目录',code:`npm install ./${packageFilename}`},
  {title:'使用第一个组件',context:'新建页面或按需合并到 src/App.jsx。保留现有业务代码。',location:'src/App.jsx',code:suiteImportExample(suite),language:'jsx',collapsed:true},
  {title:'构建并检查',context:'构建后用项目自己的启动命令检查页面、保存和错误恢复。',location:'你的 React 项目目录',code:'npm run build'}
 ];
 return [
  {title:'下载所选 Starter',context:'下载独立工作台，已包含所选套系及 vendor/ 组件包。',location:'浏览器下载目录'},
  {title:'解压到新目录',context:'把下载文件放进一个新的空目录。在该目录打开终端执行；也可使用解压工具。',location:'新的空目录',code:`tar -xzf ${starterFilename(suite.id,kit?.id)}`},
  {title:'安装并启动',context:'打开终端显示的本地地址，体验完整工作台。',location:'解压后的目录',code:'npm install\nnpm run dev'},
  {title:'修改内容，验证构建',context:suite.starter?.component?'在 src/main.jsx 配置数据与保存回调，按 integration.md 接入服务。另开终端执行构建。':'在 src/workbench/demo-data.js 修改示例数据，另开终端执行构建。',location:'解压后的目录',code:'npm run build'}
 ];
}
