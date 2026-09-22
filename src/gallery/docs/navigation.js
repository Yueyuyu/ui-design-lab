// 共享文档层级，不共享套系视觉或业务实现。旧地址仅用于兼容，不重复出现在菜单里。
export const documentationAliases = { 'components-plus':'components', workflows:'patterns/flows' };
export function createDocumentationNavigation({ theme = false } = {}) {
  const entries = [
    ['overview','套系总览','了解'], ['foundations','基础规范','了解'],
    ['components','组件目录','构建'], ['patterns','页面与流程','构建'], ['guidelines','设计与行为规范','构建'],
    ['playground','交互试验','试用与接入'], ...(theme ? [['theme','主题编辑','试用与接入']] : []), ['usage','接入指南','试用与接入']
  ];
  return entries.map(([id,label,group],index) => ({id,label,group,index:String(index+1).padStart(2,'0')}));
}
