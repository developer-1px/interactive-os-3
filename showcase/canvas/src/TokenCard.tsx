/**
 * TokenCard — DS doc 토큰 카드. cell 렌더링은 `<TokenPreview>` 정본 어휘로 위임.
 *
 * 본 파일에 남은 책임:
 *   1) DemoSpec → TokenKind 변환 (kindOf)
 *   2) role bundle (no @demo) 처리 → RoleBundleCards
 *   3) TypeSpecimen / TokenRow — typography·table-mode 전용 layout
 */
import type { ReactNode, CSSProperties } from 'react'
import type { DemoSpec, FoundationExport } from 'virtual:ds-audit'
import * as foundations from '@p/ds/tokens/foundations'
import { TokenPreview, inferKind, type TokenKind } from './preview'

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

/** DemoSpec → TokenKind. type=color/pair/icon 직접 매핑, 나머지는 fn 추론. */
function kindOf(spec: DemoSpec): TokenKind {
  if (spec.type === 'color') return 'color'
  if (spec.type === 'pair') return 'pair'
  if (spec.type === 'icon') return 'icon'
  return inferKind(spec.fn)
}

export function TokenCard({ e, category }: { e: FoundationExport; category?: string }): ReactNode {
  // role bundle (slot/size/type 등 plain object export) — @demo 없이 shape 로 surface.
  if (!e.demo) {
    const bundle = (FN as Record<string, unknown>)[e.name]
    if (!bundle || typeof bundle !== 'object') return null
    return <RoleBundleCards name={e.name} bundle={bundle as Record<string, unknown>} category={category ?? ''} />
  }
  const spec = e.demo
  const value = callFn(spec.fn, spec.args)
  const kind = kindOf(spec)
  // color 는 value 자체가 var(--ds-X) 라 그대로 caption 에. 그 외는 호출 표기.
  const callText = kind === 'color' ? value : callOf(spec)
  return <TokenPreview kind={kind} value={value} name={e.name} call={callText} />
}

export function TypeSpecimen({ e }: { e: FoundationExport }): ReactNode {
  // role bundle (no @demo) — typography object 를 inline style 로 적용한 specimen + 단축 meta
  if (!e.demo) {
    const bundle = (FN as Record<string, unknown>)[e.name]
    if (!bundle || typeof bundle !== 'object') return null
    return (
      <>
        {Object.entries(bundle as Record<string, unknown>).map(([role, value]) => (
          <div key={role} data-part="canvas-type-row">
            <span data-specimen style={value as CSSProperties}>Aa Bg</span>
            <span data-meta title={summarizeRole(value)}>
              <code data-name>{e.name}.{role}</code>
              <span data-spec>{summarizeRoleShort(value)}</span>
            </span>
          </div>
        ))}
      </>
    )
  }
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
      <span data-meta>
        <code data-name>{e.name}({(spec.args ?? []).map((a) => JSON.stringify(a)).join(', ')})</code>
        <span data-spec>{value || '—'}</span>
      </span>
    </div>
  )
}

/** value-primary 토큰 (border/breakpoint/shape/motion/control/elevation/focus/layout/opacity/sizing/zIndex)
 *  를 row 형태로 그린다. 정사각 카드 그리드 폐기 — 정보가 visual 보다 value 인 카테고리는 table 이 적합.
 *  디팩토: Tailwind values, Open Props all-tokens, Material 3 token docs. */
export function TokenRow({ e }: { e: FoundationExport }): ReactNode {
  // role bundle 도 처리 (e.demo ❌)
  if (!e.demo) {
    const bundle = (FN as Record<string, unknown>)[e.name]
    if (!bundle || typeof bundle !== 'object') return null
    return (
      <>
        {Object.entries(bundle as Record<string, unknown>).map(([role, value]) => (
          <div key={role} data-part="canvas-token-row">
            <span data-specimen>{summarizeRoleShort(value)}</span>
            <span data-meta title={summarizeRole(value)}>
              <code data-name>{e.name}.{role}</code>
            </span>
          </div>
        ))}
      </>
    )
  }
  const spec = e.demo
  const value = callFn(spec.fn, spec.args)
  return (
    <div data-part="canvas-token-row">
      <span data-specimen>{renderValueSample(spec, value)}</span>
      <span data-meta>
        <code data-name>{e.name}({(spec.args ?? []).map((a) => JSON.stringify(a)).join(', ')})</code>
        <span data-spec title={value}>{value || '—'}</span>
      </span>
    </div>
  )
}

// ── role bundle (slot/size/type) ───────────────────────────────────────
// 업계 de facto (Radix/Open Props/Spectrum): shape = type. category 별 sample
// 만 분기 — 1 카테고리 = 1 sample renderer. annotation·registry ❌.

function RoleBundleCards({ name, bundle, category }: { name: string; bundle: Record<string, unknown>; category: string }): ReactNode {
  return (
    <>
      {Object.entries(bundle).map(([role, value]) => (
        <figure key={role} data-part="canvas-token-card" data-token-type="role">
          <div data-sample>{renderRoleSample(category, value)}</div>
          <span data-name>{name}.{role}</span>
          <span data-call title={summarizeRole(value)}>{summarizeRoleShort(value)}</span>
        </figure>
      ))}
    </>
  )
}

function renderRoleSample(category: string, value: unknown): ReactNode {
  if (category === 'typography' && isPlainObject(value)) {
    return <span style={value as CSSProperties}>Aa Bg</span>
  }
  if (category === 'spacing' && isPlainObject(value)) {
    const v = value as Record<string, string>
    return (
      <div style={{ padding: v.pad ?? v.inset, gap: v.gap, display: 'grid', placeItems: 'center', outline: '1px dashed #999', background: '#eee', minBlockSize: 48 }}>
        <div style={{ inlineSize: 24, blockSize: 24, background: '#fff' }} />
      </div>
    )
  }
  if (category === 'spacing' && typeof value === 'string') {
    // size 처럼 단일 string 치수
    return <div style={{ inlineSize: value, blockSize: 24, background: '#888' }} />
  }
  return <code style={{ fontSize: 12 }}>{summarizeRole(value)}</code>
}

function summarizeRole(value: unknown): string {
  if (typeof value === 'string') return value
  if (isPlainObject(value)) {
    return Object.entries(value as Record<string, unknown>)
      .map(([k, v]) => `${k}: ${typeof v === 'string' ? v : JSON.stringify(v)}`)
      .join(' · ')
  }
  return String(value)
}

/** caption 용 단축형 — `var(--ds-text-sm)` → `sm`, `var(--ds-weight-medium)` → `medium`.
 *  raw var dump 가 카드 caption 을 지배하는 문제 해결. 자세한 형태는 `title` (hover) 에 보존. */
function summarizeRoleShort(value: unknown): string {
  if (typeof value === 'string') return stripVar(value)
  if (isPlainObject(value)) {
    return Object.values(value as Record<string, unknown>).map(stripVar).join(' · ')
  }
  return String(value)
}
function stripVar(s: unknown): string {
  if (typeof s !== 'string') return String(s)
  const m = s.match(/var\(--ds-[a-z]+-([^)]+)\)/)
  return m ? m[1] : s
}

const isPlainObject = (v: unknown): v is Record<string, unknown> =>
  v !== null && typeof v === 'object' && !Array.isArray(v)

// ── helpers ────────────────────────────────────────────────────────────

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
  if (fn === 'ringWidth')
    return <div style={{ width: 64, height: 32, background: '#fff', outline: `${value} solid var(--ds-accent, #4a90e2)`, outlineOffset: 2 }} />
  return <code style={{ fontSize: 14 }}>{value || '—'}</code>
}
