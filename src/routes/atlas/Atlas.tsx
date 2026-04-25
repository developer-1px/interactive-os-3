/** Atlas — fn/ 레이어 검증 대시보드. master-slave sidebar (FlatLayout). */
import { useEffect, useMemo, useState, type ReactNode } from 'react'
import { audit, type AuditData } from 'virtual:ds-audit'
import {
  Renderer, definePage, useControlState, navigateOnActivate,
  ROOT, type Event, type NormalizedData,
} from '../../ds'
import { applyPreset, defaultPreset, hairlinePreset, type DsPreset } from '../../ds/style/preset'
import { hover, focus, selected, selectedStrong, highlighted, active, disabled } from '../../ds/fn/state'
import { buildAtlasPage } from './build'

const presets: { id: string; label: string; preset: DsPreset }[] = [
  { id: 'default',  label: 'default',  preset: defaultPreset },
  { id: 'hairline', label: 'hairline', preset: hairlinePreset },
]

const navBase = (filter: string, fileEntries: [string, AuditData['exports']][], totalExports: number, totalLeaks: number): NormalizedData => {
  const items: { id: string; label: string; badge: number }[] = [
    { id: 'all', label: 'All', badge: totalExports },
    ...fileEntries.map(([file, list]) => ({
      id: file,
      label: file.replace('/src/ds/fn/', ''),
      badge: list.length,
    })),
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

export function Atlas() {
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

  const navData0 = useMemo(() => navBase(filter, byFile, exports.length, leaks.length), [filter, byFile, exports.length, leaks.length])
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
    <Renderer
      page={definePage(
        buildAtlasPage({
          filter,
          exports, callSites, leaks, byFile,
          nav: { data: navData, onEvent: onNavEvent },
          presetTools: { data: presetData, onEvent: onPresetEvent },
          renderDemo,
        }),
      )}
    />
  )
}

// ── Demos ────────────────────────────────────────────────────────────────

const microLabelInline: React.CSSProperties = {
  fontSize: 'var(--ds-text-xs)',
  fontWeight: 600,
  color: 'color-mix(in oklab, currentColor 50%, transparent)',
  textTransform: 'uppercase',
  letterSpacing: '.06em',
  margin: 0,
}

function renderDemo(name: string): ReactNode {
  const fn = demos[name]
  return fn ? fn() : <span style={{ color: 'var(--ds-muted)', fontSize: 'var(--ds-text-xs)' }}>demo TBD</span>
}

const Swatch = ({ color, label }: { color: string; label: string }) => (
  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 'var(--ds-text-xs)' }}>
    <span style={{ width: 20, height: 20, borderRadius: 4, background: color, border: '1px solid var(--ds-border)' }} />
    {label}
  </span>
)

const Row = ({ children }: { children: ReactNode }) => (
  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, alignItems: 'center' }}>{children}</div>
)

