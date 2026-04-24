import { useEffect, useMemo, useReducer, useRef, useId } from 'react'
import { useRouter } from '@tanstack/react-router'
import { Dialog } from './Dialog'
import { Combobox } from '../list/Combobox'
import { Listbox } from '../list/Listbox'
import { ROOT, type Event, type NormalizedData } from '../../core/types'
import { useShortcut } from '../../core/hooks/useShortcut'

type PaletteEntry = {
  id: string
  label: string
  to: string
  params?: Record<string, string>
}

type Intent = null | 'commit'

type State = {
  open: boolean
  query: string
  active: number
  length: number
  intent: Intent
}

type Action =
  | { type: 'toggle' }
  | { type: 'close' }
  | { type: 'query'; value: string }
  | { type: 'active'; value: number }
  | { type: 'move'; delta: number }
  | { type: 'setLength'; value: number }
  | { type: 'commit' }
  | { type: 'consume' }

const INITIAL: State = { open: false, query: '', active: 0, length: 0, intent: null }

const clamp = (n: number, max: number) => Math.max(0, Math.min(max, n))

function reducer(s: State, a: Action): State {
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

// 순수 데이터 — 함수·런타임 참조 0. JSON 직렬화 가능.
const keymap = {
  ArrowDown: { type: 'move', delta: +1 },
  ArrowUp:   { type: 'move', delta: -1 },
  Enter:     { type: 'commit' },
  Escape:    { type: 'close' },
} as const satisfies Record<string, Action>

export function CommandPalette() {
  const router = useRouter()
  const [state, dispatch] = useReducer(reducer, INITIAL)
  const { open, query, active, intent } = state
  const inputRef = useRef<HTMLInputElement>(null)
  const listId = useId()

  const entries = useMemo<PaletteEntry[]>(() => {
    const byId = (router as unknown as { routesById: Record<string, { id: string; options?: { staticData?: { palette?: { label: string; to: string; params?: Record<string, string> } } } }> }).routesById ?? {}
    return Object.values(byId)
      .map((r) => {
        const p = r.options?.staticData?.palette
        return p ? { id: r.id, label: p.label, to: p.to, params: p.params } : null
      })
      .filter((x): x is PaletteEntry => x !== null)
  }, [router])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return entries
    return entries.filter((e) => e.label.toLowerCase().includes(q))
  }, [entries, query])

  useEffect(() => {
    dispatch({ type: 'setLength', value: filtered.length })
  }, [filtered.length])

  useShortcut('mod+k', () => dispatch({ type: 'toggle' }))

  useEffect(() => {
    if (open) queueMicrotask(() => inputRef.current?.focus())
  }, [open])

  // intent 기반 effect 분리: reducer는 의도만 표시, navigate는 여기서.
  useEffect(() => {
    if (intent !== 'commit') return
    const entry = filtered[active]
    dispatch({ type: 'close' })
    if (entry) router.navigate({ to: entry.to, params: entry.params })
  }, [intent])

  // 어댑터: React 결합은 이 1지점에만.
  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const action = keymap[e.key as keyof typeof keymap]
    if (!action) return
    e.preventDefault()
    dispatch(action)
  }

  const activeId = filtered[active]?.id

  const listData: NormalizedData = useMemo(() => {
    const entities: NormalizedData['entities'] = { [ROOT]: { id: ROOT } }
    filtered.forEach((e, i) => {
      entities[e.id] = { id: e.id, data: { label: e.label, selected: i === active } }
    })
    return { entities, relationships: { [ROOT]: filtered.map((e) => e.id) } }
  }, [filtered, active])

  const dialogData: NormalizedData = useMemo(() => ({
    entities: { [ROOT]: { id: ROOT, data: { open, label: 'Command palette' } } },
    relationships: { [ROOT]: [] },
  }), [open])

  const onListEvent = (ev: Event) => {
    if (ev.type === 'activate') {
      const idx = filtered.findIndex((e) => e.id === ev.id)
      if (idx >= 0) { dispatch({ type: 'active', value: idx }); dispatch({ type: 'commit' }) }
    } else if (ev.type === 'navigate') {
      const idx = filtered.findIndex((e) => e.id === ev.id)
      if (idx >= 0) dispatch({ type: 'active', value: idx })
    }
  }

  const onDialogEvent = (ev: Event) => {
    if (ev.type === 'open' && !ev.open) dispatch({ type: 'close' })
  }

  return (
    <Dialog data={dialogData} onEvent={onDialogEvent}>
      <Combobox
        ref={inputRef}
        expanded={filtered.length > 0}
        controls={listId}
        activedescendant={activeId}
        value={query}
        onChange={(e) => dispatch({ type: 'query', value: e.currentTarget.value })}
        onKeyDown={onKeyDown}
        placeholder="Jump to…"
        aria-label="Search routes"
      />
      {filtered.length > 0 && (
        <Listbox id={listId} data={listData} onEvent={onListEvent} />
      )}
    </Dialog>
  )
}
