import {useEffect, useState} from 'react';
import {betaVersion} from './release-info.js';

export function useDeliveryManifest() {
  const [manifest, setManifest] = useState(null);
  const [failed, setFailed] = useState(false);
  const [attempt, setAttempt] = useState(0);
  const base = `${import.meta.env.BASE_URL}downloads/`;
  useEffect(() => {
    const controller = new AbortController();
    setManifest(null);
    setFailed(false);
    fetch(`${base}manifest.json`, {signal:controller.signal, cache:'no-cache'})
      .then(response => {if (!response.ok) throw new Error('清单不可用'); return response.json();})
      .then(value => {
        if (value.version !== betaVersion || !Array.isArray(value.artifacts)) throw new Error('版本不匹配');
        if (!controller.signal.aborted) setManifest(value);
      })
      .catch(() => {if (!controller.signal.aborted) setFailed(true);});
    return () => controller.abort();
  }, [base, attempt]);
  return {manifest, failed, base, retry:() => setAttempt(value => value + 1)};
}
