/** Foundations — foundations/ 레이어 검증 대시보드. master-slave sidebar (FlatLayout). */
import { useEffect, useMemo, useState, type ReactNode } from 'react'
import { audit, type AuditData, type DemoSpec, type FoundationExport } from 'virtual:ds-audit'
import {
  Renderer, definePage, useControlState, navigateOnActivate,
  ROOT, type Event, type NormalizedData,
} from '../../ds'
import { applyPreset, defaultPreset, hairlinePreset, type DsPreset } from '../../ds/style/preset'
import * as foundations from '../../ds/foundations'
import { Callout } from '../../ds/parts'
import { buildFoundationsPage } from './build'

const presets: { id: string; label: string; preset: DsPreset }[] = [
  { id: 'default',  label: 'default',  preset: defaultPreset },
  { id: 'hairline', label: 'hairline', preset: hairlinePreset },
]

const navBase = (
  filter: string,
  fileEntries: [string, AuditData['exports']][],
  totalExports: number,
  totalLeaks: number,
  missing: number,
): NormalizedData => {
  const items: { id: string; label: string; badge: number }[] = [
    { id: 'all', label: 'All', badge: totalExports },
    ...fileEntries.map(([file, list]) => ({
      id: file,
      label: file.replace('/src/ds/foundations/', ''),
      badge: list.length,
    })),
    { id: 'missing', label: 'Missing @demo', badge: missing },
    { id: 'parts', label: 'Parts', badge: 9 },
    { id: 'leaks', label: 'Leak Report', badge: totalLeaks },
  ]
  const entities: NormalizedData['entities'] = {
    [ROOT]: { id: ROOT, data: {} },
    __focus__: { id: '__focus__', data: { id: filter } },
  }
  for (const it of items) {
    entities[it.id] = { id: it.id, data: { label: it.label, badge: it.badge, selected: it.id === filter } }
  }
  return { entities, relationships: { [ROOT]: items.map((i) => i.id) } }
}

const presetToolsBase = (presetId: string): NormalizedData => {
  const entities: NormalizedData['entities'] = {
    [ROOT]: { id: ROOT, data: {} },
    __focus__: { id: '__focus__', data: { id: presetId } },
  }
  for (const p of presets) {
    entities[p.id] = { id: p.id, data: { label: p.label, selected: p.id === presetId } }
  }
  return { entities, relationships: { [ROOT]: presets.map((p) => p.id) } }
}

export function Foundations() {
  const [presetId, setPresetId] = useState('default')
  const [filter, setFilter] = useState<string>('all')

  useEffect(() => {
    const p = presets.find((x) => x.id === presetId)?.preset ?? defaultPreset
    applyPreset(p)
  }, [presetId])

  const { exports, callSites, leaks } = audit as AuditData
  const byFile = useMemo(() => {
    const out: Record<string, AuditData['exports']> = {}
    for (const e of exports) (out[e.file] ??= []).push(e)
    return Object.entries(out)
  }, [exports])

  const missingDemos = useMemo(() => exports.filter((e) => !e.demo), [exports])

  const navData0 = useMemo(
    () => navBase(filter, byFile, exports.length, leaks.length, missingDemos.length),
    [filter, byFile, exports.length, leaks.length, missingDemos.length],
  )
  const [navData, navDispatch] = useControlState(navData0)
  const onNavEvent = (e: Event) =>
    navigateOnActivate(navData, e).forEach((ev) => {
      navDispatch(ev)
      if (ev.type === 'activate') setFilter(ev.id)
    })

  const presetData0 = useMemo(() => presetToolsBase(presetId), [presetId])
  const [presetData, presetDispatch] = useControlState(presetData0)
  const onPresetEvent = (e: Event) => {
    presetDispatch(e)
    if (e.type === 'activate') setPresetId(e.id)
  }

  return (
    <>
      <DemoStyles />
      <Renderer
        page={definePage(
          buildFoundationsPage({
            filter,
            exports, callSites, leaks, byFile,
            missingDemos,
            nav: { data: navData, onEvent: onNavEvent },
            presetTools: { data: presetData, onEvent: onPresetEvent },
            renderDemo: renderDemoFromSpec,
          }),
        )}
      />
    </>
  )
}

