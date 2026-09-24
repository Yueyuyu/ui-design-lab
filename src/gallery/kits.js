// 应用示例的用途、操作与入口同源；套系名称和版本仍从 suites 注册表读取。
export const kits = [
  {
    "id": "preferences",
    "demoNote": "这是产品设置页的交互示例；所有修改只影响本次演示，不会改变 UI Design Lab 或你的设备设置。",
    "purpose": "为产品设置页提供参考，展示分类导航、分组表单，以及修改后的保存与取消。",
    "trySteps": [
      "搜索或切换设置分类",
      "调整选项，观察待保存状态",
      "保存更改，或取消恢复原值"
    ],
    "title": "个人偏好与设置",
    "category": "tasks",
    "description": "使用分组设置调整偏好，保存或取消更改。",
    "features": [
      "分类导航与搜索",
      "分组设置与密度",
      "保存与取消"
    ],
    "preferred": "orchard-ui",
    "route": "#/systems/orchard-ui/overview",
    "capture": ".ou-workspace",
    "boundary": "源于 Apple 理念的独立 Web 实现；默认仅在内存保存，可通过 onSave 接入业务服务。"
  },
  {
    "id": "conversation",
    "purpose": "为对话产品提供参考，展示会话组织、消息阅读，以及发送、停止和重试的反馈。",
    "trySteps": [
      "新建或切换一个会话",
      "输入问题，查看本地示例回复",
      "尝试停止回复并继续提问"
    ],
    "title": "对话与研究助手",
    "category": "knowledge",
    "description": "从一个话题开始，连续输入、停止回复并管理会话。",
    "features": [
      "会话搜索与切换",
      "消息与输入区",
      "停止与失败重试"
    ],
    "preferred": "dialogue-ui",
    "route": "#/systems/dialogue-ui/overview",
    "capture": ".du-workspace",
    "boundary": "源于 ChatGPT 理念的独立 Web 实现；默认回复为本地演示，onSend 可接入消息服务，暂无流式解析。"
  },
  {
    "id": "projects",
    "purpose": "为项目管理页面提供参考，展示表格与侧开详情如何衔接编辑、保存和失败恢复。",
    "trySteps": [
      "搜索项目，打开右侧详情",
      "修改状态并保存到示例列表",
      "模拟保存失败，再尝试重试"
    ],
    "title": "项目运营工作台",
    "category": "tasks",
    "description": "在项目目录与右侧详情间处理状态，确认保存后回写同一记录。",
    "features": [
      "搜索与侧开详情",
      "异步保存与重试",
      "受控数据接入"
    ],
    "preferred": "clearline-console",
    "route": "#/systems/clearline-console/patterns/flows?kit=projects",
    "capture": ".cc-project-scenario > .cc-shell",
    "boundary": "本地保存适配器仅模拟返回结果；组件支持传入项目数据和异步保存函数，权限与审计由业务项目提供。"
  },
  {
    "id": "content",
    "purpose": "为内容管理页面提供参考，展示内容浏览、草稿编辑，以及保存后的修订反馈。",
    "trySteps": [
      "从内容列表打开一篇草稿",
      "编辑内容并保存修订",
      "模拟保存失败，检查草稿保留"
    ],
    "title": "内容编辑工作台",
    "category": "knowledge",
    "description": "从内容画布打开草稿，编辑、保存并查看本次修订。",
    "features": [
      "内容画布与列表",
      "失败保留草稿",
      "成功保存修订"
    ],
    "preferred": "signal-studio",
    "route": "#/systems/signal-studio/patterns/flows?kit=content",
    "capture": ".ss-content-scenario > .ss-shell",
    "boundary": "本地演示，刷新后恢复示例；支持传入内容和异步保存函数，不包含上传、正式发布或云端版本服务。"
  },
  {
    "id": "knowledge",
    "purpose": "为知识库提供参考，展示页面导航、内容块编辑，以及记录在不同视图中的组织方式。",
    "trySteps": [
      "选择页面，编辑内容块",
      "切换表格、看板与列表视图",
      "导出 JSON，保留本次整理结果"
    ],
    "previewBoundary": "独立体验仅保留本次会话，可导出 JSON；套系总览和下载后的工作台支持本浏览器保存，均不包含云同步与协作权限。",
    "title": "页面与研究资料台",
    "category": "knowledge",
    "description": "把页面、笔记和研究记录整理在同一个工作区。",
    "features": [
      "页面与内容块",
      "三种数据库视图",
      "草稿与 JSON 导出"
    ],
    "preferred": "folio-workspace",
    "route": "#/systems/folio-workspace/overview",
    "capture": ".fw-workspace",
    "boundary": "页面和草稿保存在此浏览器；云同步与协作权限需自行接入。"
  },
  {
    "id": "tasks",
    "purpose": "为任务管理页面提供参考，展示进度、详情、失败重试与用量信息如何组织。",
    "trySteps": [
      "打开任务，查看详情与进度",
      "重试失败任务，观察状态反馈",
      "切换到用量统计查看示例读数"
    ],
    "title": "任务与用量工作台",
    "category": "tasks",
    "description": "从任务列表进入详情，处理进度、失败重试和用量。",
    "features": [
      "任务详情与重试",
      "用量统计",
      "工作区设置"
    ],
    "preferred": "quiet-workspace",
    "route": "#/systems/quiet-workspace/patterns/flows?kit=tasks",
    "capture": ".workflow-demo > .qw-shell",
    "boundary": "任务执行使用本地模拟；接入真实任务服务后才能处理业务。"
  },
  {
    "id": "research",
    "purpose": "为资料管理页面提供参考，展示资料查找、正文编辑和版本记录的连续流程。",
    "trySteps": [
      "搜索并打开一份资料",
      "编辑正文并保存",
      "查看版本记录，尝试导入流程"
    ],
    "title": "研究与内容工作台",
    "category": "knowledge",
    "description": "集中管理研究资料，衔接导入、搜索、编辑与版本查看。",
    "features": [
      "资料导入与搜索",
      "内容编辑",
      "版本历史"
    ],
    "preferred": "quiet-workspace",
    "route": "#/systems/quiet-workspace/patterns/flows?kit=research",
    "capture": ".workflow-demo > .qw-shell",
    "boundary": "资料与上传为本地演示；文件存储和版本服务需自行接入。"
  },
  {
    "id": "reports",
    "purpose": "为数据分析页面提供参考，展示指标、日期筛选、明细表与导出流程的配合。",
    "trySteps": [
      "查看指标与明细报表",
      "调整日期筛选并保存视图",
      "导出 CSV，查看当前报表数据"
    ],
    "title": "运营分析与报表",
    "category": "reports",
    "description": "按日期查看指标和明细，保存筛选视图并导出报表。",
    "features": [
      "日期筛选",
      "保存视图",
      "CSV 导出"
    ],
    "preferred": "midnight-ledger",
    "route": "#/systems/midnight-ledger/patterns/flows?kit=reports",
    "capture": ".workflow-demo > .ml-shell",
    "boundary": "报表使用演示数据；视图可在本机保存，告警没有接入推送服务。"
  }
];
