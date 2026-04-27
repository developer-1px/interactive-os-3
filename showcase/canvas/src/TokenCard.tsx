/**
 * TokenCard — DS doc 토큰 카드. 셀렉터 [data-part="canvas-token-card"].
 * type 별 sample 영역만 분기 — 카드 frame은 CSS가 담당.
 */
import type { ReactNode, CSSProperties } from 'react'
import type { DemoSpec, FoundationExport } from 'virtual:ds-audit'
import * as foundations from '@p/ds/tokens/foundations'
import { renderDemoFromSpec } from '@showcase/foundations/demoRenderers'

const FN = foundations as unknown as Record<string, (...args: unknown[]) => string>

function callFn(fn: string, args: DemoSpec['args']): string {
  const f = FN[fn]
  if (typeof f !== 'function') return ''
  try { return f(...args) } catch { return '' }
}

const callOf = (spec: DemoSpec) =>
  spec.args.length === 0
    ? `${spec.fn}()`
    : `${spec.fn}(${spec.args.map((a) => JSON.stringify(a)).join(', ')})`

export function TokenCard({ e }: { e: FoundationExport }): ReactNode {
  if (!e.demo) return null
  const spec = e.demo
  const value = callFn(spec.fn, spec.args)

  // 모든 variant: 3개의 직접 자식 (visual · name · call) — subgrid 행 정렬
  if (spec.type === 'color') {
    return (
      <figure data-part="canvas-token-card" data-token-type="color">
        <div data-swatch style={{ backgroundColor: value }} />
        <span data-name>{e.name}</span>
        <span data-call>{value}</span>
      </figure>
    )
  }

  if (spec.type === 'pair') {
    return (
      <figure data-part="canvas-token-card" data-token-type="pair">
        <div data-swatch style={pairSwatch(value)}>Aa</div>
        <span data-name>{e.name}</span>
        <span data-call>{callOf(spec)}</span>
      </figure>
    )
  }

  if (spec.type === 'value') {
    return (
      <figure data-part="canvas-token-card" data-token-type="value">
        <div data-sample>{renderValueSample(spec, value)}</div>
        <span data-name>{e.name}</span>
        <span data-call title={value}>{value || '—'}</span>
      </figure>
    )
  }

  if (spec.type === 'icon') {
    return (
      <figure data-part="canvas-token-card" data-token-type="icon">
        <div data-swatch dangerouslySetInnerHTML={{ __html: extractSvg(value) }} />
        <span data-name>{e.name}</span>
        <span data-call />
      </figure>
    )
  }

  // recipe / selector / structural — 기존 renderer 위임
  return (
    <figure data-part="canvas-token-card" data-token-type={spec.type}>
      <div data-frame>{renderDemoFromSpec(e)}</div>
      <span data-name>{e.name}</span>
      <span data-call>{callOf(spec)}</span>
    </figure>
  )
}

export function TypeSpecimen({ e }: { e: FoundationExport }): ReactNode {
  if (!e.demo) return null
  const spec = e.demo
  const value = callFn(spec.fn, spec.args)
  const sample =
    spec.fn === 'tracking' || spec.fn === 'trackingScale' ? 'TRACKING'
    : spec.fn === 'weight' ? 'Bold Aa'
    : spec.fn === 'leading' || spec.fn === 'headingLeading'
      ? 'The quick brown fox jumps'
    : spec.fn === 'underlineOffset' ? <u>underline</u>
    : 'Aa Bg'
  return (
    <div data-part="canvas-type-row">
      <span data-specimen style={specimenStyle(spec, value)}>{sample}</span>
      <span data-meta>{e.name}({(spec.args ?? []).map((a) => JSON.stringify(a)).join(', ')}) · {value || '—'}</span>
    </div>
  )
}

// ── helpers ────────────────────────────────────────────────────────────

function pairSwatch(css: string): CSSProperties {
  const out: Record<string, string> = {}
  for (const decl of css.split(';')) {
    const i = decl.indexOf(':')
    if (i < 0) continue
    const k = decl.slice(0, i).trim()
    const v = decl.slice(i + 1).trim()
    if (!k || !v) continue
    out[toCamel(k)] = v
  }
  out.display = 'grid'
  out.placeItems = 'center'
  out.font = '600 28px system-ui'
  return out as CSSProperties
}
const toCamel = (s: string) => s.replace(/-([a-z])/g, (_, c) => c.toUpperCase())

function extractSvg(raw: string): string {
  const m = raw.match(/url\(["']?(data:image\/svg\+xml[^"')]+)["']?\)/)
  if (m) {
    const url = m[1]
    const comma = url.indexOf(',')
    return decodeURIComponent(url.slice(comma + 1))
  }
  if (raw.startsWith('<svg')) return raw
  return ''
}

function specimenStyle(spec: DemoSpec, value: string): CSSProperties {
  if (spec.fn === 'font' || spec.fn === 'headingSize') return { fontSize: value, lineHeight: 1.05 }
  if (spec.fn === 'leading' || spec.fn === 'headingLeading') return { lineHeight: value, fontSize: 16, fontWeight: 400 }
  if (spec.fn === 'weight') return { fontWeight: value, fontSize: 28 }
  if (spec.fn === 'tracking' || spec.fn === 'trackingScale') return { letterSpacing: value, fontSize: 20 }
  if (spec.fn === 'underlineOffset') return { fontSize: 20, textUnderlineOffset: value, textDecoration: 'underline' }
  return { fontSize: 20 }
}

function renderValueSample(spec: DemoSpec, value: string): ReactNode {
  const fn = spec.fn
  if (fn === 'radius') return <div style={{ width: 64, height: 64, background: '#ddd', borderRadius: value }} />
  if (fn === 'hairlineWidth') return <div style={{ width: 120, height: 0, borderTop: `${value} solid #333` }} />
  if (fn === 'shadow') return <div style={{ width: 80, height: 80, background: '#fff', boxShadow: value, borderRadius: 6 }} />
  if (fn === 'dur' || fn === 'ease') return <code style={{ fontSize: 13 }}>{value}</code>
  if (fn === 'inset')
    return (
      <div style={{ display: 'inline-block', padding: value, background: '#eee', outline: '1px dashed #999' }}>
        <div style={{ width: 32, height: 32, background: '#fff' }} />
      </div>
    )
  if (fn === 'control')
    return (
      <div style={{ height: value, minWidth: 80, background: '#eee', display: 'grid', placeItems: 'center', font: '500 12px system-ui' }}>
        {value}
      </div>
    )
  if (fn === 'focusRingWidth')
    return <div style={{ width: 64, height: 32, background: '#fff', outline: `${value} solid var(--ds-accent, #4a90e2)`, outlineOffset: 2 }} />
  return <code style={{ fontSize: 14 }}>{value || '—'}</code>
}
