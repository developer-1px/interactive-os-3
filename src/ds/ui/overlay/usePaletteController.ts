import { useEffect, useMemo, useReducer, useRef } from 'react'
import { useRouter } from '@tanstack/react-router'
import type { Event } from '../../core/types'
import { INITIAL, keymap, reducer } from './paletteReducer'
import { usePaletteEntries } from './usePaletteEntries'
import { toDialogData, toListData } from './paletteAdapters'

/** CommandPalette 컨트롤러 — state + filtered entries + 어댑터 + 이벤트 핸들러를 모은다.
 *  컴포넌트는 여기 결과를 받아 widget 조립만 한다. */
export function usePaletteController() {
  const router = useRouter()
  const entries = usePaletteEntries()
  const [state, dispatch] = useReducer(reducer, INITIAL)
  const { open, query, active, intent } = state
  const inputRef = useRef<HTMLInputElement>(null)

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return entries
    return entries.filter((e) => e.label.toLowerCase().includes(q))
  }, [entries, query])

  useEffect(() => { dispatch({ type: 'setLength', value: filtered.length }) }, [filtered.length])
  useEffect(() => { if (open) queueMicrotask(() => inputRef.current?.focus()) }, [open])

  useEffect(() => {
    if (intent !== 'commit') return
    const entry = filtered[active]
    dispatch({ type: 'close' })
    if (entry) router.navigate({ to: entry.to, params: entry.params })
  }, [intent])

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const action = keymap[e.key as keyof typeof keymap]
    if (!action) return
    e.preventDefault()
    dispatch(action)
  }

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

  return {
    inputRef,
    open, query, filtered,
    activeId: filtered[active]?.id,
    listData: useMemo(() => toListData(filtered, active), [filtered, active]),
    dialogData: useMemo(() => toDialogData(open), [open]),
    setQuery: (v: string) => dispatch({ type: 'query', value: v }),
    toggle: () => dispatch({ type: 'toggle' }),
    onKeyDown, onListEvent, onDialogEvent,
  }
}
