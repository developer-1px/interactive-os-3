import { useEffect, useMemo, useReducer, useRef, useId } from 'react'
import { useRouter } from '@tanstack/react-router'
import { Dialog } from './Dialog'
import { Combobox } from '../list/Combobox'
import { Listbox } from '../list/Listbox'
import { ROOT, type Event, type NormalizedData } from '../../core/types'

type PaletteEntry = {
  id: string
  label: string
  to: string
  params?: Record<string, string>
}

type State = { open: boolean; query: string; active: number }
type Action =
  | { type: 'toggle' }
  | { type: 'open' }
  | { type: 'close' }
  | { type: 'query'; value: string }
  | { type: 'active'; value: number }
  | { type: 'move'; delta: number; max: number }
  | { type: 'clamp'; max: number }

const INITIAL: State = { open: false, query: '', active: 0 }

function reducer(s: State, a: Action): State {
  switch (a.type) {
    case 'toggle': return { ...s, open: !s.open, query: '', active: 0 }
    case 'open':   return { ...s, open: true, query: '', active: 0 }
    case 'close':  return { ...s, open: false }
    case 'query':  return { ...s, query: a.value, active: 0 }
    case 'active': return { ...s, active: a.value }
    case 'move':   return { ...s, active: Math.max(0, Math.min(a.max, s.active + a.delta)) }
    case 'clamp':  return s.active > a.max ? { ...s, active: Math.max(0, a.max) } : s
  }
}

export function CommandPalette() {
  const router = useRouter()
  const [{ open, query, active }, dispatch] = useReducer(reducer, INITIAL)
  const dialogRef = useRef<HTMLDialogElement>(null)
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
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        dispatch({ type: 'toggle' })
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  useEffect(() => {
    const d = dialogRef.current
    if (!d) return
    if (open && !d.open) {
      d.showModal()
      queueMicrotask(() => inputRef.current?.focus())
    } else if (!open && d.open) {
      d.close()
    }
  }, [open])

  useEffect(() => {
    dispatch({ type: 'clamp', max: filtered.length - 1 })
  }, [filtered.length])

  const close = () => dispatch({ type: 'close' })

  const commit = (entry: PaletteEntry) => {
    close()
    router.navigate({ to: entry.to, params: entry.params })
  }

  const max = filtered.length - 1
  const keymap: Record<string, (e: React.KeyboardEvent) => void> = {
    ArrowDown: (e) => { e.preventDefault(); dispatch({ type: 'move', delta: +1, max }) },
    ArrowUp:   (e) => { e.preventDefault(); dispatch({ type: 'move', delta: -1, max }) },
    Enter:     (e) => { const entry = filtered[active]; if (entry) { e.preventDefault(); commit(entry) } },
    Escape:    (e) => { e.preventDefault(); close() },
  }
  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => keymap[e.key]?.(e)

  const activeId = filtered[active]?.id

  const data: NormalizedData = useMemo(() => {
    const entities: NormalizedData['entities'] = { [ROOT]: { id: ROOT } }
    filtered.forEach((e, i) => {
      entities[e.id] = { id: e.id, data: { label: e.label, selected: i === active } }
    })
    return { entities, relationships: { [ROOT]: filtered.map((e) => e.id) } }
  }, [filtered, active])

  const onEvent = (ev: Event) => {
    if (ev.type === 'activate') {
      const entry = filtered.find((e) => e.id === ev.id)
      if (entry) commit(entry)
    } else if (ev.type === 'navigate') {
      const idx = filtered.findIndex((e) => e.id === ev.id)
      if (idx >= 0) dispatch({ type: 'active', value: idx })
    }
  }

  return (
    <Dialog ref={dialogRef} aria-label="Command palette" onClose={close}>
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
        <Listbox id={listId} data={data} onEvent={onEvent} />
      )}
    </Dialog>
  )
}
