/**
 * Lanes — lane 어휘 SSOT.
 *
 * 책임:
 *   - 각 ui/<n>-<name>/ 및 devices/ 의 `_lane.ts` co-located meta 자동 수집
 *   - lane order 기반 ranking
 *   - atom 분류 (lane tier + 혼합 lane 명시 화이트리스트)
 *
 * Canvas.tsx · 섹션 컴포넌트들이 이 어휘를 소비.
 */
import type { LaneMeta } from '@p/ds/ui/lane'

const uiLaneMetaModules = import.meta.glob<{ default: LaneMeta }>('@p/ds/ui/*/_lane.ts', { eager: true })
const deviceLaneMetaModules = import.meta.glob<{ default: LaneMeta }>('@p/ds/devices/_lane.ts', { eager: true })

export const laneMetaMap = new Map<string, LaneMeta>()
for (const [path, mod] of Object.entries(uiLaneMetaModules)) {
  const m = path.match(/\/ui\/([^/]+)\/_lane\.ts$/)
  if (!m) continue
  laneMetaMap.set(`ui/${m[1]}`, mod.default)
}
for (const [path, mod] of Object.entries(deviceLaneMetaModules)) {
  if (!path.match(/\/devices\/_lane\.ts$/)) continue
  laneMetaMap.set('devices', mod.default)
}

export const laneRank = (lane: string) => laneMetaMap.get(lane)?.order ?? 999

// ── Atom 분류 (lane meta tier + 혼합 lane 의 명시 화이트리스트) ─────────
// lane tier 'atom' 인 폴더는 통째로 atom. tier 'composed' 폴더 안에서 leaf role
// 인 일부 컴포넌트는 ATOM_NAMES 로 끌어올린다 (별도 OCP 이슈 — 컴포넌트 옆
// `Foo.meta.ts` co-location 으로 후속 수렴 예정).
const ATOM_NAMES = new Set<string>([
  // ui/3-input 단순 (leaf role 또는 passive)
  'Input', 'Checkbox', 'Radio', 'Textarea',
  // ui/8-layout 의 layout primitive (composition role 없음)
  'Row', 'Column', 'Grid', 'Split',
  // ui/parts 의 content atoms (role 없음, 단일 시각 단위)
  'Heading', 'Tag', 'Code', 'Link', 'Avatar', 'Thumbnail',
  'Skeleton', 'Timestamp', 'Badge', 'Progress',
])

export function isAtom(name: string, lane: string): boolean {
  if (laneMetaMap.get(lane)?.tier === 'atom') return true
  return ATOM_NAMES.has(name)
}
