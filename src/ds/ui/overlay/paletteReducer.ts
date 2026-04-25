/** CommandPalette 상태 머신 — 순수. React/router 의존 없음. */

export type Intent = null | 'commit'

export type State = {
  open: boolean
  query: string
  active: number
  length: number
  intent: Intent
}

export type Action =
  | { type: 'toggle' }
  | { type: 'close' }
  | { type: 'query'; value: string }
  | { type: 'active'; value: number }
  | { type: 'move'; delta: number }
  | { type: 'setLength'; value: number }
  | { type: 'commit' }
  | { type: 'consume' }

export const INITIAL: State = { open: false, query: '', active: 0, length: 0, intent: null }

const clamp = (n: number, max: number) => Math.max(0, Math.min(max, n))

export function reducer(s: State, a: Action): State {
  switch (a.type) {
    case 'toggle':    return { ...s, open: !s.open, query: '', active: 0, intent: null }
    case 'close':     return { ...s, open: false, intent: null }
    case 'query':     return { ...s, query: a.value, active: 0 }
    case 'active':    return { ...s, active: clamp(a.value, s.length - 1) }
    case 'move':      return { ...s, active: clamp(s.active + a.delta, s.length - 1) }
    case 'setLength': return { ...s, length: a.value, active: clamp(s.active, a.value - 1) }
    case 'commit':    return s.length > 0 ? { ...s, intent: 'commit' } : s
    case 'consume':   return { ...s, intent: null }
  }
}

/** 키 → action. 순수 데이터, JSON 직렬화 가능. */
export const keymap = {
  ArrowDown: { type: 'move', delta: +1 },
  ArrowUp:   { type: 'move', delta: -1 },
  Enter:     { type: 'commit' },
  Escape:    { type: 'close' },
} as const satisfies Record<string, Action>