const Scoped = ({ id, css, children }: { id: string; css: string; children: ReactNode }) => (
  <div id={id} style={{ display: 'flex', flexDirection: 'column', gap: 6, width: '100%' }}>
    <style>{css.replace(/:where\(/g, `:where(#${id} `)}</style>
    {children}
  </div>
)

const sampleList = (items: { id: string; label: string; state?: string }[]) => (
  <ul style={{ listStyle: 'none', margin: 0, padding: 0, width: '100%', border: '1px solid var(--ds-border)', borderRadius: 'var(--ds-radius-sm)' }}>
    {items.map((it) => (
      <li
        key={it.id}
        {...(it.state ? { [it.state]: 'true' } : {})}
        tabIndex={-1}
        style={{ padding: '4px 10px', fontSize: 'var(--ds-text-sm)', cursor: 'default' }}
      >
        {it.label}
      </li>
    ))}
  </ul>
)

const demos: Record<string, () => ReactNode> = {
  fg: () => (
    <Row>
      {[1, 3, 5, 7, 9].map((n) => (
        <span key={n} style={{ color: `var(--ds-gray-${n})`, fontWeight: 600 }}>Aa{n}</span>
      ))}
    </Row>
  ),
  accent: () => (
    <Row>
      <span style={{ color: 'var(--ds-accent)', fontWeight: 600 }}>accent text</span>
      <span style={{ background: 'var(--ds-accent)', color: 'var(--ds-accent-on)', padding: '2px 8px', borderRadius: 'var(--ds-radius-pill)' }}>pill</span>
    </Row>
  ),
  onAccent: () => (
    <span style={{ background: 'var(--ds-accent)', color: 'var(--ds-accent-on)', padding: '4px 10px', borderRadius: 'var(--ds-radius-sm)' }}>
      onAccent 텍스트
    </span>
  ),
  status: () => (
    <Row>
      <Swatch color="var(--ds-success)" label="success" />
      <Swatch color="var(--ds-warning)" label="warning" />
      <Swatch color="var(--ds-danger)" label="danger" />
    </Row>
  ),
  border: () => <div style={{ width: '100%', height: 20, borderTop: '1px solid var(--ds-border)', borderBottom: '1px solid var(--ds-border)' }} />,
  muted: () => <span style={{ color: 'var(--ds-muted)' }}>muted 보조 텍스트</span>,
  bg: () => <div style={{ width: '100%', height: 32, background: 'var(--ds-bg)', border: '1px solid var(--ds-border)', borderRadius: 4 }} />,
  tint: () => (
    <Row>
      {[10, 20, 40, 60].map((p) => (
        <span key={p} style={{ background: `color-mix(in oklab, var(--ds-accent) ${p}%, transparent)`, padding: '2px 8px', borderRadius: 4, fontSize: 'var(--ds-text-xs)' }}>
          {p}
        </span>
      ))}
    </Row>
  ),
  mix: () => (
    <Row>
      {[20, 50, 80].map((p) => (
        <span key={p} style={{ background: `color-mix(in oklab, var(--ds-accent) ${p}%, Canvas)`, color: 'CanvasText', padding: '2px 8px', borderRadius: 4, fontSize: 'var(--ds-text-xs)' }}>
          {p}
        </span>
      ))}
    </Row>
  ),
  dim: () => (
    <div style={{ color: 'var(--ds-fg)' }}>
      <Row>
        {[30, 50, 70].map((p) => (
          <span key={p} style={{ color: `color-mix(in oklab, currentColor ${p}%, transparent)` }}>dim({p})</span>
        ))}
      </Row>
    </div>
  ),
  microLabel: () => <span style={microLabelInline}>SECTION LABEL</span>,
  hover: () => (
    <Scoped id="demo-hover" css={hover('li')}>
      {sampleList([{ id: 'a', label: '마우스를 올려보세요' }, { id: 'b', label: '다른 행도 시도' }])}
    </Scoped>
  ),
  active: () => (
    <Scoped id="demo-active" css={active('li')}>
      {sampleList([{ id: 'a', label: '클릭을 눌러보세요' }])}
    </Scoped>
  ),
  focus: () => (
    <Scoped id="demo-focus" css={focus('button')}>
      <div>
        <button type="button" style={{ padding: '4px 12px' }}>Tab으로 포커스</button>
      </div>
    </Scoped>
  ),
  highlighted: () => (
    <Scoped id="demo-highlighted" css={highlighted('li')}>
      {sampleList([{ id: 'a', label: 'Tab으로 진입' }, { id: 'b', label: '키 이동' }])}
    </Scoped>
  ),
  selected: () => (
    <Scoped id="demo-selected" css={selected('li')}>
      {sampleList([
        { id: 'a', label: '선택된 행', state: 'aria-selected' },
        { id: 'b', label: '일반' },
        { id: 'c', label: '일반' },
      ])}
    </Scoped>
  ),
  selectedStrong: () => (
    <Scoped id="demo-selectedstrong" css={selectedStrong('li')}>
      {sampleList([
        { id: 'a', label: '지금 이거', state: 'aria-selected' },
        { id: 'b', label: '일반' },
      ])}
    </Scoped>
  ),
  disabled: () => (
    <Scoped id="demo-disabled" css={disabled('li')}>
      {sampleList([
        { id: 'a', label: '비활성', state: 'aria-disabled' },
        { id: 'b', label: '활성' },
      ])}
    </Scoped>
  ),
}
