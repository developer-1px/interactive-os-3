import { useReducer, useMemo } from 'react'
import type { Event } from '@p/headless/types'
import { INITIAL, keymap, reducer } from './paletteReducer'
import { usePaletteEntries } from './usePaletteEntries'
import { toDialogData } from './paletteAdapters'

/** CommandPalette 컨트롤러 — 최소. open/query state + entries source. */
export function usePaletteController() {
  const entries = usePaletteEntries()
  const [{ open, query }, dispatch] = useReducer(reducer, INITIAL)

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const action = keymap[e.key as keyof typeof keymap]
    if (!action) return
    e.preventDefault()
    dispatch(action)
  }

  const onDialogEvent = (ev: Event) => {
    if (ev.type === 'open' && !ev.open) dispatch({ type: 'close' })
  }

  return {
    open, query, entries,
    dialogData: useMemo(() => toDialogData(open), [open]),
    setQuery: (v: string) => dispatch({ type: 'query', value: v }),
    toggle: () => dispatch({ type: 'toggle' }),
    close: () => dispatch({ type: 'close' }),
    onKeyDown, onDialogEvent,
  }
}
