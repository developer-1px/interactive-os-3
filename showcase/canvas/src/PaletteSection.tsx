/**
 * PaletteSection — 디자인 토큰 페이지 (수치 raw scale).
 *
 * 데이터 소스: virtual:ds-audit 의 exports 중 file path 가 `/palette/` 인 것.
 * 자동화: @demo 태그의 `scale=[...]` 으로 카드 시리즈 자동 생성.
 *   - scale 있음 → 각 scale 값으로 fn 호출, 카드 N개
 *   - scale 없음 → 단일 카드 (transformation fn: tint·mix·dim 등)
 *
 * 새 palette export 추가하면 자동 등장. scale 명시하면 자동 그리드.
 */
import type { ReactNode, CSSProperties } from 'react'
import type { DemoSpec, FoundationExport } from 'virtual:ds-audit'
import { audit } from 'virtual:ds-audit'
import * as palette from '@p/ds/tokens/palette'
import { ThemeCreatorBody } from '@showcase/theme'
import { SectionFrame, SubGroup } from './SectionFrame'
import { ColumnBanner } from './ColumnBanner'

const FN = palette as unknown as Record<string, (...args: unknown[]) => string>

function callFn(fn: string, args: DemoSpec['args']): string {
  const f = FN[fn]
  if (typeof f !== 'function') return ''
  try { return f(...args) } catch { return '' }
}

import type { CategoryMeta } from '@p/ds/tokens/category-meta'

type PaletteGroup = { category: string; exports: FoundationExport[] }

// palette/<cat>.category.ts 자동 수집 — canvas 측 하드코딩 ❌
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
  const label = `${e.name}(${scaleArg})`
  // value type — preview by fn (color scales handled by renderColorRamp)
  let sample: ReactNode = <code style={{ fontSize: 12 }}>{value || '—'}</code>
  if (spec.fn === 'elev') {
    sample = <div style={{ width: 64, height: 64, background: '#fff', boxShadow: value, borderRadius: 6 }} />
  } else if (spec.fn === 'emStep' || spec.fn === 'insetStep') {
    sample = (
      <div style={{ display: 'inline-block', padding: value, background: '#eee', outline: '1px dashed #999' }}>
        <div style={{ width: 24, height: 24, background: '#fff' }} />
      </div>
    )
  }
  return (
    <figure key={`${e.name}-${scaleArg}`} data-part="canvas-token-card" data-token-type="value">
      <div data-sample>{sample}</div>
      <span data-name>{label}</span>
      <span data-call title={value}>{value || '—'}</span>
    </figure>
  )
}

/**
 * Color ramp — Radix Colors · Tailwind · IBM Carbon 수렴 디팩토.
 * 9개 카드 분리 ❌ → 한 줄 flush strip + 스케일 라벨 인레이.
 * 스케일 ≥5 면 흰 텍스트, 미만이면 검정 (자동 대비).
 */
function renderColorRamp(e: FoundationExport): ReactNode {
  const spec = e.demo!
  const scale = spec.scale!
  return (
    <div data-part="canvas-color-ramp">
      <div data-tiles role="group" aria-label={`${e.name} scale`}>
        {scale.map((s) => {
          const args = [s, ...spec.args.slice(1)]
          const value = callFn(spec.fn, args)
          const isDark = typeof s === 'number' && s >= 5
          return (
            <div
              key={String(s)}
              data-tile
              data-dark={isDark || undefined}
              style={{ background: value }}
              title={`${e.name}(${s}) = ${value}`}
            >
              <span data-step>{s}</span>
              <span data-hex>{value}</span>
            </div>
          )
        })}
      </div>
      <div data-meta>
        <code data-name>{e.name}({String(scale[0])}…{String(scale[scale.length - 1])})</code>
        <span data-range>{scale.length} steps</span>
      </div>
    </div>
  )
}

/**
 * Spacing bar stack — Material 3 spacing reference · Polaris space scale 수렴.
 * 카드 그리드 ❌ → 가로 행 스택. 각 행: 라벨 · 막대(길이=value) · 수치.
 */