// ── Generic demo generator ───────────────────────────────────────────────
// `@demo type=X fn=Y args=[...]` 한 줄을 audit이 파싱.
// 라우트는 type별 generic generator만 가지고, fn은 foundations namespace에서 lookup.
// 이름이 화이트리스트(현재 export 목록)에 없으면 거부 → eval 회피.

const FOUNDATIONS = foundations as unknown as Record<string, (...args: unknown[]) => string>

function callFn(fn: string, args: DemoSpec['args']): string {
  const f = FOUNDATIONS[fn]
  if (typeof f !== 'function') return ''
  try { return f(...args) } catch { return '' }
}

function renderDemoFromSpec(e: FoundationExport): ReactNode {
  if (!e.demo) return <span data-demo="tbd">no @demo tag</span>
  const spec = e.demo
  switch (spec.type) {
    case 'color':
      return <ColorDemo value={callFn(spec.fn, spec.args)} label={spec.raw} />
    case 'pair':
      return <PairDemo css={callFn(spec.fn, spec.args)} label={spec.raw} />
    case 'selector':
      return <SelectorDemo id={`d-${e.name}`} css={callFn(spec.fn, spec.args)} arg={String(spec.args[0] ?? 'li')} />
    case 'structural':
      return <StructuralDemo id={`d-${e.name}`} css={callFn(spec.fn, spec.args)} arg={String(spec.args[0] ?? 'li')} />
    case 'recipe':
      return <RecipeDemo id={`d-${e.name}`} css={renderRecipeCss(spec)} label={spec.fn} />
    case 'icon':
      return <IconDemo css={callFn(spec.fn, spec.args)} />
    case 'value':
      return <ValueDemo value={callFn(spec.fn, spec.args)} label={spec.raw} />
    default:
      return <span data-demo="tbd">unknown type: {spec.type}</span>
  }
}

// recipe는 css 블록을 반환하기도, ({bg,fg})같이 obj 파라미터를 받기도 한다.
// pair/grouping/mute/emphasize 등은 일반 호출. recipe는 결과 css를 sample 노드에 적용한다.
function renderRecipeCss(spec: DemoSpec): string {
  if (spec.fn === 'pair') {
    // pair는 {bg,fg} 객체 인자. 데모는 accent on 페어로 예시.
    const fn = (foundations as unknown as Record<string, (a: { bg: string; fg: string }) => string>).pair
    return fn({ bg: 'var(--ds-accent)', fg: 'var(--ds-accent-on)' })
  }
  return callFn(spec.fn, spec.args)
}

// ── Type별 atomic renderers ──────────────────────────────────────────────

const ColorDemo = ({ value, label }: { value: string; label: string }) => (
  <span data-demo="swatch">
    <span data-role="chip" style={{ background: value }} />
    <code>{label}</code>
  </span>
)

const PairDemo = ({ css, label }: { css: string; label: string }) => (
  <span data-demo="pair-sample" style={cssToInline(css)}>{label}</span>
)

const ValueDemo = ({ value, label }: { value: string; label: string }) => (
  <span data-demo="value">
    <code>{label}</code>
    <span data-role="resolved" style={{ color: 'var(--ds-muted)' }}>→ {value}</span>
  </span>
)

