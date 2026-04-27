/** CommandPalette 상태 — 최소. open · query 만. cursor 는 RouteGrid 내부 Listbox 가 소유. */

export type State = { open: boolean; query: string }

export type Action =
  | { type: 'toggle' }
  | { type: 'close' }
  | { type: 'query'; value: string }

export const INITIAL: State = { open: false, query: '' }

export function reducer(s: State, a: Action): State {
  switch (a.type) {
    case 'toggle': return { open: !s.open, query: '' }
    case 'close':  return { ...s, open: false }
    case 'query':  return { ...s, query: a.value }
  }
}

export const keymap = { Escape: { type: 'close' } } as const satisfies Record<string, Action>