function renderSpaceStack(e: FoundationExport): ReactNode {
  const spec = e.demo!
  const scale = spec.scale!
  return (
    <div data-part="canvas-space-stack">
      {scale.map((s) => {
        const args = [s, ...spec.args.slice(1)]
        const value = callFn(spec.fn, args)
        return (
          <div key={String(s)} data-row>
            <code data-label>{e.name}({s})</code>
            <div data-bar style={{ inlineSize: value || 0 }} />
            <span data-value>{value || '0'}</span>
          </div>
        )
      })}
    </div>
  )
}

/**
 * Elevation tower — Material 3 surface tonal elevation 수렴.
 * 4 surface 가 같은 높이로 늘어서 그림자 강도 비교.
 */
function renderElevTower(e: FoundationExport): ReactNode {
  const spec = e.demo!
  const scale = spec.scale!
  return (
    <div data-part="canvas-elev-tower">
      {scale.map((s) => {
        const args = [s, ...spec.args.slice(1)]
        const value = callFn(spec.fn, args)
        return (
          <figure key={String(s)} data-tile>
            <div data-surface style={{ boxShadow: value }} />
            <figcaption>
              <code>{e.name}({s})</code>
            </figcaption>
          </figure>
        )
      })}
    </div>
  )
}

function renderSingleCard(e: FoundationExport): ReactNode {
  const spec = e.demo!
  const value = callFn(spec.fn, spec.args)
  const callExpr = `${spec.fn}(${spec.args.map((a) => JSON.stringify(a)).join(', ')})`
  if (spec.type === 'color') {
    return (
      <figure key={e.name} data-part="canvas-token-card" data-token-type="color">
        <div data-swatch style={{ backgroundColor: value }} />
        <span data-name>{e.name}</span>
        <span data-call>{callExpr}</span>
      </figure>
    )
  }
  return (
    <figure key={e.name} data-part="canvas-token-card" data-token-type="value">
      <div data-sample><code style={{ fontSize: 12 }}>{value || '—'}</code></div>
      <span data-name>{e.name}</span>
      <span data-call title={value}>{callExpr}</span>
    </figure>
  )
}

function renderExport(e: FoundationExport): ReactNode {
  const spec = e.demo!
  if (spec.scale && spec.scale.length > 0) {
    if (spec.type === 'color') return renderColorRamp(e)
    if (spec.fn === 'pad') return renderSpaceStack(e)
    if (spec.fn === 'elev') return renderElevTower(e)
    return spec.scale.map((s) => renderScaleCard(e, s))
  }
  return renderSingleCard(e)
}

export function PaletteSection(): ReactNode {
  if (paletteGroups.length === 0) return null
  return (
    <section data-part="canvas-palette-column" data-tone="neutral">
      <ColumnBanner
        tier="L0"
        tone="neutral"
        title="Tokens"
        hint="palette = raw scale. semantic 한 층 아래 ref token. widget 직접 호출 ❌"
      />
      <SectionFrame title="Theme creator" subtitle="theme" standard="palette controls → :root vars">
        <ThemeCreatorBody />
      </SectionFrame>
      <div data-part="canvas-palette-groups">
        {paletteGroups.map((g) => {
          const meta = CATEGORY_LABEL[g.category]
          const totalCards = g.exports.reduce((n, e) => n + (e.demo?.scale?.length ?? 1), 0)
          const gridPart = g.category === 'color' ? 'canvas-grid-color' : 'canvas-grid-value'
          return (
            <SectionFrame
              key={g.category}
              title={meta?.label ?? g.category}
              subtitle={`palette/${g.category}`}
              standard={meta?.standard}
              count={totalCards}
            >
              {g.exports.map((e) => {
                const cards = renderExport(e)
                const spec = e.demo!
                const isScale = !!spec.scale && spec.scale.length > 0
                // 특화 렌더러는 자체 layout 보유 → grid 래퍼 우회
                const specialized = isScale && (spec.type === 'color' || spec.fn === 'pad' || spec.fn === 'elev')
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
