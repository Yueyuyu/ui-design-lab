import { Bell, CalendarBlank, Camera, ChatCircle, CheckCircle, Cloud, DownloadSimple, Envelope, FileText, Folder, Gear, Globe, Heart, House, Image, MagnifyingGlass, Microphone, Moon, MusicNotes, NotePencil, ShieldCheck, Star, Timer, Users } from '@phosphor-icons/react';

// 稳定的语义 ID 是消费接口；只导入实际展示的符号，避免捆绑整套图标库。
export const orchardSymbols = [
  { id: 'folder', label: '文件夹', category: '内容', icon: Folder },
  { id: 'document', label: '文档', category: '内容', icon: FileText },
  { id: 'notes', label: '笔记', category: '内容', icon: NotePencil },
  { id: 'image', label: '图片', category: '内容', icon: Image },
  { id: 'camera', label: '相机', category: '媒体', icon: Camera },
  { id: 'music', label: '音乐', category: '媒体', icon: MusicNotes },
  { id: 'microphone', label: '录音', category: '媒体', icon: Microphone },
  { id: 'heart', label: '喜欢', category: '媒体', icon: Heart },
  { id: 'mail', label: '邮件', category: '沟通', icon: Envelope },
  { id: 'chat', label: '对话', category: '沟通', icon: ChatCircle },
  { id: 'people', label: '成员', category: '沟通', icon: Users },
  { id: 'bell', label: '通知', category: '沟通', icon: Bell },
  { id: 'home', label: '主页', category: '系统', icon: House },
  { id: 'settings', label: '设置', category: '系统', icon: Gear },
  { id: 'search', label: '搜索', category: '系统', icon: MagnifyingGlass },
  { id: 'shield', label: '安全', category: '系统', icon: ShieldCheck },
  { id: 'calendar', label: '日历', category: '效率', icon: CalendarBlank },
  { id: 'timer', label: '计时', category: '效率', icon: Timer },
  { id: 'check', label: '完成', category: '效率', icon: CheckCircle },
  { id: 'star', label: '收藏', category: '效率', icon: Star },
  { id: 'globe', label: '浏览器', category: '系统', icon: Globe },
  { id: 'cloud', label: '云端', category: '系统', icon: Cloud },
  { id: 'download', label: '下载', category: '系统', icon: DownloadSimple },
  { id: 'moon', label: '专注', category: '效率', icon: Moon },
];

export const symbolById = new Map(orchardSymbols.map(symbol => [symbol.id, symbol]));
