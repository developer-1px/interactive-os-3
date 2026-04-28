/* eslint-disable react-refresh/only-export-components, no-restricted-syntax -- showcase 라우트: ds 인벤토리 테이블 페이지. */
/**
 * /inventory — ds 전수 카탈로그.
 *
 * Figma "Design Tokens" 패널 패턴 — 좌측 카테고리 사이드바 + 우측 테이블.
 *
 * 수집 출처 (모두 런타임 SSOT, 수동 매핑 ❌):
 *   - Components → uiRegistry (registry.ts) 직접 enumerate
 *   - data-parts → document.styleSheets 의 모든 selector 에서 [data-part="..."] 추출
 *   - Tokens     → getComputedStyle(:root) 의 --ds-* CSS variable 전수 enumerate
 *
 * 토큰 카테고리 분류는 변수 이름 prefix 기반 (color/typo/spacing/radius/elev/motion/focus/icon/control).
 * 새 토큰 추가 시 prefix 만 일관 — 카테고리 자동 편입.
 */
import { useEffect, useMemo, useState } from 'react'
import {
  Listbox,
  Row,
  Column,
  Heading,
  fromList,
  uiRegistry,
  type Event,
} from '@p/ds'
import { Table } from '@p/ds/ui/parts/Table'

// ──────────────────────────────────────────────────────────────────────
// 카테고리 — sidebar 항목
// ──────────────────────────────────────────────────────────────────────
type Category =
  | 'components'
  | 'data-parts'
  | 'colors'
  | 'typography'
  | 'spacing'
  | 'radius'
  | 'elevation'
  | 'motion'
  | 'focus'
  | 'control'
  | 'icons'
  | 'all-tokens'

const CATEGORIES: { id: Category; label: string }[] = [
  { id: 'components',  label: 'Components' },
  { id: 'data-parts',  label: 'data-parts' },
  { id: 'colors',      label: 'Colors' },
  { id: 'typography',  label: 'Typography' },
  { id: 'spacing',     label: 'Spacing' },
  { id: 'radius',      label: 'Radius' },
  { id: 'elevation',   label: 'Elevation' },
  { id: 'motion',      label: 'Motion' },
  { id: 'focus',       label: 'Focus' },
  { id: 'control',     label: 'Control' },
  { id: 'icons',       label: 'Icons' },
  { id: 'all-tokens',  label: 'All tokens' },
]

// ──────────────────────────────────────────────────────────────────────
// 런타임 수집기들 — useDocVars / useDataParts
// ──────────────────────────────────────────────────────────────────────
type Var = { name: string; value: string }

function useDocVars(): Var[] {
  const [vars, setVars] = useState<Var[]>([])
  useEffect(() => {
    const cs = getComputedStyle(document.documentElement)
    const seen = new Set<string>()
    const out: Var[] = []
    // 1. inline :root style attribute (preset.apply 가 :root { --ds-*: ... } 형태로 emit)
    for (let i = 0; i < cs.length; i++) {
      const name = cs[i]
      if (name && name.startsWith('--ds-') && !seen.has(name)) {
        seen.add(name)
        out.push({ name, value: cs.getPropertyValue(name).trim() })
      }
    }
    // 2. stylesheet 안의 :root / :where(:root) 룰 — getComputedStyle 이 못 잡는 케이스 보강
    for (const sheet of Array.from(document.styleSheets)) {
      let rules: CSSRuleList
      try { rules = sheet.cssRules } catch { continue }
      for (const r of Array.from(rules)) {
        if (r instanceof CSSStyleRule && /:root|:where\(:root\)/.test(r.selectorText)) {
          for (const propName of Array.from(r.style)) {
            if (propName.startsWith('--ds-') && !seen.has(propName)) {
              seen.add(propName)
              out.push({ name: propName, value: r.style.getPropertyValue(propName).trim() })
            }
          }
        }
      }
    }
    out.sort((a, b) => a.name.localeCompare(b.name))
    setVars(out)
  }, [])
  return vars
}

