# 独立工作台

先在 UI Design Lab 运行 npm run build:package 和 npm pack。然后在本目录 npm install，npm run dev。

可替换 src/workbench/demo-data.js。接口边界见 WorkflowDemo 的本地模拟实现。业务组件只从已安装的 ui-design-lab 子路径导入。所有新增文件都在该独立目录；生成器拒绝覆盖已有目录。
