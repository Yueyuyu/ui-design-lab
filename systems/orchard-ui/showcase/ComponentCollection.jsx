import { useState } from 'react';
import { Bell, Moon, SpeakerHigh } from '@phosphor-icons/react';
import * as Kit from '../web/index.js';
import { applicationExamples, commandExamples } from './icon-examples.js';
import './collection.css';

export function OrchardCollection() {
  const [selected, setSelected] = useState('star');
  const [notifications, setNotifications] = useState(true);
  const [volume, setVolume] = useState(64);
  const [message, setMessage] = useState('选择一个应用或操作，试试它的反馈。');
  return <div className="ou-collection">
    <div className="ou-collection-column"><Kit.OrchardAppLauncher items={applicationExamples} onLaunch={item => setMessage(`已选择${item.name} · 演示入口`)} /><Kit.OrchardNotification title="文件已准备好" description="设计资料 · 12 个文件" actionLabel="查看" onAction={() => setMessage('已选择查看资料 · 演示反馈')} /></div>
    <div className="ou-collection-column"><Kit.OrchardCommandMenu items={commandExamples} onSelect={item => setMessage(`已选择${item.label} · 演示反馈`)} /><Kit.OrchardSettingsGroup title="声音与专注"><Kit.OrchardSettingRow title="音量" icon={SpeakerHigh}><Kit.OrchardSlider label="输出音量" value={volume} onChange={setVolume} unit="%" /></Kit.OrchardSettingRow><Kit.OrchardSettingRow title="专注模式" icon={Moon}><Kit.OrchardToggle label="启用" checked={!notifications} onChange={value => setNotifications(!value)} /></Kit.OrchardSettingRow></Kit.OrchardSettingsGroup></div>
    <div className="ou-collection-column"><Kit.OrchardIconPicker value={selected} onChange={setSelected} /><Kit.OrchardCard title="及时知道，安静完成"><Kit.OrchardSettingRow title="通知" icon={Bell}><Kit.OrchardToggle label="允许通知" checked={notifications} onChange={setNotifications} /></Kit.OrchardSettingRow><Kit.OrchardProgress label="资料整理" value={72} /></Kit.OrchardCard></div>
    <p className="ou-collection-status" role="status">{message}</p>
  </div>;
}