function useDataParts(): string[] {
  const [parts, setParts] = useState<string[]>([])
  useEffect(() => {
    const set = new Set<string>()
    const re = /\[data-part="([^"]+)"\]/g
    const visit = (r: CSSRule) => {
      if (r instanceof CSSStyleRule) {
        for (const m of r.selectorText.matchAll(re)) set.add(m[1])
      }
      // group rule (media/supports/layer) — descend
      const group = r as unknown as { cssRules?: CSSRuleList }
      if (group.cssRules) for (const c of Array.from(group.cssRules)) visit(c)
    }
    for (const sheet of Array.from(document.styleSheets)) {
      let rules: CSSRuleList
      try { rules = sheet.cssRules } catch { continue }
      for (const r of Array.from(rules)) visit(r)
    }
    setParts([...set].sort())
  }, [])
  return parts
}

// ──────────────────────────────────────────────────────────────────────
// 토큰 카테고리 분류 — 이름 prefix 기반
// ──────────────────────────────────────────────────────────────────────
const CATEGORY_OF: Record<Category, (name: string) => boolean> = {
  components:  () => false,
  'data-parts': () => false,
  colors: (n) =>
    /^--ds-(bg|fg|accent|on-accent|tone|neutral|surface|border|hairline|text(?!-(xs|sm|md|lg|xl|2xl|3xl|leading|tracking))|status|danger|success|warning|info|tint|mute|emphasize)/.test(n),
  typography: (n) =>
    /^--ds-(text-(xs|sm|md|lg|xl|2xl|3xl)|leading|tracking|font|weight)/.test(n),
  spacing: (n) => /^--ds-(space|pad|gap|row-gap|inset|keyline)/.test(n),
  radius:  (n) => /^--ds-radius/.test(n),
  elevation: (n) => /^--ds-(shadow|elev)/.test(n),
  motion: (n) => /^--ds-(dur|ease|motion)/.test(n),
  focus:  (n) => /^--ds-focus/.test(n),
  control: (n) => /^--ds-(control|hierarchy|grouping)/.test(n),
  icons:  (n) => /^--ds-icon/.test(n),
  'all-tokens': () => true,
}

function classify(name: string): Category | undefined {
  for (const c of [
    'colors', 'typography', 'spacing', 'radius', 'elevation',
    'motion', 'focus', 'control', 'icons',
  ] as Category[]) {
    if (CATEGORY_OF[c](name)) return c
  }
  return undefined
}

// ──────────────────────────────────────────────────────────────────────
// Swatch — color 토큰 미리보기 (background swatch)
// ──────────────────────────────────────────────────────────────────────
function Swatch({ value }: { value: string }) {
  return (
    <span
      data-part="swatch"
      aria-hidden
      style={{
        display: 'inline-block',
        inlineSize: 'var(--ds-control-h, 24px)',
        blockSize: 'var(--ds-control-h, 24px)',
        background: `var(--ds-bg, #fff)`,
        border: 'var(--ds-hairline, 1px) solid var(--ds-border, #ddd)',
        borderRadius: 'var(--ds-radius-sm, 4px)',
        backgroundImage: value ? `linear-gradient(${value}, ${value})` : undefined,
      }}
    />
  )
}