const SelectorDemo = ({ id, css, arg }: { id: string; css: string; arg: string }) => {
  const samples = arg.includes('button')
    ? <button type="button" data-demo="focus-trigger">sample</button>
    : (
      <ul data-demo="sample-list">
        <li tabIndex={-1}>row a</li>
        <li tabIndex={-1} aria-selected="true">row b (selected)</li>
        <li tabIndex={-1} aria-disabled="true">row c (disabled)</li>
      </ul>
    )
  return (
    <div id={id} data-demo="scoped">
      <style>{css.replace(/:where\(/g, `:where(#${id} `)}</style>
      {samples}
    </div>
  )
}

const StructuralDemo = ({ id, css, arg }: { id: string; css: string; arg: string }) => {
  const samples = arg.includes('button')
    ? <button type="button" data-icon="chevronRight" />
    : arg.startsWith('[data-icon')
    ? <span data-icon="chevronRight">indicator</span>
    : (
      <ul data-demo="sample-list">
        <li>row 1</li>
        <li>row 2</li>
        <li>row 3</li>
      </ul>
    )
  return (
    <div id={id} data-demo="scoped">
      <style>{css.replace(/:where\(/g, `:where(#${id} `)}</style>
      {samples}
    </div>
  )
}

const RecipeDemo = ({ id, css, label }: { id: string; css: string; label: string }) => {
  // recipe는 css 블록(`prop: val;`)이라 :where 치환 없이 sample에 inline. css가 selector를 포함하면(iconVars 등) <style>로.
  if (/[{}]/.test(css)) {
    return (
      <div id={id} data-demo="scoped">
        <style>{css.replace(/:root\b/g, `#${id}`)}</style>
        <span data-demo="micro-label">{label}</span>
      </div>
    )
  }
  return <span data-demo="micro-label" style={cssToInline(css)}>{label}</span>
}

const IconDemo = ({ css }: { css: string }) => (
  <span data-demo="icon-sample" style={{ ...cssToInline(css), color: 'var(--ds-accent)' }} />
)

// ── helper — css 블록(`prop: val;\nprop2: val2;`)을 inline style 객체로 ─
function cssToInline(block: string): React.CSSProperties {
  const out: Record<string, string> = {}
  for (const decl of block.split(';')) {
    const [k, ...rest] = decl.split(':')
    if (!k || rest.length === 0) continue
    const prop = k.trim().replace(/-([a-z])/g, (_, c) => c.toUpperCase())
    const val = rest.join(':').trim()
    if (prop && val) out[prop] = val
  }
  return out as React.CSSProperties
}

// ── Foundation demo styles — tag + data-* selector only ─────────────────
const demoStyles = `
  [data-demo="row"] { display: flex; flex-wrap: wrap; gap: var(--ds-space); align-items: center; }
  [data-demo="scoped"] { display: flex; flex-direction: column; gap: calc(var(--ds-space) * 0.75); width: 100%; }
  [data-demo="swatch"] { display: inline-flex; align-items: center; gap: calc(var(--ds-space) * 0.75); font-size: var(--ds-text-xs); }
  [data-demo="swatch"] > [data-role="chip"] { inline-size: calc(var(--ds-space) * 2.5); block-size: calc(var(--ds-space) * 2.5); border-radius: var(--ds-radius-sm); border: 1px solid var(--ds-border); }
  [data-demo="value"] { display: inline-flex; gap: calc(var(--ds-space) * 0.75); font-size: var(--ds-text-xs); }
  [data-demo="pair-sample"] { padding: calc(var(--ds-space) * 0.5) calc(var(--ds-space) * 1.25); border-radius: var(--ds-radius-sm); display: inline-block; font-size: var(--ds-text-xs); }
  [data-demo="icon-sample"] { display: inline-block; }
  [data-demo="sample-list"] { list-style: none; margin: 0; padding: 0; width: 100%; border: 1px solid var(--ds-border); border-radius: var(--ds-radius-sm); }
  [data-demo="sample-list"] > li { padding: calc(var(--ds-space) * 0.5) calc(var(--ds-space) * 1.25); font-size: var(--ds-text-sm); cursor: default; }
  [data-demo="focus-trigger"] { padding: calc(var(--ds-space) * 0.5) calc(var(--ds-space) * 1.5); }
  [data-demo="tbd"] { color: var(--ds-muted); font-size: var(--ds-text-xs); }
`

const DemoStyles = () => <style>{demoStyles}</style>

export { Callout }
