import { useEffect, useMemo, useReducer, useRef } from 'react'
import { useRouter } from '@tanstack/react-router'
import type { Event } from '../../../core/types'
import { defineFlow, useFlow } from '../../../core/flow'
import { expandBranchOnActivate } from '../../../core/gesture'
import { INITIAL, keymap, reducer } from './paletteReducer'
import { usePaletteEntries } from './usePaletteEntries'
import { toDialogData, toListData } from './paletteAdapters'
import { makePaletteTree, toColumnsData } from './paletteTree'
import { paletteSelectionResource } from './paletteSelectionResource'

/** CommandPalette 컨트롤러 — query 모드(평탄 Listbox) + columns 모드(Miller).
 *  query.trim() 비면 columns 모드로 자동 전환. */
export function usePaletteController() {
  const router = useRouter()
  const entries = usePaletteEntries()
  const [state, dispatch] = useReducer(reducer, INITIAL)
  const { open, query, active, intent } = state
  const inputRef = useRef<HTMLInputElement>(null)
  const columnsHostRef = useRef<HTMLDivElement>(null)

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return entries
    return entries.filter((e) => e.label.toLowerCase().includes(q))
  }, [entries, query])

  const mode: 'query' | 'columns' = query.trim() === '' ? 'columns' : 'query'

  const tree = useMemo(() => makePaletteTree(entries), [entries])

  const flow = useMemo(
    () =>
      defineFlow<string>({
        source: paletteSelectionResource,
        base: (id = '') => toColumnsData(tree, id),
        gestures: expandBranchOnActivate,
        metaScope: ['navigate', 'typeahead'],
      }),
    [tree],
  )
  const [columnsData, rawColumnsEvent] = useFlow(flow)

  useEffect(() => { dispatch({ type: 'setLength', value: filtered.length }) }, [filtered.length])
  useEffect(() => { if (open) queueMicrotask(() => inputRef.current?.focus()) }, [open])

  useEffect(() => {
    if (intent !== 'commit') return
    const entry = filtered[active]
    dispatch({ type: 'close' })
    if (entry) router.navigate({ to: entry.to, params: entry.params })
  }, [intent])

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (mode === 'columns' && e.key === 'ArrowDown') {
      const item = columnsHostRef.current?.querySelector<HTMLElement>('[tabindex="0"]')
      if (item) { e.preventDefault(); item.focus(); return }
    }
    const action = keymap[e.key as keyof typeof keymap]
    if (!action) return
    if (mode === 'columns' && (action.type === 'move' || action.type === 'commit')) return
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

  const onColumnsEvent = (ev: Event) => {
    if (ev.type === 'activate') {
      const entry = tree.leafByPath.get(ev.id)
      if (entry) {
        dispatch({ type: 'close' })
        router.navigate({ to: entry.to, params: entry.params })
        return
      }
    }
    rawColumnsEvent(ev)
  }

  const onDialogEvent = (ev: Event) => {
    if (ev.type === 'open' && !ev.open) dispatch({ type: 'close' })
  }

  return {
    inputRef, columnsHostRef,
    open, query, filtered, mode,
    activeId: filtered[active]?.id,
    listData: useMemo(() => toListData(filtered, active), [filtered, active]),
    dialogData: useMemo(() => toDialogData(open), [open]),
    columnsData,
    setQuery: (v: string) => dispatch({ type: 'query', value: v }),
    toggle: () => dispatch({ type: 'toggle' }),
    onKeyDown, onListEvent, onColumnsEvent, onDialogEvent,
  }
}
