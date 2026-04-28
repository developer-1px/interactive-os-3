/**
 * Lanes — fs SSoT.
 *
 * lane 메타(label·order·tier·layer·bucket)는 폴더 위치/이름에서 자동 도출.
 * `_lane.ts` 메타 파일 ❌ — 폴더 만들기만으로 canvas 등재.
 *
 * 컴포넌트별 atom override 만 `Foo.meta.ts` 로 보존 (fs 도출 불가능한 합리적 override).
 */
import type { ComponentMeta } from '@p/ds/ui/component-meta'

export type Bucket = 'L2' | 'L3' | 'L4' | 'L5'

/** fs 위치 → bucket (L2 Primitives · L3 Patterns · L4 Templates · L5 Devices) */
export function bucketOf(lanePath: string): Bucket {
  if (lanePath === 'devices') return 'L5'
  if (lanePath === 'content') return 'L3'
  if (lanePath.startsWith('surfaces/')) return 'L5'
  if (lanePath.startsWith('style/widgets/')) {
    const tail = lanePath.slice('style/widgets/'.length)
    if (tail === 'composite') return 'L4'
    return 'L3'
  }
  if (lanePath.startsWith('ui/')) {
    const tail = lanePath.slice(3)
    const n = parseInt(tail.match(/^(\d+)-/)?.[1] ?? '99')
    if (n >= 0 && n <= 3) return 'L2'
    if (n >= 4 && n <= 6) return 'L3'
    if (n === 8)          return 'L4'
    if (tail === 'parts')    return 'L2'
    if (tail === 'patterns') return 'L3'
    if (tail === 'templates')  return 'L4'
  }
  return 'L3'
}

/** 폴더명 → 표시 라벨 (`0-primitives` → "Primitives"). */
export function labelOf(lanePath: string): string {
  const tail = lanePath.split('/').pop()!
  const name = tail.replace(/^\d+-/, '')
  return name[0].toUpperCase() + name.slice(1)
}

/** lane 정렬 — bucket × prefix 숫자. */
export function orderOf(lanePath: string): number {
  const bucketRank = { L2: 100, L3: 200, L4: 300, L5: 400 }[bucketOf(lanePath)]
  const n = parseInt(lanePath.match(/(\d+)-/)?.[1] ?? '50')
  return bucketRank + n
}

export const laneRank = orderOf

// ── 컴포넌트별 atom override ─────────────────────────────────────────────
// `ui/<lane>/Foo.meta.ts` default export 가 atom/composed 정체성을 자기 선언.
// 없으면 bucket==='L2' 가 default atom.
const componentMetaModules = import.meta.glob<{ default: ComponentMeta }>(
  '@p/ds/ui/**/*.meta.ts',
  { eager: true },
)

const componentTierMap = new Map<string, ComponentMeta['tier']>()
for (const [path, mod] of Object.entries(componentMetaModules)) {
  const m = path.match(/\/([^/]+)\.meta\.ts$/)
  if (!m) continue
  componentTierMap.set(m[1], mod.default.tier)
}

export function isAtom(name: string, lane: string): boolean {
  const own = componentTierMap.get(name)
  if (own) return own === 'atom'
  return bucketOf(lane) === 'L2'
}
