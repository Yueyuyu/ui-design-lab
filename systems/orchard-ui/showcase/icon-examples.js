import filesArtwork from '../assets/orchard-files.png';
import musicArtwork from '../assets/orchard-music.png';

export const applicationExamples = [
  { id: 'files', name: '资料', symbol: 'folder', src: filesArtwork },
  { id: 'music', name: '音乐', symbol: 'music', src: musicArtwork },
  { id: 'notes', name: '笔记', symbol: 'notes', tone: 'amber' },
  { id: 'mail', name: '邮件', symbol: 'mail', tone: 'blue', badge: '3' },
  { id: 'photos', name: '相册', symbol: 'image', tone: 'violet' },
  { id: 'calendar', name: '日历', symbol: 'calendar', tone: 'rose' },
];

export const commandExamples = [
  { id: 'note', label: '新建笔记', description: '从一个想法开始', symbol: 'notes', shortcut: '↵' },
  { id: 'files', label: '查找资料', symbol: 'folder' },
  { id: 'focus', label: '开始专注', symbol: 'moon' },
  { id: 'settings', label: '偏好设置', symbol: 'settings' },
];
