import { useMemo } from 'react'
import type { PaletteEntry } from './usePaletteEntries'
import { Card } from '../../parts/Card'
import { Heading } from '../../parts/Heading'
import { Link } from '../../0-primitives/Link'

/**
 * RouteGrid — start.me 스타일 masonry 카드 그리드.
 *
 * 평탄 PaletteEntry[] 를 첫 path 세그먼트로 그룹핑하여 Card 묶음으로 렌더한다.
 * Miller column 의 계층 navigation 을 버리고 모든 라우트를 한 화면에 펼친다.
 *
 * - data-driven: entries · onSelect prop 만. children/JSX ❌
 * - layout: CSS column-count masonry (RouteGrid.style.ts)
 * - 키보드: 자연 Tab/Shift+Tab 순회 + RouterLink 의 Enter
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

export interface RouteGridProps {
  entries: PaletteEntry[]
  /** 링크 클릭 시 호출. RouteGrid 가 RouterLink 로 navigate 한 뒤에 host(CommandPalette)
   *  가 dialog close 등 후속 처리하기 위함. */
  onSelect?: (entry: PaletteEntry) => void
  'aria-label'?: string
}

export function RouteGrid({ entries, onSelect, ...rest }: RouteGridProps) {
  const groups = useMemo(() => groupEntries(entries), [entries])

  return (
    <div data-part="route-grid" {...rest}>
      {groups.map((g) => (
        <Card
          key={g.key}
          data-part="route-card"
          slots={{
            title: <Heading level="h3">{g.label}</Heading>,
            body: (
              <ul data-part="route-list">
                {g.entries.map((e) => (
                  <li key={e.id} onClick={() => onSelect?.(e)}>
                    <Link to={e.to} params={e.params} label={e.label} />
                  </li>
                ))}
              </ul>
            ),
          }}
        />
      ))}
    </div>
  )
}
