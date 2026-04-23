import { useEffect, useMemo, useRef, useState, useId } from 'react'
import { useRouter } from '@tanstack/react-router'
import { Dialog } from './Dialog'
import { Combobox } from '../list/Combobox'
import { Listbox } from '../list/Listbox'
import { Option } from '../list/Option'

type PaletteEntry = {
  id: string
  label: string
  to: string
  params?: Record<string, string>
}

export function CommandPalette() {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [active, setActive] = useState(0)
  const dialogRef = useRef<HTMLDialogElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const listId = useId()
  const optionIdBase = useId()

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
        setOpen((v) => !v)
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
      setQuery('')
      setActive(0)
      queueMicrotask(() => inputRef.current?.focus())
    } else if (!open && d.open) {
      d.close()
    }
  }, [open])

  useEffect(() => {
    if (active >= filtered.length) setActive(Math.max(0, filtered.length - 1))
  }, [filtered.length, active])

  const close = () => setOpen(false)

  const commit = (entry: PaletteEntry) => {
    close()
    router.navigate({ to: entry.to, params: entry.params })
  }

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setActive((i) => Math.min(filtered.length - 1, i + 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActive((i) => Math.max(0, i - 1))
    } else if (e.key === 'Enter') {
      const entry = filtered[active]
      if (entry) {
        e.preventDefault()
        commit(entry)
      }
    } else if (e.key === 'Escape') {
      e.preventDefault()
      close()
    }
  }

  const optionId = (i: number) => `${optionIdBase}-${i}`
  const activeId = filtered[active] ? optionId(active) : undefined

  return (
    <Dialog ref={dialogRef} aria-label="Command palette" onClose={close}>
      <Combobox
        ref={inputRef}
        expanded={filtered.length > 0}
        controls={listId}
        activedescendant={activeId}
        value={query}
        onChange={(e) => { setQuery(e.currentTarget.value); setActive(0) }}
        onKeyDown={onKeyDown}
        placeholder="Jump to…"
        aria-label="Search routes"
      />
      {filtered.length > 0 && (
        <Listbox id={listId}>
          {filtered.map((e, i) => (
            <Option
              key={e.id}
              id={optionId(i)}
              selected={i === active}
              onMouseEnter={() => setActive(i)}
              onClick={() => commit(e)}
            >
              <span>{e.label}</span>
            </Option>
          ))}
        </Listbox>
      )}
    </Dialog>
  )
}
