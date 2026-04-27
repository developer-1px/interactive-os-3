/**
 * tokenGroups — foundations 토큰 카테고리 그룹화 SSOT.
 *
 * 책임:
 *   - virtual:ds-audit exports 를 카테고리(color/typography/...)별로 묶음
 *   - @demo 가 있는 함수 토큰 + 객체 export(role bundle: slot/size/type) 둘 다 surface
 *   - 카테고리별 라벨·표준 매핑 제공
 *
 * 업계 de facto: token 은 정적 데이터, shape 가 곧 type. annotation·registry ❌
 * (W3C DTCG · Open Props · Radix · Mantine · Spectrum 수렴).
 *
 * SemanticSection 이 소비.
 */
import { audit } from 'virtual:ds-audit'
import * as foundations from '@p/ds/tokens/foundations'
import type { CategoryMeta } from '@p/ds/tokens/category-meta'

export type TokenGroup = { category: string; exports: typeof audit.exports }

// foundations/<cat>/_category.ts 자동 수집 — canvas 측 하드코딩 ❌
const categoryMetaModules = import.meta.glob<{ default: CategoryMeta }>(
  '@p/ds/tokens/foundations/*/_category.ts',
  { eager: true },
)
export const CATEGORY_LABEL: Record<string, CategoryMeta> = (() => {
  const out: Record<string, CategoryMeta> = {}
  for (const [path, mod] of Object.entries(categoryMetaModules)) {
    const m = path.match(/\/foundations\/([^/]+)\/_category\.ts$/)
    if (m) out[m[1]] = mod.default
  }
  return out
})()

/** export 가 plain object(role bundle)인지 — @demo 없이 surface 기준. */
const isRoleBundle = (name: string): boolean => {
  const v = (foundations as Record<string, unknown>)[name]
  return v !== null && typeof v === 'object' && !Array.isArray(v)
}

export const tokenGroups: TokenGroup[] = (() => {
  const map = new Map<string, typeof audit.exports>()
  for (const e of audit.exports) {
    if (!e.demo && !isRoleBundle(e.name)) continue
    const m = e.file.match(/\/foundations\/([^/]+)\//)
    if (!m) continue
    const cat = m[1]
    if (!map.has(cat)) map.set(cat, [])
    map.get(cat)!.push(e)
  }
  return Object.keys(CATEGORY_LABEL)
    .filter((c) => map.has(c))
    .map((c) => ({
      category: c,
      exports: map.get(c)!.sort((a, b) => a.name.localeCompare(b.name)),
    }))
})()
