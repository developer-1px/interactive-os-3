/* eslint-disable react-refresh/only-export-components -- showcase 라우트: foundations 함수 카탈로그. */
/**
 * /foundations — TS Foundation 카탈로그.
 *
 * /tokens 가 `:root --ds-*` CSS var (값) 의 SSOT viewer 라면,
 * /foundations 는 `@p/ds/tokens/semantic` 의 *함수형 export* (mixin·helper·scale) 의 SSOT viewer.
 *
 * 같은 dispatch 골격, 다른 SSOT 소스:
 *   import * as F → entries → categorize(typeof + arity + name) → kindRegistry[kind]
 *
 * 신규 foundation 추가 = export 1줄. 페이지 본체 닫혀 있음 (OCP).
 */
import { useMemo, type ReactNode } from 'react'
import * as F from '@p/ds/tokens/semantic'
import { ROOT, Renderer, definePage, Table, Heading, Code, type NormalizedData } from '@p/ds'

// ──────────────────────────────────────────────────────────────────────
// Enumerate + Categorize (SSOT — 자동 dispatch)
// ──────────────────────────────────────────────────────────────────────

type FoundationKind = 'mixin' | 'value' | 'helper' | 'scale' | 'etc'

type FoundationEntry = {
  name: string
  kind: FoundationKind
  typeof: string
  arity: number
  sample?: string
  source?: string
}

const isMixin = (output: string) =>
  output.includes('\n') || /[a-z-]+\s*:\s*[^;]+;/.test(output)

function classify(name: string, value: unknown): FoundationEntry {
  const t = typeof value
  if (t === 'function') {
    const fn = value as (...args: unknown[]) => unknown
    const arity = fn.length
    let sample: string | undefined
    let kind: FoundationKind = arity > 0 ? 'helper' : 'value'
    if (arity === 0) {
      try {
        const out = fn()
        if (typeof out === 'string') {
          sample = out
          if (isMixin(out)) kind = 'mixin'
        } else {
          sample = JSON.stringify(out)
        }
      } catch {
        sample = '(throw)'
      }
    }
    const source = fn.toString().split('\n')[0].slice(0, 96)
    return { name, kind, typeof: t, arity, sample, source }
  }
  if (t === 'object' && value !== null) {
    return { name, kind: 'scale', typeof: t, arity: 0, sample: JSON.stringify(value).slice(0, 96) }
  }
  if (t === 'string' || t === 'number' || t === 'boolean') {
    return { name, kind: 'value', typeof: t, arity: 0, sample: String(value).slice(0, 96) }
  }
  return { name, kind: 'etc', typeof: t, arity: 0 }
}

function readFoundations(): FoundationEntry[] {
  return Object.entries(F)
    .filter(([k]) => !k.startsWith('_'))
    .map(([k, v]) => classify(k, v))
    .sort((a, b) => a.name.localeCompare(b.name))
}

// ──────────────────────────────────────────────────────────────────────
// Renderers — parts/Table 데이터 주도 (columns + rows). raw <table> ❌.
// ──────────────────────────────────────────────────────────────────────

const ValueRenderer = ({ rows }: { rows: FoundationEntry[] }) => (
  <Table
    columns={[
      { key: 'name',   label: 'name' },
      { key: 'arity',  label: 'arity' },
      { key: 'output', label: 'output' },
    ]}
    rows={rows.map(r => ({
      name:   <Code>{r.name}()</Code>,
      arity:  <Code>{r.arity}</Code>,
      output: <Code>{r.sample}</Code>,
    }))}
  />
)

const MixinRenderer = ({ rows }: { rows: FoundationEntry[] }) => (
  <Table
    columns={[
      { key: 'name', label: 'name' },
      { key: 'css',  label: 'CSS declaration block' },
    ]}
    rows={rows.map(r => ({
      name: <Code>{r.name}()</Code>,
      css:  <Code>{r.sample}</Code>,
    }))}
  />
)

const HelperRenderer = ({ rows }: { rows: FoundationEntry[] }) => (
  <Table
    columns={[
      { key: 'name',      label: 'name' },
      { key: 'arity',     label: 'arity' },
      { key: 'signature', label: 'signature (source 첫 줄)' },
    ]}
    rows={rows.map(r => ({
      name:      <Code>{r.name}</Code>,
      arity:     <Code>{r.arity}</Code>,
      signature: <Code>{r.source}</Code>,
    }))}
  />
)

const ScaleRenderer = ({ rows }: { rows: FoundationEntry[] }) => (
  <Table
    columns={[
      { key: 'name',  label: 'name' },
      { key: 'shape', label: 'shape (preview)' },
    ]}
    rows={rows.map(r => ({
      name:  <Code>{r.name}</Code>,
      shape: <Code>{r.sample}</Code>,
    }))}
  />
)

