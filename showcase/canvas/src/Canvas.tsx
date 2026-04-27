/**
 * Canvas — DS 자산 SSOT viewer.
 *
 * 자동 수집:
 *   - foundations 토큰      virtual:ds-audit ( @demo JSDoc 태그 )
 *   - ds/parts 부품         glob '@p/ds/parts/*.tsx' + _demos/*.demo.tsx
 *   - ds/ui 컴포넌트        glob '@p/ds/ui/<tier>/*.tsx' + _demos/*.demo.tsx
 *
 * 구성: 발전 단계(Stage 0 → ∞) 순으로 자산을 배치한다.
 *   Stage 0  Minimum Affordances     theme creator + foundations basics + atoms (parts·primitives·status·action)
 *   Stage 1  Form & Collection       ui/3-input · 4-selection · 5-display
 *   Stage 2  Overlay & Navigation    ui/6-overlay
 *   Stage 3  Motion & Async          motion foundations
 *   Stage 4  Responsive shells       Devices (mobile/desktop frames)
 *   Stage 5  Self-verification       primitives · control · recipes
 *   Stage ∞  Declarative · Generative ui/7-patterns · 8-layout
 *
 * 새 자산 추가 시 (export + @demo 태그 또는 _demos/<Name>.demo.tsx) 매핑된 stage에 즉시 등장한다.
 */
import { useMemo, useReducer, useState, type ComponentType, type ReactNode } from 'react'
import { ZoomPanCanvas } from '@p/ds/ui/8-layout/ZoomPanCanvas'
import { ROOT, reduce, type NormalizedData } from '@p/ds'
import { Card, Heading, KeyValue, Code } from '@p/ds/ui/parts'
import { audit } from 'virtual:ds-audit'
import { demos as catalogDemos } from '@showcase/catalog'
import { ThemeCreatorBody } from '@showcase/theme'
import { TokenCard, TypeSpecimen } from './TokenCard'
import { SectionFrame, SubGroup } from './SectionFrame'
import { partAutoDemo } from './partsAutoDemos'

const uiModules = import.meta.glob<Record<string, unknown>>('@p/ds/ui/*/*.tsx', { eager: true })
const uiDemoModules = import.meta.glob<{ default: ComponentType }>('@p/ds/ui/*/_demos/*.demo.tsx', { eager: true })
const partsModules = import.meta.glob<Record<string, unknown>>('@p/ds/parts/*.tsx', { eager: true })
const partsDemoModules = import.meta.glob<{ default: ComponentType }>('@p/ds/parts/_demos/*.demo.tsx', { eager: true })
const deviceModules = import.meta.glob<Record<string, unknown>>('@p/ds/devices/*.tsx', { eager: true })
const deviceDemoModules = import.meta.glob<{ default: ComponentType }>('@p/ds/devices/_demos/*.demo.tsx', { eager: true })

// ── Foundations: @demo → 카테고리/file 그룹 ─────────────────────────────
const CATEGORY_LABEL: Record<string, { label: string; standard?: string }> = {
  color:       { label: 'Color',       standard: 'M3 · HIG · Polaris · Atlassian · Spectrum · Fluent' },
  typography:  { label: 'Typography',  standard: 'M3 · HIG · Polaris · Atlassian · Spectrum · Fluent' },
  shape:       { label: 'Shape',       standard: 'Material 3 Shape' },
  state:       { label: 'State',       standard: '≈ Material Interaction · Atlassian States' },
  motion:      { label: 'Motion',      standard: 'M3 · HIG · Atlassian · Spectrum · Fluent' },
  layout:      { label: 'Layout',      standard: 'M3 · HIG · Polaris · Atlassian · Spectrum' },
  iconography: { label: 'Iconography', standard: 'M3 · HIG · Polaris · Spectrum · Fluent' },
  recipes:     { label: 'Recipes',     standard: '≈ Atlassian Tokens / composite' },
  primitives:  { label: 'Primitives',  standard: '≈ Atlassian Primitives · Radix' },
  control:     { label: 'Control',     standard: '≈ Material Interaction sizing' },
  elevation:   { label: 'Elevation',   standard: 'M3 · Fluent' },
}

