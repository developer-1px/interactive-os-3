import { useMemo } from 'react'
import type { PaletteEntry } from './usePaletteEntries'
import { ROOT, type NormalizedData, type Event } from '../../headless/types'
import { Card } from '../../ui/6-structure/Card'
import { Heading } from '../../ui/6-structure/Heading'
import { Listbox } from '../../ui/3-composite/Listbox'
import { Grid } from '../../ui/9-layout/Grid'

type Group = { key: string; label: string; entries: PaletteEntry[] }

/** 카테고리 = entry.category (라우트 자체 선언) ?? 첫 path 세그먼트.
 *  ds 는 카테고리 이름을 모른다 — 라우트가 staticData.palette.category 로 자기 분류 선언. */
function categoryOf(entry: PaletteEntry): string {
  return entry.category ?? entry.to.split('/').filter(Boolean)[0] ?? '_'
}

function groupEntries(entries: PaletteEntry[]): Group[] {
  const map = new Map<string, Group>()
  for (const e of entries) {
    const key = categoryOf(e)
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
    <Grid cols={3} flow="list" style={{ gridTemplateColumns: 'repeat(3, minmax(0, 1fr))' }}>
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
