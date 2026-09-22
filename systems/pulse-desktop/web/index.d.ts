import type { ReactElement, PointerEventHandler } from 'react';
export type PulseMode = 'compact' | 'expanded' | 'docked';
export type PulseDataState = 'ready' | 'loading' | 'error' | 'signed-out' | 'authorizing' | 'unsupported' | 'unavailable' | 'rate-limited';
export type PulseBotMood = 'idle' | 'working' | 'happy' | 'attention' | 'loading' | 'offline' | 'spent';
export interface PulseTask { id: string; title: string; state: 'running' | 'completed' | 'attention' | 'unavailable'; watched: boolean; detail?: string; canOpen?: boolean }
export interface PulseApplication { id: string; name: string; brandIcon?: string | null; brandLabel?: string; iconMode: 'brand' | 'robot'; remaining: number | null; tasks: PulseTask[]; quotaState: PulseDataState; taskState: PulseDataState; resetLabel?: string; sourceLabel?: string; notice?: string; persona?: string; shape?: string; quotaLabel?: string; quotaWindows?: {label:string;remaining:number;resetLabel:string}[]; authState?: 'connected' | 'signed-out' | 'authorizing' | 'error' | 'unsupported'; canAuthorize?: boolean; canDisconnect?: boolean; authorizationBlocked?: boolean; readMode?: 'auto' | 'web' | 'off' }
export function PulseQuotaRing(props: { remaining: number | null; state?: PulseDataState; botState?: PulseDataState; mood?: PulseBotMood; motionEnabled?: boolean; celebrating?: boolean; persona?: string; shape?: string; useLogo?: boolean; brandIcon?: string | null; brandLabel?: string; colorIndex?: number }): ReactElement;
export function PulseTaskRow(props: { task: PulseTask; onOpen?: (id: string) => void; onWatch?: (id: string) => void; disabled?: boolean; watchDisabled?: boolean }): ReactElement;
export function PulseDesktopDock(props: {
  applications?: PulseApplication[];
  onApplicationAccountAction?: (applicationId: string, action: 'authorize' | 'cancel-authorization' | 'disconnect-account' | 'resume-auto') => void;
  onApplicationIconChange?: (applicationId: string, mode: 'brand' | 'robot') => void;
  onApplicationOpenTask?: (applicationId: string, taskId: string) => void;
  onApplicationWatchTask?: (applicationId: string, taskId: string) => void;
  onApplicationRefresh?: (applicationId: string) => void;
  mode?: PulseMode; remaining?: number | null; tasks?: PulseTask[]; pinned?: boolean;
  dataState?: PulseDataState; disabled?: boolean; motionEnabled?: boolean; dockSide?: 'left' | 'right'; persona?: string; shape?: string; useLogo?: boolean;
  quotaState?: PulseDataState; taskState?: PulseDataState; resetLabel?: string; sourceLabel?: string; notice?: string;
  onModeChange?: (mode: PulseMode) => void; onPinnedChange?: (pinned: boolean) => void;
  onOpenTask?: (id: string) => void; onWatchTask?: (id: string) => void; onRetry?: () => void;
  onRefresh?: () => void;
  onDragStart?: PointerEventHandler<HTMLButtonElement>;
}): ReactElement;