const EtcRenderer = ({ rows }: { rows: FoundationEntry[] }) => (
  <Table
    columns={[
      { key: 'name',   label: 'name' },
      { key: 'typeof', label: 'typeof' },
    ]}
    rows={rows.map(r => ({
      name:   <Code>{r.name}</Code>,
      typeof: <Code>{r.typeof}</Code>,
    }))}
  />
)

// ──────────────────────────────────────────────────────────────────────
// Registry (OCP — kind 추가 = entry 1줄)
// ──────────────────────────────────────────────────────────────────────

type KindEntry = {
  kind: FoundationKind
  title: string
  lede: string
  Renderer: (p: { rows: FoundationEntry[] }) => ReactNode
}

const kindRegistry: ReadonlyArray<KindEntry> = [
  { kind: 'mixin',  title: '1. Mixin',        lede: 'arity 0, multi-line CSS declaration block. selector 안에서 보간 (`&:focus-visible { ${ring()} }`).',  Renderer: MixinRenderer  },
  { kind: 'value',  title: '2. Value getter', lede: 'arity 0, 단일 token 참조 반환 (`var(--ds-...)`). raw px 대신 호출.',                                  Renderer: ValueRenderer  },
  { kind: 'helper', title: '3. Helper',       lede: 'arity > 0, slot/level 인자 받아 token 반환. 자동 invoke 하지 않음 — signature 만 표시.',               Renderer: HelperRenderer },
  { kind: 'scale',  title: '4. Scale',        lede: '함수가 아닌 record/object — 슬롯 → 값 매핑.',                                                          Renderer: ScaleRenderer  },
  { kind: 'etc',    title: 'ETC',             lede: '위 4개 분류에 안 맞는 export.',                                                                        Renderer: EtcRenderer    },
]

// ──────────────────────────────────────────────────────────────────────
// Page builder — registry 순회 (OCP). FlatLayout entities tree 로 선언.
// ──────────────────────────────────────────────────────────────────────

function buildPage(): NormalizedData {
  const entries = readFoundations()
  const buckets: Record<FoundationKind, FoundationEntry[]> = { mixin: [], value: [], helper: [], scale: [], etc: [] }
  for (const e of entries) buckets[e.kind].push(e)

  type EntityRow = { id: string; data: Record<string, unknown> }
  const ents: Record<string, EntityRow> = {
    [ROOT]:    { id: ROOT,    data: {} },
    page:      { id: 'page',  data: { type: 'Main',   flow: 'prose', label: 'Foundation 카탈로그' } },
    hdr:       { id: 'hdr',   data: { type: 'Header', flow: 'cluster' } },
    hdrTitle:  { id: 'hdrTitle', data: { type: 'Text', variant: 'h1',    content: 'Foundations' } },
    hdrSub:    { id: 'hdrSub',   data: { type: 'Text', variant: 'small', content: '@p/ds/tokens/semantic 의 함수형 export — mixin · value · helper · scale · ETC. 자동 enumerate (수동 매핑 ❌).' } },
  }
  const childrenOfPage: string[] = ['hdr']

  for (const { kind, title, lede, Renderer: R } of kindRegistry) {
    const rows = buckets[kind]
    if (rows.length === 0) continue
    const secId = `sec-${kind}`
    const headId = `head-${kind}`
    const ledeId = `lede-${kind}`
    const bodyId = `body-${kind}`
    ents[secId]  = { id: secId,  data: { type: 'Section', flow: 'form' } }
    ents[headId] = { id: headId, data: { type: 'Ui', component: 'Block', content: <Heading level="h2">{title} <Code>({rows.length})</Code></Heading> } }
    ents[ledeId] = { id: ledeId, data: { type: 'Text', variant: 'small', content: lede } }
    ents[bodyId] = { id: bodyId, data: { type: 'Ui', component: 'Block', content: <R rows={rows} /> } }
    childrenOfPage.push(secId)
    ;(ents as Record<string, EntityRow & { children?: string[] }>)[secId]
  }

  const relationships: Record<string, string[]> = {
    [ROOT]: ['page'],
    page:   childrenOfPage,
    hdr:    ['hdrTitle', 'hdrSub'],
  }
  for (const { kind } of kindRegistry) {
    const rows = buckets[kind]
    if (rows.length === 0) continue
    relationships[`sec-${kind}`] = [`head-${kind}`, `lede-${kind}`, `body-${kind}`]
  }

  return { entities: ents, relationships }
}

export function Foundations() {
  const data = useMemo(buildPage, [])
  return <Renderer page={definePage(data)} />
}
