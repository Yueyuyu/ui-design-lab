// 用户只交接目标和入口；获取、安装、设计与验证规则由仓库内的消费指南维护。
const guideUrl = 'https://raw.githubusercontent.com/Yueyuyu/ui-design-lab/main/skills/consume-suite/SKILL.md';

export function buildAgentInstruction({suite, kit}) {
  if (!/^[a-z][a-z0-9]*(?:-[a-z0-9]+)*$/.test(suite.id ?? '')) throw new Error('套系标识无效');
  if (suite.status === 'draft') throw new Error('开发中的套系尚不能生成接入指令');
  const sourceKit = kit?.preferred === suite.id ? kit : null;
  return [
    `请使用 UI Design Lab 的 ${suite.displayName} / ${suite.localizedName}（${suite.id}）设计我的项目。`,
    `先读取接入指南：${guideUrl}`,
    '请按指南自行读取规范并完成接入，再根据我的需求设计页面与组件。',
    ...(sourceKit ? [`可参考“${sourceKit.title}”示例，不必照搬布局。`] : []),
  ].join('\n');
}
