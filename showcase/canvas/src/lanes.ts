/**
 * Lanes — lane 어휘 SSOT.
 *
 * 책임:
 *   - 각 ui/<n>-<name>/ 및 devices/ 의 `_lane.ts` co-located meta 자동 수집
 *   - lane order 기반 ranking
 *   - atom 분류 — lane.tier default + 컴포넌트 옆 `Foo.meta.ts` override
 *
 * Canvas.tsx · 섹션 컴포넌트들이 이 어휘를 소비.
 */
import type { LaneMeta } from '@p/ds/ui/lane'
import type { ComponentMeta } from '@p/ds/ui/component-meta'

const uiLaneMetaModules = import.meta.glob<{ default: LaneMeta }>('@p/ds/ui/*/_lane.ts', { eager: true })
const deviceLaneMetaModules = import.meta.glob<{ default: LaneMeta }>('@p/ds/devices/_lane.ts', { eager: true })
const componentMetaModules = import.meta.glob<{ default: ComponentMeta }>('@p/ds/ui/*/*.meta.ts', { eager: true })

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

// ── 컴포넌트 자기-선언 tier (SSOT, lane default override) ──────────────
// `ui/<lane>/Foo.meta.ts` default export 가 컴포넌트의 atom/composed 정체성.
// 없으면 lane.tier default 적용. _lane.ts 는 .meta.ts 가 아니므로 자연 제외.
const componentTierMap = new Map<string, ComponentMeta['tier']>()
for (const [path, mod] of Object.entries(componentMetaModules)) {
  const m = path.match(/\/ui\/[^/]+\/([^/]+)\.meta\.ts$/)
  if (!m) continue
  componentTierMap.set(m[1], mod.default.tier)
}

export function isAtom(name: string, lane: string): boolean {
  const own = componentTierMap.get(name)
  if (own) return own === 'atom'
  return laneMetaMap.get(lane)?.tier === 'atom'
}
