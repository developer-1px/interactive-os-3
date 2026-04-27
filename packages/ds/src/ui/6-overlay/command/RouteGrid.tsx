import { useMemo } from 'react'
import type { PaletteEntry } from './usePaletteEntries'
import { ROOT, type NormalizedData, type Event } from '../../../headless/types'
import { Card } from '../../parts/Card'
import { Heading } from '../../parts/Heading'
import { Listbox } from '../../4-selection/Listbox'
import { Grid } from '../../8-layout/Grid'

type Group = { key: string; label: string; entries: PaletteEntry[] }

function groupEntries(entries: PaletteEntry[]): Group[] {
  const map = new Map<string, Group>()
  for (const e of entries) {
    const key = e.to.split('/').filter(Boolean)[0] ?? '_'
    let g = map.get(key)
    if (!g) { g = { key, label: key === '_' ? 'Home' : key, entries: [] }; map.set(key, g) }
    g.entries.push(e)
  }
  for (const g of map.values()) g.entries.sort((a, b) => a.label.localeCompare(b.label))
  return [...map.values()].sort((a, b) => a.label.localeCompare(b.label))
}

function toData(entries: PaletteEntry[]): NormalizedData {
  const ents: NormalizedData['entities'] = { [ROOT]: { id: ROOT } }
  for (const e of entries) ents[e.id] = { id: e.id, data: { label: e.label } }
  return { entities: ents, relationships: { [ROOT]: entries.map((e) => e.id) } }
}

export interface RouteGridProps {
  entries: PaletteEntry[]
  query?: string
  onSelect?: (entry: PaletteEntry) => void
}

export function RouteGrid({ entries, query = '', onSelect }: RouteGridProps) {
  const visible = useMemo(() => {
    const q = query.trim().toLowerCase()
    const filtered = q ? entries.filter((e) => e.label.toLowerCase().includes(q)) : entries
    return groupEntries(filtered)
  }, [entries, query])

  const byId = useMemo(() => new Map(entries.map((e) => [e.id, e])), [entries])

  const onListEvent = (ev: Event) => {
    if (ev.type !== 'activate' || !ev.id) return
    const entry = byId.get(ev.id)
    if (entry) onSelect?.(entry)
  }

  return (
    <Grid cols={3} flow="form">
      {visible.map((g) => (
        <Card
          key={g.key}
          slots={{
            title: <Heading level="h3">{g.label}</Heading>,
            body: <Listbox data={toData(g.entries)} onEvent={onListEvent} />,
          }}
        />
      ))}
    </Grid>
  )
}
