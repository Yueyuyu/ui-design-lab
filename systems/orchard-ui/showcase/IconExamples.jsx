import { useState } from 'react';
import * as Kit from '../web/index.js';
import { applicationExamples, commandExamples } from './icon-examples.js';

export function IconExample({ entry, state = 'default' }) {
  const [value, setValue] = useState('music');
  const [message, setMessage] = useState('');
  const boundary = { disabled: state === 'disabled', loading: state === 'loading', error: state === 'error' ? '暂未完成，请保留选择并重试。' : undefined };
  if (entry.suffix === 'Symbol') return <div className="ou-symbol-specimen">{Kit.orchardSymbols.slice(0, 12).map(item => <Kit.OrchardSymbol key={item.id} name={item.id} size={28} label={item.label} />)}</div>;
  if (entry.suffix === 'AppIcon') return <div className="ou-artwork-specimen">{applicationExamples.slice(0, 4).map(item => <Kit.OrchardAppIcon key={item.id} {...item} label={item.name} size={66} />)}</div>;
  if (entry.suffix === 'IconPicker') return <Kit.OrchardIconPicker {...boundary} value={value} onChange={setValue} />;
  return <div className="ou-example-stack">{entry.suffix === 'AppLauncher' ? <Kit.OrchardAppLauncher {...boundary} items={applicationExamples} onLaunch={item => setMessage(`已选择「${item.name}」，业务项目在 onLaunch 中接入导航。`)} /> : <Kit.OrchardCommandMenu {...boundary} items={commandExamples} onSelect={item => setMessage(`已选择「${item.label}」，业务项目在 onSelect 中执行操作。`)} />}<span role="status">{message}</span></div>;
}

export const iconExamples = Object.fromEntries(['Symbol', 'AppIcon', 'IconPicker', 'AppLauncher', 'CommandMenu'].map(name => ['Orchard' + name, IconExample]));
