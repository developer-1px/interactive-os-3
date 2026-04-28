/* eslint-disable react-refresh/only-export-components -- showcase 라우트: CSS variable collector. */
/**
 * /tokens — `:root --ds-*` CSS variable SSOT collector.
 *
 * 정체성: *모으는 페이지*. 풍부 시각 메타포는 /canvas (audit board) 의 책임.
 *
 *   1) `enumerateRootVars()` — `:root` 의 모든 `--ds-*` var 를 getComputedStyle 로 enumerate
 *   2) `categorize()` — varName → foundation `_category.ts` lane key
 *   3) lane 별 그룹 → ds parts (Heading · Table · Code) 로 출력. FlatLayout `definePage` canonical.
 */
import { useEffect, useMemo, useState } from 'react'
import { ROOT, Renderer, definePage, Heading, Table, Code, type NormalizedData } from '@p/ds'
import type { CategoryMeta } from '@p/ds/tokens/category-meta'
import { enumerateRootVars, type TokenEntry } from './tokens.enumerate'
import { categorize, FOUNDATION_ORDER } from './tokens.categorize'

// foundations/<cat>/_category.ts 자동 수집 — 라벨·표준 SSOT
const categoryMetaModules = import.meta.glob<{ default: CategoryMeta }>(
  '@p/ds/tokens/foundations/*/_category.ts',
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

const isColorValue = (v: string) =>
  /^#|^rgb|^hsl|^oklab|^oklch|^color\(|^color-mix|var\(--ds-(neutral|bg|fg|accent|tone|border|on-)/.test(v)

const Swatch = ({ name }: { name: string }) => (
  <span data-icon="circle-fill" aria-hidden style={{ color: `var(${name})` }} />
)

const COLUMNS = [
  { key: 'swatch', label: '',      align: 'center' as const },
  { key: 'name',   label: 'name' },
  { key: 'value',  label: 'computed value' },
]

const TokenSection = ({ cat, tokens }: { cat: string; tokens: TokenEntry[] }) => {
  const standard = CATEGORY_META[cat]?.standard
  return (
    <>
      <Heading level="h2">
        {labelOf(cat)} <Code>({tokens.length})</Code>
      </Heading>
      {standard && <Heading level="caption">{standard}</Heading>}
      <Table
        columns={COLUMNS}
        rows={tokens.map(t => ({
          swatch: isColorValue(t.value) ? <Swatch name={t.name} /> : null,
          name:   <Code>{t.name}</Code>,
          value:  <Code>{t.value || '(empty)'}</Code>,
        }))}
      />
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
    page:     { id: 'page',  data: { type: 'Main',   flow: 'prose', label: 'Design Tokens' } },
    hdr:      { id: 'hdr',   data: { type: 'Header', flow: 'cluster' } },
    hdrTitle: { id: 'hdrTitle', data: { type: 'Text', variant: 'h1',    content: 'Design Tokens' } },
    hdrSub:   { id: 'hdrSub',   data: { type: 'Text', variant: 'small',
      content: `:root 의 모든 --ds-* CSS variable 을 getComputedStyle 로 enumerate. foundation _category.ts SSoT 기준 lane 별 그룹. 전체 ${tokens.length}개, lane ${ordered.length}.`,
    }},
  }
  const childrenOfPage: string[] = ['hdr']
  const rels: Record<string, string[]> = {
    [ROOT]: ['page'],
    hdr:    ['hdrTitle', 'hdrSub'],
  }

  for (const cat of ordered) {
    const secId  = `sec-${cat}`
    const bodyId = `body-${cat}`
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
