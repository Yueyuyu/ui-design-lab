import {DownloadSimple} from '@phosphor-icons/react';
import {betaVersion, packageFilename, starterFilename} from './release-info.js';
import {recordEvent} from './telemetry.js';
import {useDeliveryManifest} from './useDeliveryManifest.js';

export function DownloadArtifact({suite, path = 'existing', kit}) {
  const {manifest, failed, base, retry} = useDeliveryManifest();
  const filename = path === 'new' ? starterFilename(suite.id, kit?.id) : packageFilename;
  const artifact = manifest?.artifacts.find(item => item.filename === filename);
  if (failed || (manifest && !artifact)) return <div className="download-artifact" role="status"><p>下载暂不可用，请重新加载或使用源码方式。</p><button type="button" onClick={retry}>重新加载下载</button></div>;
  if (!artifact) return <p role="status">正在准备下载信息…</p>;
  return <div className="download-artifact">
    <a className="public-button public-button--primary" href={`${base}${filename}`} download={filename} onClick={() => recordEvent('artifact_download', {suiteId:suite.id, kitId:kit?.id, path})}><DownloadSimple size={16}/>{path === 'new' ? '下载独立 Starter' : '下载组件包'}</a>
    <small>{betaVersion} · {(artifact.bytes / 1024).toFixed(0)} KB · 本站构建</small>
    <details><summary>完整性与版本</summary><p>SHA-256</p><code>{artifact.sha256}</code><p>Beta 本地交付，未发布至 npm。Starter 自带组件包；安装依赖需要网络。</p></details>
  </div>;
}
