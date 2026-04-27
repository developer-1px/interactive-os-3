/**
 * tokenGroups — foundations 토큰 카테고리 그룹화 SSOT.
 *
 * 책임:
 *   - virtual:ds-audit @demo exports 를 카테고리(color/typography/...)별로 묶음
 *   - 카테고리별 라벨·표준 매핑 제공
 *
 * SemanticSection 이 소비.
 */
import { audit } from 'virtual:ds-audit'

export type TokenGroup = { category: string; exports: typeof audit.exports }

export const CATEGORY_LABEL: Record<string, { label: string; standard?: string }> = {
  color:       { label: 'Color',       standard: 'M3 · HIG · Polaris · Atlassian · Spectrum · Fluent' },
  typography:  { label: 'Typography',  standard: 'M3 · HIG · Polaris · Atlassian · Spectrum · Fluent' },
  shape:       { label: 'Shape',       standard: 'Material 3 Shape' },
  state:       { label: 'State',       standard: '≈ Material Interaction · Atlassian States' },
  motion:      { label: 'Motion',      standard: 'M3 · HIG · Atlassian · Spectrum · Fluent' },
  layout:      { label: 'Layout',      standard: 'M3 · HIG · Polaris · Atlassian · Spectrum' },
  iconography: { label: 'Iconography', standard: 'M3 · HIG · Polaris · Spectrum · Fluent' },
  recipes:     { label: 'Recipes',     standard: '≈ Atlassian Tokens / composite' },
  primitives:  { label: 'Primitives',  standard: '≈ Atlassian Primitives · Radix' },
  control:     { label: 'Control',     standard: '≈ Material Interaction sizing' },
  elevation:   { label: 'Elevation',   standard: 'M3 · Fluent' },
}

export const tokenGroups: TokenGroup[] = (() => {
  const map = new Map<string, typeof audit.exports>()
  for (const e of audit.exports) {
    if (!e.demo) continue
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
