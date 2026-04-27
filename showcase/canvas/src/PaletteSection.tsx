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

const FN = palette as unknown as Record<string, (...args: unknown[]) => string>

function callFn(fn: string, args: DemoSpec['args']): string {
  const f = FN[fn]
  if (typeof f !== 'function') return ''
  try { return f(...args) } catch { return '' }
}

type PaletteGroup = { category: string; exports: FoundationExport[] }

const CATEGORY_LABEL: Record<string, { label: string; standard: string }> = {
  color: { label: 'Color',     standard: 'M3 ref · Carbon palette · Radix scales' },
  space: { label: 'Spacing',   standard: 'M3 ref · Atlassian space · Polaris space' },
  elev:  { label: 'Elevation', standard: 'M3 ref · Atlassian elevation' },
}

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
  if (spec.type === 'color') {
    return (
      <figure key={`${e.name}-${scaleArg}`} data-part="canvas-token-card" data-token-type="color">
        <div data-swatch style={{ backgroundColor: value }} />
        <span data-name>{label}</span>
        <span data-call>{value}</span>
      </figure>
    )
  }
  // value type — preview by fn
  let sample: ReactNode = <code style={{ fontSize: 12 }}>{value || '—'}</code>
  if (spec.fn === 'pad') {
    sample = <div style={{ width: value, height: 12, background: '#999' }} />
  } else if (spec.fn === 'elev') {
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
    return spec.scale.map((s) => renderScaleCard(e, s))
  }
  return renderSingleCard(e)
}

export function PaletteSection(): ReactNode {
  if (paletteGroups.length === 0) return null
  return (
    <section data-part="canvas-palette-page">
      <h2 data-part="canvas-page-label">
        <strong>L0 · Palette</strong>
        <span>Design Tokens · raw scale</span>
        <small>palette = 수치. semantic 보다 한 층 아래의 ref token. widget 직접 호출 ❌</small>
      </h2>
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
                const isScale = !!e.demo?.scale && e.demo.scale.length > 0
                return (
                  <SubGroup key={e.name} title={e.name}>
                    <div data-part={gridPart} style={isScale ? ({ ['--cols' as string]: e.demo!.scale!.length } as CSSProperties) : undefined}>
                      {cards}
                    </div>
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
