import { useCallback, useEffect, useState } from 'react';
import { createFolioDocument, validateFolioDocument } from './model.js';

function readDocument(storageKey) {
  if (!storageKey) return { document: createFolioDocument(), status: 'session', error: null };
  try {
    const raw = localStorage.getItem(storageKey);
    return { document: raw ? validateFolioDocument(JSON.parse(raw)) : createFolioDocument(), status: 'saved', error: null };
  } catch {
    return { document: createFolioDocument(), status: 'error', error: 'read' };
  }
}
export function useFolioStorage(storageKey) {
  const [state, setState] = useState(() => readDocument(storageKey));
  const [attempt, setAttempt] = useState(0);
  const setDocument = useCallback(update => setState(previous => ({ ...previous,
    document: typeof update === 'function' ? update(previous.document) : update,
    status: storageKey && previous.error !== 'read' ? 'saving' : previous.status,
  })), [storageKey]);
  useEffect(() => {
    // 读取失败时不能拿示例自动覆盖原始数据。重试先重新读取。
    if (!storageKey || state.error === 'read') return;
    const timer = setTimeout(() => {
      try {
        localStorage.setItem(storageKey, JSON.stringify(state.document));
        setState(previous => ({ ...previous, status: 'saved', error: null }));
      } catch { setState(previous => ({ ...previous, status: 'error', error: 'write' })); }
    }, 250);
    return () => clearTimeout(timer);
  }, [storageKey, state.document, state.error === 'read', attempt]);
  // 卸载/刷新前同步落盘，避免 debounce 窗口丢失最后一次输入。
  useEffect(() => {
    const flush = () => { if (storageKey && state.error !== 'read') { try { localStorage.setItem(storageKey, JSON.stringify(state.document)); } catch { /* 可见错误由正常保存流程展示。 */ } } };
    window.addEventListener('pagehide', flush);
    return () => { window.removeEventListener('pagehide', flush); flush(); };
  }, [storageKey, state.document, state.error]);
  const retry = () => state.error === 'read' ? setState(readDocument(storageKey)) : setAttempt(value => value + 1);
  return { ...state, setDocument, retry };
}
