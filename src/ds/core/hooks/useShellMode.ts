import { useSyncExternalStore } from 'react'

/** L0 — viewport를 단일 출처로 읽는 곳.
 *  --ds-shell-mobile-max 토큰이 정의한 폭 이하면 'mobile', 아니면 'desktop'.
 *  라우트/컴포넌트는 절대 window.matchMedia를 직접 호출하지 말고 이 훅만 쓴다. */

export type ShellMode = 'desktop' | 'mobile'

const QUERY_FALLBACK = '(max-width: 600px)'

function readQuery(): string {
  if (typeof window === 'undefined') return QUERY_FALLBACK
  const v = getComputedStyle(document.documentElement)
    .getPropertyValue('--ds-shell-mobile-max')
    .trim()
  return v ? `(max-width: ${v})` : QUERY_FALLBACK
}

function subscribe(cb: () => void): () => void {
  if (typeof window === 'undefined') return () => {}
  const mq = window.matchMedia(readQuery())
  mq.addEventListener('change', cb)
  return () => mq.removeEventListener('change', cb)
}

function getSnapshot(): ShellMode {
  if (typeof window === 'undefined') return 'desktop'
  return window.matchMedia(readQuery()).matches ? 'mobile' : 'desktop'
}

function getServerSnapshot(): ShellMode {
  return 'desktop'
}

export function useShellMode(): ShellMode {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
}
