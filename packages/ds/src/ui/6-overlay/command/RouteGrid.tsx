import { useMemo } from 'react'
import type { PaletteEntry } from './usePaletteEntries'
import { ROOT, type NormalizedData, type Event } from '../../../headless/types'
import { Card } from '../../parts/Card'
import { Heading } from '../../parts/Heading'
import { Listbox } from '../../4-selection/Listbox'

/**
 * RouteGrid — start.me 스타일 masonry 카드 그리드.
 *
 * 평탄 PaletteEntry[] 를 첫 path 세그먼트로 그룹핑하여 Card 묶음으로 렌더한다.
 *
 * 어휘: ds parts (Card·Heading) + ui/4-selection (Listbox). raw ul/li ❌.
 * 각 Card body slot 에 그룹 NormalizedData 를 넣은 Listbox.
 * activate 이벤트 → onSelect 호출.
 *
 * - data-driven: entries · onSelect prop. children/JSX ❌
 * - layout: CSS column-count masonry (RouteGrid.style.ts)
 * - 키보드: Listbox 가 vertical roving + typeahead 자체 처리 (각 카드 단위)
 */
type Group = { key: string; label: string; entries: PaletteEntry[] }

function groupEntries(entries: PaletteEntry[]): Group[] {
  const map = new Map<string, Group>()
  for (const e of entries) {
    const segs = e.to.split('/').filter(Boolean)
    const key = segs[0] ?? '_root'
    let g = map.get(key)
    if (!g) {
      g = { key, label: key === '_root' ? 'Home' : key, entries: [] }
      map.set(key, g)
    }
    g.entries.push(e)
  }
  for (const g of map.values()) {
    g.entries.sort((a, b) => a.label.localeCompare(b.label))
  }
  return [...map.values()].sort((a, b) => a.label.localeCompare(b.label))
}

function toGroupData(entries: PaletteEntry[]): NormalizedData {
  const ents: NormalizedData['entities'] = { [ROOT]: { id: ROOT } }
  for (const e of entries) {
    ents[e.id] = { id: e.id, data: { label: e.label } }
  }
  return { entities: ents, relationships: { [ROOT]: entries.map((e) => e.id) } }
}

export interface RouteGridProps {
  entries: PaletteEntry[]
  onSelect?: (entry: PaletteEntry) => void
  'aria-label'?: string
}

export function RouteGrid({ entries, onSelect, ...rest }: RouteGridProps) {
  const groups = useMemo(() => groupEntries(entries), [entries])
  const byId = useMemo(() => {
    const m = new Map<string, PaletteEntry>()
    for (const e of entries) m.set(e.id, e)
    return m
  }, [entries])

  const onListEvent = (ev: Event) => {
    if (ev.type !== 'activate' || !ev.id) return
    const entry = byId.get(ev.id)
    if (entry) onSelect?.(entry)
  }

  return (
    <div data-part="route-grid" {...rest}>
      {groups.map((g) => (
        <Card
          key={g.key}
          data-part="route-card"
          slots={{
            title: <Heading level="h3">{g.label}</Heading>,
            body: <Listbox data={toGroupData(g.entries)} onEvent={onListEvent} aria-label={g.label} />,
          }}
        />
      ))}
    </div>
  )
}
