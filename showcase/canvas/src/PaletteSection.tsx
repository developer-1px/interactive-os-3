/**
 * PaletteSection — L0 palette 스칼라 토큰 카탈로그.
 *
 * 데이터 소스: virtual:ds-audit 의 exports 중 file path 가 `/palette/` 인 것.
 * scale=[...] 가 있으면 카드 시리즈 자동 생성, 없으면 단일 카드.
 *
 * 책임: **scalar token (인자 = 숫자 / 슬롯 인덱스) 만**.
 * 시맨틱 role-based 토큰(accent/text/surface/border/status…) 은 SemanticSection 이.
 */
import type { ReactNode, CSSProperties } from 'react'
import type { DemoSpec, FoundationExport } from 'virtual:ds-audit'
import { audit } from 'virtual:ds-audit'
import * as palette from '@p/ds/tokens/palette'
import { SectionFrame, SubGroup } from './SectionFrame'
import { ColumnBanner } from './ColumnBanner'
import { CanvasTokensToc, type TocItem } from './CanvasTokensToc'
import { TokenPreview, inferKind } from './preview'

const FN = palette as unknown as Record<string, (...args: unknown[]) => string>

function callFn(fn: string, args: DemoSpec['args']): string {
  const f = FN[fn]
  if (typeof f !== 'function') return ''
  try { return f(...args) } catch { return '' }
}

import type { CategoryMeta } from '@p/ds/tokens/category-meta'

type PaletteGroup = { category: string; exports: FoundationExport[] }

// palette/<cat>.category.ts 자동 수집
const categoryMetaModules = import.meta.glob<{ default: CategoryMeta }>(
  '@p/ds/tokens/palette/*.category.ts',
  { eager: true },
)
const CATEGORY_LABEL: Record<string, CategoryMeta> = (() => {
  const out: Record<string, CategoryMeta> = {}
  for (const [path, mod] of Object.entries(categoryMetaModules)) {
    const m = path.match(/\/palette\/([^/]+)\.category\.ts$/)
    if (m) out[m[1]] = mod.default
  }
  return out
})()