// ── ui/<tier> → 업계 표준 어휘 매핑 ─────────────────────────────────────
const LANE_LABEL: Record<string, { label: string; standard: string }> = {
  parts:             { label: 'Content',    standard: 'Atomic atoms · Polaris/Atlassian Display' },
  'ui/0-primitives': { label: 'Primitives', standard: 'Atlassian Primitives · Radix Primitives' },
  'ui/1-status':     { label: 'Status',     standard: 'Atlassian Status indicators · Polaris Feedback' },
  'ui/2-action':     { label: 'Action',     standard: 'Ant General · Material Actions' },
  'ui/3-input':      { label: 'Input',      standard: 'Ant Data Entry · Material Text input' },
  'ui/4-selection':  { label: 'Selection',  standard: 'Ant Data Entry · Material Selection' },
  'ui/5-display':    { label: 'Display',    standard: 'Ant Data Display · Atlassian Text & data display' },
  'ui/6-overlay':    { label: 'Overlay',    standard: 'Polaris Overlays · Atlassian Overlays & layering' },
  'ui/7-patterns':   { label: 'Patterns',   standard: 'Polaris/Atlassian/GOV.UK Patterns' },
  'ui/8-layout':     { label: 'Layout',     standard: 'Ant Layout · Polaris Layout & structure' },
}

// ── 발전 단계 (Stage 0 → ∞) ─────────────────────────────────────────────
type StageId = 's0' | 's1' | 's2' | 's3' | 's4' | 's5' | 'sInf'
const STAGE_ORDER: StageId[] = ['s0', 's1', 's2', 's3', 's4', 's5', 'sInf']
const STAGE_META: Record<StageId, { num: string; label: string; intent: string }> = {
  s0:   { num: 'Stage 0', label: 'Minimum Affordances',     intent: 'theme · 색 · 타이포 · 위계 · 상태 · 모양 · 아이콘' },
  s1:   { num: 'Stage 1', label: 'Form & Collection',        intent: '입력 · 표 · 리스트 · 카드 그리드' },
  s2:   { num: 'Stage 2', label: 'Overlay & Navigation',     intent: 'Dialog · Toast · Tabs · Sidebar · Cmd' },
  s3:   { num: 'Stage 3', label: 'Motion & Async',           intent: 'duration · easing · transition · loading' },
  s4:   { num: 'Stage 4', label: 'Responsive shells',         intent: 'mobile · desktop frame separation' },
  s5:   { num: 'Stage 5', label: 'Self-verification',        intent: 'invariant · lint · primitives 어휘 폐쇄' },
  sInf: { num: 'Stage ∞', label: 'Declarative · Generative', intent: 'page-as-data · flow · LLM 어휘 닫힘' },
}

// foundation category → stage
const FOUNDATION_STAGE: Record<string, StageId> = {
  color:       's0',
  typography:  's0',
  layout:      's0',
  shape:       's0',
  state:       's0',
  iconography: 's0',
  elevation:   's0',
  motion:      's3',
  primitives:  's5',
  control:     's5',
  recipes:     's5',
}

// lane (parts / ui/<tier>) → stage
const LANE_STAGE: Record<string, StageId> = {
  parts:             's0',
  'ui/0-primitives': 's0',
  'ui/1-status':     's0',
  'ui/2-action':     's0',
  'ui/3-input':      's1',
  'ui/4-selection':  's1',
  'ui/5-display':    's1',
  'ui/6-overlay':    's2',
  'ui/7-patterns':   'sInf',
  'ui/8-layout':     'sInf',
}

const LANE_ORDER = Object.keys(LANE_LABEL)
const laneRank = (lane: string) => {
  const i = LANE_ORDER.indexOf(lane)
  return i === -1 ? LANE_ORDER.length : i
}

