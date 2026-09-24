// 接入与场景导出共享设计方法；组件 API 只约束现有导出，不限制业务项目的新设计。
export function designAdoptionRules(suite) {
  return [
    `把 ${suite.displayName} 作为当前项目的设计语言，像这套体系的设计师一样处理需求，不把组件目录当作可设计范围的上限。`,
    suite.status === 'draft'
      ? `本套为 draft，尚无公开包入口；从实验室 systems/${suite.id} 读取与验证，不生成安装包导入指令。`
      : `先定位套系根目录：实验室为 systems/${suite.id}；已安装包为 node_modules/ui-design-lab/systems/${suite.id}。以实际使用版本为准。`,
    '依次读取 suite.json、DESIGN.md、standards/extension.md、foundations/tokens.json、foundations/token-bindings.json、standards/ 中相关规则，再读 API.md、web/index.d.ts 和相近组件源码。',
    '先根据用户任务确定内容优先级、导航、阅读或操作密度、主次区域和窄屏顺序。侧栏、顶部导航、全宽画布、阅读列与分栏按任务选择，不机械继承封面或示例的页面骨架。',
    '保持本套配色的语义、字阶、间距、表面层级、形状、图标、动效和交互原则。颜色、字号等数值查实际 Token 和绑定，不从宣传图取色或任意硬编码。',
    '需要自己的品牌配色时，在业务项目的主题层集中映射本套语义 Token，保留文字对比、表面层级和状态含义；不改写安装包，不以整页随意换色替代设计。',
    '已有组件合适时直接复用；局部差异优先组合；缺少组件时，在目标项目中设计并实现新的本地组件，沿用本套规则。禁止编造包导出或把本地新增组件声称为套系已有能力。',
    '本地扩展使用项目自己的组件名和 class，放在本套根作用域内，引用本套 CSS 变量；新增项目 Token 有明确业务语义和来源，不覆盖套系标准，不借用其他套系的视觉 Token 或组件。',
    '新组件补齐数据与回调、默认/悬停/按下/聚焦/禁用/加载/错误状态及键盘、窄屏行为；非交互容器说明由哪个子控件承载状态。业务服务与 UI 分开，失败保留用户输入。',
    '实施前简短说明设计依据、所选布局以及复用/组合/新增的分工，需求明确时直接推进。交付时说明新设计如何保持套系一致，并在目标项目运行相应构建和真实页面交互检查。',
  ].join('\n');
}

export function buildDesignContext(suite, designDocument, extensionGuide) {
  return [
    '## 设计任务与扩展方法',
    designAdoptionRules(suite),
    '',
    `## ${suite.displayName} 的设计原则（DESIGN.md）`,
    designDocument || '当前上下文未附规范正文，请先从目标版本的套系目录读取，不要猜测其设计原则。',
    '',
    `## ${suite.displayName} 的延伸规则（standards/extension.md）`,
    extensionGuide || '当前上下文未附扩展规则，请先从目标版本的套系目录读取，不要套用其他体系的规则。',
  ].join('\n');
}
