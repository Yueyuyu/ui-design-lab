import {useState} from 'react';
import {betaVersion} from './release-info.js';
import {downloadText} from './workbench/demo-data.js';

export function AdoptionFeedback({suite}) {
  const [result, setResult] = useState('');
  const [minutes, setMinutes] = useState('');
  const [blocker, setBlocker] = useState('');
  const [message, setMessage] = useState('');
  const labels = {'blocked':'安装或运行时遇到阻碍','starter':'已运行独立 Starter','project':'已在自己的业务项目运行','continued':'接入后继续修改并使用'};
  return <form className="adoption-feedback" onSubmit={event => {
    event.preventDefault();
    downloadText('adoption-feedback.md', `# UI Design Lab 采用记录\n\n日期：${new Date().toISOString().slice(0,10)}\n组件包：${betaVersion}\n套系：${suite.displayName} ${suite.version}\n记录来源：使用者自述，未经独立核验\n实际阶段：${labels[result]}\n首次运行耗时：${minutes ? `${minutes} 分钟` : '未记录'}\n\n## 卡住的步骤与期望\n\n${blocker || '未填写'}\n\n## 证据（检查后自行补充）\n\n构建结果：\n真实业务流程：\n后续修改：\n\n公开许可：未授权，默认不公开\n`);
    setMessage('记录已导出到本机，未发送。请检查内容后自行分享。');
  }}><h3>记录这次接入结果</h3><p>下载、运行 Starter、真实项目采用分别记录。只导出你填写的内容。</p>
    <label>目前完成到哪一步<select required value={result} onChange={event => setResult(event.target.value)}><option value="">请选择实际结果</option>{Object.entries(labels).map(([value,label]) => <option key={value} value={value}>{label}</option>)}</select></label>
    <label>首次运行耗时（分钟，可选）<input type="number" min="0" step="1" value={minutes} onChange={event => setMinutes(event.target.value)}/></label>
    <label>卡住的步骤与期望<textarea rows={3} value={blocker} onChange={event => setBlocker(event.target.value)} placeholder="无需填写项目私密信息"/></label>
    <button className="public-button" type="submit">导出本次接入记录</button><p role="status">{message}</p>
  </form>;
}
