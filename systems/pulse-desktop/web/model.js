export const modeLabels = { compact: '紧凑', expanded: '展开', docked: '贴边' };
export const taskLabels = { running: '执行中', completed: '已完成', attention: '需处理', unavailable: '暂不可用' };
export function botMood(tasks, dataState = 'ready') {
  if (dataState === 'error' || dataState === 'unsupported') return 'offline';
  if (dataState === 'loading') return 'loading';
  if (tasks.some(task => task.state === 'attention')) return 'attention';
  if (tasks.some(task => task.state === 'running')) return 'working';
  if (tasks.some(task => task.state === 'unavailable')) return 'offline';
  return 'idle';
}
export function newlyCompleted(previous, tasks) {
  return tasks.some(task => task.state === 'completed' && previous.some(before => before.id === task.id && before.state === 'running'));
}
export function quotaValue(remaining) {
  return typeof remaining === 'number' && Number.isFinite(remaining) ? Math.round(Math.min(100, Math.max(0, remaining))) : null;
}
export function quotaTone(remaining) {
  const value = quotaValue(remaining);
  return value === null ? 'unknown' : value === 0 ? 'spent' : value <= 25 ? 'critical' : value <= 50 ? 'caution' : 'healthy';
}
export function clampPosition(position, bounds, size, inset = 0) {
  return { x: Math.max(inset, Math.min(position.x, bounds.width - size.width - inset)), y: Math.max(inset, Math.min(position.y, bounds.height - size.height - inset)) };
}
export function dockingSide(position, bounds, size, threshold = 28) {
  if (position.x <= threshold) return 'left';
  if (bounds.width - position.x - size.width <= threshold) return 'right';
  return null;
}