export const paletteGroups: PaletteGroup[] = (() => {
  const map = new Map<string, FoundationExport[]>()
  for (const e of audit.exports) {
    const m = e.file.match(/\/palette\/([^/]+)\.ts$/)
    if (!m) continue
    if (!e.demo) continue
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

export const paletteTotal = paletteGroups.reduce(
  (n, g) => n + g.exports.reduce((m, e) => m + (e.demo?.scale?.length ?? 1), 0),
  0,
)

function renderScaleCard(e: FoundationExport, scaleArg: string | number): ReactNode {
  const spec = e.demo!
  const args = [scaleArg, ...spec.args.slice(1)]
  const value = callFn(spec.fn, args)
  return (
    <TokenPreview
      key={`${e.name}-${scaleArg}`}
      kind={inferKind(spec.fn)}
      value={value}
      name={`${e.name}(${scaleArg})`}
      call={value || '—'}
    />
  )
}

/**
 * Color ramp — Radix Colors · Tailwind · IBM Carbon 수렴 디팩토.
 * 9개 카드 분리 ❌ → 한 줄 flush strip + 스케일 라벨 인레이.
 */
function renderColorRamp(e: FoundationExport): ReactNode {
  const spec = e.demo!
  const scale = spec.scale!
  return (
    <div data-part="canvas-color-ramp">
      <div data-tiles role="group" aria-label={`${e.name} scale`}>
        {scale.map((s) => {
          const value = callFn(spec.fn, [s, ...spec.args.slice(1)])
          const isDark = typeof s === 'number' && s >= 5
          return (
            <div key={String(s)} data-tile data-dark={isDark || undefined} style={{ background: value }}>
              <span data-step>{s}</span>
              <span data-hex>{value}</span>
            </div>
          )
        })}
      </div>
      <div data-meta>
        <code data-name>{e.name}(N)</code>
        <span data-range>{`${scale[0]} → ${scale[scale.length - 1]}`}</span>
      </div>
    </div>
  )
}

function renderSpaceStack(e: FoundationExport): ReactNode {
  const spec = e.demo!
  const scale = spec.scale!
  return (
    <div data-part="canvas-space-stack">
      {scale.map((s) => {
        const value = callFn(spec.fn, [s, ...spec.args.slice(1)])
        return (
          <div key={String(s)} data-row>
            <code data-label>{`${e.name}(${s})`}</code>
            <div data-bar style={{ inlineSize: value }} />
            <span data-value>{value}</span>
          </div>
        )
      })}
    </div>
  )
}

function renderElevTower(e: FoundationExport): ReactNode {
  const spec = e.demo!
  const scale = spec.scale!
  return (
    <div data-part="canvas-elev-tower">
      {scale.map((s) => {
        const value = callFn(spec.fn, [s, ...spec.args.slice(1)])
        return (
          <figure key={String(s)} data-tile>
            <div data-surface style={{ boxShadow: value }} />
            <figcaption>{`${e.name}(${s})`}</figcaption>
          </figure>
        )
      })}
    </div>
  )
}

function renderTypeStack(e: FoundationExport): ReactNode {
  const spec = e.demo!
  const reversed = [...spec.scale!].reverse()
  return (
    <div data-part="canvas-type-stack">
      {reversed.map((s) => {
        const value = callFn(spec.fn, [s, ...spec.args.slice(1)])
        return (
          <div key={String(s)} data-part="canvas-type-row">
            <div data-specimen style={{ fontSize: value }}>Aa 가나 1234</div>
            <div data-meta>
              <code>{e.name}({JSON.stringify(s)})</code> · {value}
            </div>
          </div>
        )
      })}
    </div>
  )
}

function renderExport(e: FoundationExport): ReactNode {
  const spec = e.demo!
  if (spec.scale && spec.scale.length > 0) {
    if (spec.type === 'color') return renderColorRamp(e)
    if (spec.fn === 'pad') return renderSpaceStack(e)
    if (spec.fn === 'elev') return renderElevTower(e)
    if (spec.fn === 'font') return renderTypeStack(e)
    return spec.scale.map((s) => renderScaleCard(e, s))
  }
  // 단일 — TokenPreview 1 cell
  const value = callFn(spec.fn, spec.args)
  const callExpr = `${spec.fn}(${spec.args.map((a) => JSON.stringify(a)).join(', ')})`
  return (
    <TokenPreview
      kind={inferKind(spec.fn)}
      value={value}
      name={e.name}
      call={callExpr}
    />
  )
}

// noise — palette/font 의 leading/tracking/weight 는 인덱스 기반 scale 이 아니라 role 기반이라 Foundations 영역.
const FONT_NOISE = new Set(['leading', 'tracking', 'weight'])

export function PaletteSection(): ReactNode {
  if (paletteGroups.length === 0) return null
  const groups = paletteGroups.map((g) =>
    g.category === 'font'
      ? { ...g, exports: g.exports.filter((e) => !FONT_NOISE.has(e.name)) }
      : g,
  )
  const tocItems: TocItem[] = groups.map((g, i) => ({
    num: String(i + 1).padStart(2, '0'),
    label: CATEGORY_LABEL[g.category]?.label ?? g.category,
    href: `#${g.category}`,
  }))
  return (
    <section data-part="canvas-palette-column" data-tone="neutral">
      <ColumnBanner
        tier="L0"
        tone="neutral"
        title="Tokens"
        hint="palette = raw scale. 인자 = 숫자/슬롯 인덱스. semantic role 토큰은 Foundations 으로."
      />
      <CanvasTokensToc items={tocItems} />
      <div data-part="canvas-palette-groups">
        {groups.map((g, i) => {
          const meta = CATEGORY_LABEL[g.category]
          const totalCards = g.exports.reduce((n, e) => n + (e.demo?.scale?.length ?? 1), 0)
          const gridPart = g.category === 'color' ? 'canvas-grid-color' : 'canvas-grid-value'
          return (
            <SectionFrame
              key={g.category}
              num={String(i + 1).padStart(2, '0')}
              id={g.category}
              title={meta?.label ?? g.category}
              subtitle={`palette/${g.category}`}
              count={totalCards}
            >
              {g.exports.map((e) => {
                const cards = renderExport(e)
                const spec = e.demo!
                const isScale = !!spec.scale && spec.scale.length > 0
                const specialized = isScale && (spec.type === 'color' || spec.fn === 'pad' || spec.fn === 'elev' || spec.fn === 'font')
                return (
                  <SubGroup key={e.name} title={e.name}>
                    {specialized ? cards : (
                      <div data-part={gridPart} style={isScale ? ({ ['--cols' as string]: spec.scale!.length } as CSSProperties) : undefined}>
                        {cards}
                      </div>
                    )}
                  </SubGroup>
                )
              })}
            </SectionFrame>
          )
        })}
      </div>
    </section>
  )
}
