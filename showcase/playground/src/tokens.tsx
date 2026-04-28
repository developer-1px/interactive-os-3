/* eslint-disable react-refresh/only-export-components -- showcase 라우트: CSS variable collector. */
/**
 * /tokens — `:root --ds-*` CSS variable SSOT collector + per-kind 시각화.
 *
 *   1) `enumerateRootVars()` — :root 의 모든 --ds-* var
 *   2) `categorize()` — varName → foundation `_category.ts` lane key
 *   3) `pickKind(name, cat)` — varName → TokenKind (canvas/preview 와 공유)
 *   4) lane 별 그룹 → `<TokenPreview kind=... />` 카드 (Color: swatch · FontSize: "Aa 가나" ·
 *      Radius: 둥근 박스 · Shadow: 떠있는 카드 · Duration: 애니 · Easing: 베지어 등)
 *
 * **재사용 SSoT**: `@showcase/canvas/preview` 의 PreviewRegistry 가 정본. 신규 kind 도입 시
 *   canvas 측 1곳만 수정 → 본 페이지 자동 반영. 새 컴포넌트 만들지 않음.
 */
import { useEffect, useMemo, useState } from 'react'
import { ROOT, Renderer, definePage, Heading, Grid, type NormalizedData } from '@p/ds'
import type { CategoryMeta } from '@p/ds/tokens/category-meta'
import { TokenPreview, type TokenKind } from '@showcase/canvas/preview'
import { enumerateRootVars, type TokenEntry } from './tokens.enumerate'
import { categorize, FOUNDATION_ORDER, PREFIX_TABLE_DERIVED, type CategoryKey } from './tokens.categorize'

// 같은 prefix 끼리 한 줄(flex-wrap) — 다른 prefix 는 줄바꿈으로 시각 경계.
const SORTED_PREFIX = [...PREFIX_TABLE_DERIVED].sort(([a], [b]) => b.length - a.length)
function bucketOf(name: string): string {
  for (const [pre] of SORTED_PREFIX) if (name.startsWith(pre)) return pre
  return name
}

// ── lane meta (label/standard) ──────────────────────────────────────────
const categoryMetaModules = import.meta.glob<{ default: CategoryMeta }>(
  '@p/ds/tokens/semantic/*/_category.ts',
  { eager: true },
)
const CATEGORY_META: Record<string, CategoryMeta> = (() => {
  const out: Record<string, CategoryMeta> = {}
  for (const [path, mod] of Object.entries(categoryMetaModules)) {
    const m = path.match(/\/foundations\/([^/]+)\/_category\.ts$/)
    if (m) out[m[1]] = mod.default
  }
  return out
})()
const labelOf = (key: string): string =>
  CATEGORY_META[key]?.label ?? (key === 'preset' ? 'Preset · seed' : key === 'etc' ? 'ETC · misc' : key)

// ── varName + cat → TokenKind ───────────────────────────────────────────
/** 카테고리만으로 결정되지 않는 케이스 (typography 5종 · shape 2종 · motion 2종) 분기. */
function pickKind(name: string, cat: CategoryKey): TokenKind {
  switch (cat) {
    case 'color':       return 'color'
    case 'typography':
      if (name.startsWith('--ds-weight-')) return 'fontWeight'
      if (name.startsWith('--ds-font-'))   return 'fontFamily'
      if (name.startsWith('--ds-leading')) return 'lineHeight'
      if (name.startsWith('--ds-tracking'))return 'letterSpacing'
      return 'fontSize' // --ds-text-*, --ds-h{1..6}-size
    case 'shape':       return name.startsWith('--ds-hairline') ? 'borderWidth' : 'radius'
    case 'spacing':     return 'pad'
    case 'elevation':   return 'shadow'
    case 'motion':      return name.startsWith('--ds-dur') ? 'duration' : 'easing'
    case 'opacity':     return 'opacity'
    case 'zIndex':      return 'zIndex'
    case 'focus':       return 'outline'
    case 'sizing':      return 'length'
    case 'iconography': return 'icon'
    case 'breakpoint':  return 'breakpoint'
    case 'control':
    case 'layout':      return 'length'
    case 'state':
    case 'preset':
    case 'etc':         return 'recipe'
  }
}

// ── lane 카드 그리드 — prefix 별 sub-bucket 으로 wrap ────────────────────
const TokenSection = ({ cat, tokens }: { cat: CategoryKey; tokens: TokenEntry[] }) => {
  const standard = CATEGORY_META[cat]?.standard
  const buckets: Array<[string, TokenEntry[]]> = []
  const idx = new Map<string, TokenEntry[]>()
  for (const t of tokens) {
    const k = bucketOf(t.name)
    let arr = idx.get(k)
    if (!arr) { arr = []; idx.set(k, arr); buckets.push([k, arr]) }
    arr.push(t)
  }
  return (
    <>
      <Heading level="h2">{labelOf(cat)}</Heading>
      {standard && <Heading level="caption">{standard}</Heading>}
      {buckets.map(([pre, ts]) => (
        <Grid key={pre} cols={9} data-bucket={pre} data-kind={pickKind(ts[0].name, cat)}>
          {ts.map(t => (
            <TokenPreview
              key={t.name}
              kind={pickKind(t.name, cat)}
              value={`var(${t.name})`}
              name={t.name}
            />
          ))}
        </Grid>
      ))}
    </>
  )
}

function buildPage(tokens: TokenEntry[]): NormalizedData {
  const groups = tokens.reduce<Record<string, TokenEntry[]>>((acc, t) => {
    const c = categorize(t.name)
    ;(acc[c] ||= []).push(t)
    return acc
  }, {})
  const ordered = FOUNDATION_ORDER.filter(k => groups[k]?.length)

  type EntityRow = { id: string; data: Record<string, unknown> }
  const ents: Record<string, EntityRow> = {
    [ROOT]:   { id: ROOT,    data: {} },
    page:     { id: 'page',  data: { type: 'Main',   flow: 'wide', label: 'Design Tokens' } },
    hdr:      { id: 'hdr',   data: { type: 'Header', flow: 'cluster' } },
    hdrTitle: { id: 'hdrTitle', data: { type: 'Text', variant: 'h1', content: 'Design Tokens' } },
  }
  const childrenOfPage: string[] = ['hdr']
  const rels: Record<string, string[]> = { [ROOT]: ['page'], hdr: ['hdrTitle'] }

  for (const cat of ordered) {
    const secId = `sec-${cat}`, bodyId = `body-${cat}`
    ents[secId]  = { id: secId,  data: { type: 'Section', flow: 'form' } }
    ents[bodyId] = { id: bodyId, data: { type: 'Ui', component: 'Block',
      content: <TokenSection cat={cat} tokens={groups[cat]} /> } }
    rels[secId] = [bodyId]
    childrenOfPage.push(secId)
  }
  rels.page = childrenOfPage
  return { entities: ents, relationships: rels }
}

export function Tokens() {
  const [tokens, setTokens] = useState<TokenEntry[]>([])
  useEffect(() => { setTokens(enumerateRootVars()) }, [])
  const data = useMemo(() => buildPage(tokens), [tokens])
  return <Renderer page={definePage(data)} />
}