type TokenGroup = { category: string; exports: typeof audit.exports }
const tokenGroups: TokenGroup[] = (() => {
  const map = new Map<string, typeof audit.exports>()
  for (const e of audit.exports) {
    if (!e.demo) continue
    const m = e.file.match(/\/foundations\/([^/]+)\//)
    if (!m) continue
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

// ── 컴포넌트 데모 SSOT 우선순위 ─────────────────────────────────────────
type DemoFn = () => ReactNode
type CompNode = { name: string; demo: DemoFn | null }
type CompLane = { lane: string; nodes: CompNode[] }

function resolveDemo(name: string, colocated: ComponentType | undefined, allowAuto: boolean): DemoFn | null {
  if (colocated) {
    const C = colocated
    return () => <C />
  }
  const fromCatalog = catalogDemos[name]
  if (fromCatalog) return fromCatalog
  if (allowAuto) {
    const auto = partAutoDemo(name)
    if (auto) return auto
  }
  return null
}

function buildCompLanes(
  components: Record<string, unknown>,
  demos: Record<string, { default: ComponentType }>,
  pathRe: RegExp,
  groupOf: (m: RegExpMatchArray) => string,
  nameOf: (m: RegExpMatchArray) => string,
  allowAuto: boolean,
): CompLane[] {
  const demoIndex = new Map<string, ComponentType>()
  for (const [path, mod] of Object.entries(demos)) {
    const m = path.match(/\/_demos\/([^/]+)\.demo\.tsx$/)
    if (!m) continue
    demoIndex.set(m[1], mod.default)
  }
  const lanes = new Map<string, CompNode[]>()
  for (const path of Object.keys(components)) {
    const m = path.match(pathRe)
    if (!m) continue
    const name = nameOf(m)
    if (name.startsWith('_')) continue
    const group = groupOf(m)
    if (!lanes.has(group)) lanes.set(group, [])
    lanes.get(group)!.push({ name, demo: resolveDemo(name, demoIndex.get(name), allowAuto) })
  }
  return [...lanes.keys()].sort().map((lane) => ({
    lane,
    nodes: lanes.get(lane)!.sort((a, b) => a.name.localeCompare(b.name)),
  }))
}

const uiLanes = buildCompLanes(
  uiModules,
  uiDemoModules,
  /\/ui\/([^/]+)\/([^/]+)\.tsx$/,
  (m) => `ui/${m[1]}`,
  (m) => m[2],
  true,
)

const partsLanes = buildCompLanes(
  partsModules,
  partsDemoModules,
  /\/parts\/([^/]+)\.tsx$/,
  () => 'parts',
  (m) => m[1],
  true,
)

const deviceLanes = buildCompLanes(
  deviceModules,
  deviceDemoModules,
  /\/devices\/([^/]+)\.tsx$/,
  () => 'devices',
  (m) => m[1],
  true,
)

// ── stage 별로 자산 분배 ────────────────────────────────────────────────
const allLanes = [...partsLanes, ...uiLanes].sort((a, b) => laneRank(a.lane) - laneRank(b.lane))

function tokenGroupsForStage(stage: StageId): TokenGroup[] {
  return tokenGroups.filter((g) => FOUNDATION_STAGE[g.category] === stage)
}
function lanesForStage(stage: StageId): CompLane[] {
  return allLanes.filter((l) => LANE_STAGE[l.lane] === stage)
}

// ── 컴포넌트 이름 → import path 인덱스 ──────────────────────────────────
type CompMeta = { name: string; importPath: string; lane: string }
const compIndex = new Map<string, CompMeta>()
function addCompIndex(modules: Record<string, unknown>, pathRe: RegExp, laneOf: (m: RegExpMatchArray) => string) {
  for (const path of Object.keys(modules)) {
    const m = path.match(pathRe)
    if (!m) continue
    const fileName = m[m.length - 1]
    if (fileName.startsWith('_')) continue
    const idx = path.indexOf('/packages/ds/src/')
    if (idx < 0) continue
    const importPath = '@p/ds/' + path.slice(idx + '/packages/ds/src/'.length).replace(/\.tsx?$/, '')
    const mod = modules[path] as Record<string, unknown>
    for (const [exportName, exportVal] of Object.entries(mod)) {
      if (typeof exportVal !== 'function' || !/^[A-Z]/.test(exportName)) continue
      compIndex.set(exportName, { name: exportName, importPath, lane: laneOf(m) })
    }
  }
}
addCompIndex(uiModules,    /\/ui\/([^/]+)\/([^/]+)\.tsx$/, (m) => `ui/${m[1]}`)
addCompIndex(partsModules, /\/parts\/([^/]+)\.tsx$/,        () => 'parts')
addCompIndex(deviceModules,/\/devices\/([^/]+)\.tsx$/,      () => 'devices')

// ── 렌더 헬퍼 ──────────────────────────────────────────────────────────

function renderTokenGroup(g: TokenGroup): ReactNode {
  const byFile = new Map<string, typeof g.exports>()
  for (const e of g.exports) {
    const sub = e.file.match(/\/([^/]+)\.ts$/)?.[1] ?? 'misc'
    if (!byFile.has(sub)) byFile.set(sub, [])
    byFile.get(sub)!.push(e)
  }
  const subs = [...byFile.keys()].sort()
  const gridPart =
    g.category === 'color' || g.category === 'iconography'
      ? 'canvas-grid-color'
      : 'canvas-grid-value'
  return (
    <SectionFrame
      key={g.category}
      title={CATEGORY_LABEL[g.category]?.label ?? g.category}
      subtitle={g.category}
      standard={CATEGORY_LABEL[g.category]?.standard}
      count={g.exports.length}
    >
      {g.category === 'typography' ? (
        <div data-part="canvas-type-stack">
          {g.exports.map((e) => (
            <TypeSpecimen key={e.name + e.file} e={e} />
          ))}
        </div>
      ) : subs.length > 1 ? (
        subs.map((sub) => (
          <SubGroup key={sub} title={sub}>
            <div data-part={gridPart}>
              {byFile.get(sub)!.map((e) => (
                <TokenCard key={e.name + e.file} e={e} />
              ))}
            </div>
          </SubGroup>
        ))
      ) : (
        <div data-part={gridPart}>
          {g.exports.map((e) => (
            <TokenCard key={e.name + e.file} e={e} />
          ))}
        </div>
      )}
    </SectionFrame>
  )
}

function renderLane(
  laneObj: CompLane,
  selected: string | null,
  setSelected: (s: string | null) => void,
): ReactNode {
  const { lane, nodes } = laneObj
  const shapeKey = (n: string) => {
    const m = n.match(/[A-Z][a-z]+(?=$|[A-Z])/g)
    return m ? m[m.length - 1] : n
  }
  const shapeGroups = new Map<string, typeof nodes>()
  for (const node of nodes) {
    const k = shapeKey(node.name)
    if (!shapeGroups.has(k)) shapeGroups.set(k, [])
    shapeGroups.get(k)!.push(node)
  }
  const useGrouping = [...shapeGroups.values()].some((g) => g.length > 1)
  const groupEntries = useGrouping
    ? [...shapeGroups.entries()].sort((a, b) => b[1].length - a[1].length || a[0].localeCompare(b[0]))
    : [['', nodes] as const]
  const meta = LANE_LABEL[lane]
  const title = meta?.label ?? lane.replace(/^ui\//, '')
  return (
    <SectionFrame key={lane} title={title} subtitle={lane} standard={meta?.standard} count={nodes.length}>
      {groupEntries.map(([gkey, groupNodes]) => (
        <div key={gkey || '__flat__'} data-part="canvas-shape-group">
          {gkey && <div data-part="canvas-shape-label">{gkey}</div>}
          <div data-part="canvas-grid-comp">
            {groupNodes.map((node) => (
              <figure
                key={node.name}
                data-part="canvas-comp-card"
                data-selected={selected === node.name || undefined}
                onClick={() => setSelected(selected === node.name ? null : node.name)}
              >
                <div data-stage {...(node.demo ? {} : { 'data-empty': true })}>
                  {node.demo ? node.demo() : 'no demo'}
                </div>
                <figcaption>{node.name}</figcaption>
              </figure>
            ))}
          </div>
        </div>
      ))}
    </SectionFrame>
  )
}

// ── render ──────────────────────────────────────────────────────────────

export function Canvas() {
  const totalTokens = tokenGroups.reduce((n, g) => n + g.exports.length, 0)
  const totalComps = uiLanes.reduce((n, l) => n + l.nodes.length, 0) + partsLanes.reduce((n, l) => n + l.nodes.length, 0)
  const [selected, setSelected] = useState<string | null>(null)
  const selectedMeta = selected ? compIndex.get(selected) : null
  const selectedLaneLabel = selectedMeta ? LANE_LABEL[selectedMeta.lane] : null

  const initial = useMemo<NormalizedData>(() => ({
    entities: { [ROOT]: { id: ROOT, data: { x: 0, y: 0, s: 0.4, bounds: { minS: 0.1, maxS: 4 } } } },
    relationships: { [ROOT]: [] },
  }), [])
  const [viewData, viewDispatch] = useReducer(reduce, initial)

  return (
    <div data-part="canvas-app">
      <ZoomPanCanvas id={ROOT} data={viewData} onEvent={viewDispatch}>
        <div data-part="canvas-page">
          <header data-part="canvas-header">
            <div data-meta>Design System · Library</div>
            <h1>Product UI Styleguide</h1>
            <div data-stats>
              {totalTokens} tokens · {totalComps} components · arranged by maturity stage
            </div>
          </header>

          <div data-part="canvas-board">
            {STAGE_ORDER.map((stageId) => {
              const meta = STAGE_META[stageId]
              const tokens = tokenGroupsForStage(stageId)
              const lanes = lanesForStage(stageId)
              const isThemeStage = stageId === 's0'
              const isDevicesStage = stageId === 's4'
              const hasDevices = isDevicesStage && deviceLanes.length > 0
              const stageTokenCount = tokens.reduce((n, g) => n + g.exports.length, 0)
              const stageCompCount = lanes.reduce((n, l) => n + l.nodes.length, 0)
              const stageDeviceCount = hasDevices ? deviceLanes.reduce((n, l) => n + l.nodes.length, 0) : 0
              const summaryParts: string[] = []
              if (stageTokenCount) summaryParts.push(`${stageTokenCount} tokens`)
              if (stageCompCount) summaryParts.push(`${stageCompCount} components`)
              if (stageDeviceCount) summaryParts.push(`${stageDeviceCount} mocks`)
              if (isThemeStage) summaryParts.push('theme creator')

              const isEmpty =
                tokens.length === 0 &&
                lanes.length === 0 &&
                !hasDevices &&
                !isThemeStage

              return (
                <section key={stageId} data-part="canvas-zone">
                  <header data-part="canvas-zone-label">
                    {meta.num} · {meta.label}
                    <small>{summaryParts.join(' · ') || meta.intent}</small>
                  </header>
                  <div data-part="canvas-zone-row">
                    {/* Stage 4 — Theme creator */}
                    {isThemeStage && (
                      <SectionFrame title="Theme creator" subtitle="theme" standard="token overrides → :root vars">
                        <ThemeCreatorBody />
                      </SectionFrame>
                    )}

                    {/* Foundations 토큰 */}
                    {tokens.map(renderTokenGroup)}

                    {/* 컴포넌트 레인 */}
                    {lanes.map((lane) => renderLane(lane, selected, setSelected))}

                    {/* Stage 4 — Devices (responsive shell separation) */}
                    {hasDevices && deviceLanes.map(({ lane, nodes }) => (
                      <SectionFrame
                        key={lane}
                        title="Mock frames"
                        subtitle="devices"
                        standard="responsive shell separation"
                        count={nodes.length}
                      >
                        <div data-part="canvas-grid-comp">
                          {nodes.map((node) => (
                            <figure key={node.name} data-part="canvas-comp-card">
                              <div data-stage {...(node.demo ? {} : { 'data-empty': true })}>
                                {node.demo ? node.demo() : 'no demo'}
                              </div>
                              <figcaption>{node.name}</figcaption>
                            </figure>
                          ))}
                        </div>
                      </SectionFrame>
                    ))}

                    {/* 빈 stage — placeholder로 의도 표시 */}
                    {isEmpty && (
                      <SectionFrame title={meta.label} subtitle={stageId} standard={meta.intent}>
                        <div data-part="canvas-stage-empty">
                          이 단계의 자산은 아직 비어있다 — {meta.intent}
                        </div>
                      </SectionFrame>
                    )}
                  </div>
                </section>
              )
            })}
          </div>
        </div>
      </ZoomPanCanvas>

      {selectedMeta && (
        <aside data-part="canvas-detail" aria-label={`${selectedMeta.name} 상세`}>
          <Card
            slots={{
              title: <Heading level={3}>{selectedMeta.name}</Heading>,
              meta: (
                <span>
                  {selectedLaneLabel?.label ?? selectedMeta.lane}
                  {selectedLaneLabel?.standard && <> · ≈ {selectedLaneLabel.standard}</>}
                </span>
              ),
              body: (
                <KeyValue
                  items={[
                    { key: 'Lane', value: selectedMeta.lane },
                    {
                      key: 'Import',
                      value: <Code>{`import { ${selectedMeta.name} } from '${selectedMeta.importPath}'`}</Code>,
                    },
                  ]}
                />
              ),
              footer: (
                <a
                  href="#"
                  onClick={(e) => { e.preventDefault(); setSelected(null) }}
                  aria-label="닫기"
                >
                  닫기
                </a>
              ),
            }}
          />
        </aside>
      )}
    </div>
  )
}