// ──────────────────────────────────────────────────────────────────────
// 메인 컴포넌트
// ──────────────────────────────────────────────────────────────────────
export function Inventory() {
  const [active, setActive] = useState<Category>('components')
  const vars = useDocVars()
  const parts = useDataParts()

  const sidebarData = useMemo(
    () =>
      fromList(
        CATEGORIES.map((c) => ({
          id: c.id,
          label: c.label,
          selected: c.id === active,
        })),
      ),
    [active],
  )

  const onSidebar = (e: Event) => {
    if (e.type === 'activate') setActive(e.id as Category)
  }

  const componentRows = useMemo(
    () =>
      Object.entries(uiRegistry)
        .map(([name, entry]) => ({
          name,
          zone: entry.zone,
          fn: entry.component.name || name,
        }))
        .sort((a, b) =>
          a.zone === b.zone ? a.name.localeCompare(b.name) : a.zone.localeCompare(b.zone),
        ),
    [],
  )

  return (
    <Row data-route="inventory" flow="split" style={{ blockSize: '100dvh', overflow: 'hidden' }}>
      <aside
        data-part="inventory-sidebar"
        aria-label="카테고리"
        style={{
          inlineSize: 240,
          flex: 'none',
          borderInlineEnd: 'var(--ds-hairline) solid var(--ds-border)',
          overflowY: 'auto',
          padding: 'calc(var(--ds-space) * 2)',
        }}
      >
        <Heading level="h3">Inventory</Heading>
        <Listbox data={sidebarData} onEvent={onSidebar} aria-label="카테고리" />
      </aside>
      <Column
        data-part="inventory-main"
        flow="form"
        style={{ flex: 1, minWidth: 0, overflow: 'auto', padding: 'calc(var(--ds-space) * 4)' }}
      >
        <InventoryTable active={active} vars={vars} parts={parts} components={componentRows} />
      </Column>
    </Row>
  )
}

// ──────────────────────────────────────────────────────────────────────
// 테이블 — active 카테고리 별로 columns/rows 결정
// ──────────────────────────────────────────────────────────────────────
type ComponentRow = { name: string; zone: string; fn: string }

function InventoryTable({
  active,
  vars,
  parts,
  components,
}: {
  active: Category
  vars: Var[]
  parts: string[]
  components: ComponentRow[]
}) {
  const label = CATEGORIES.find((c) => c.id === active)?.label ?? active

  if (active === 'components') {
    return (
      <section aria-labelledby="inv-h">
        <Heading level="h2" id="inv-h">
          Components <small>({components.length})</small>
        </Heading>
        <Table
          aria-label="Components"
          columns={[
            { key: 'name', label: 'Name' },
            { key: 'zone', label: 'Zone' },
            { key: 'fn',   label: 'Export' },
          ]}
          rows={components.map((c) => ({
            name: <code>{c.name}</code>,
            zone: <span>{c.zone}</span>,
            fn:   <code>{c.fn}</code>,
          }))}
        />
      </section>
    )
  }

  if (active === 'data-parts') {
    return (
      <section aria-labelledby="inv-h">
        <Heading level="h2" id="inv-h">
          data-parts <small>({parts.length})</small>
        </Heading>
        <Table
          aria-label="data-parts"
          columns={[
            { key: 'value', label: 'data-part' },
            { key: 'sel',   label: 'Selector' },
          ]}
          rows={parts.map((p) => ({
            value: <code>{p}</code>,
            sel:   <code>{`[data-part="${p}"]`}</code>,
          }))}
        />
      </section>
    )
  }

  // Token category
  const filtered = vars.filter((v) =>
    active === 'all-tokens' ? true : CATEGORY_OF[active](v.name),
  )
  const isColor = active === 'colors'

  return (
    <section aria-labelledby="inv-h">
      <Heading level="h2" id="inv-h">
        {label} <small>({filtered.length})</small>
      </Heading>
      <Table
        aria-label={label}
        columns={[
          ...(isColor ? [{ key: 'sw', label: '' } as const] : []),
          { key: 'name',  label: 'Token' },
          { key: 'value', label: 'Value' },
          { key: 'cat',   label: 'Category' },
        ]}
        rows={filtered.map((v) => ({
          ...(isColor ? { sw: <Swatch value={v.value} /> } : {}),
          name:  <code>{v.name}</code>,
          value: <code>{v.value || '—'}</code>,
          cat:   <span>{classify(v.name) ?? '—'}</span>,
        }))}
        empty={<p>해당 카테고리에 토큰이 없습니다.</p>}
      />
    </section>
  )
}
