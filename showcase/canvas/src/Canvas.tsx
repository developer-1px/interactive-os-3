/**
 * Canvas — DS 자산 SSOT viewer.
 *
 * 시퀀스 3 페이지 (위→아래):
 *   L0  Palette        raw scale (수치)            ← PaletteSection.tsx
 *   L1  Semantic       token names (foundations)
 *   L2  Components     ui/parts · ui/<tier> · devices
 *
 * 자동 수집:
 *   - foundations 토큰      virtual:ds-audit ( @demo JSDoc 태그 )
 *   - palette 토큰          virtual:ds-audit ( @demo + scale=[...] )
 *   - ui 컴포넌트            glob '@p/ds/ui/*&#47;*.tsx' + _demos/*.demo.tsx
 *   - devices               glob '@p/ds/devices/*.tsx' + _demos/*.demo.tsx
 *
 * 새 자산 추가 시 즉시 등장 — `LANE_LABEL` 의 lane 순서만 SSOT.
 */
import { useMemo, useReducer, useState, type ComponentType, type ReactNode } from 'react'
import { ZoomPanCanvas } from '@p/ds/ui/8-layout/ZoomPanCanvas'
import { ROOT, reduce, type NormalizedData } from '@p/ds'
import { Card, Heading, KeyValue, Code } from '@p/ds/ui/parts'
import { audit } from 'virtual:ds-audit'
import { demos as catalogDemos } from '@showcase/catalog'
import { TokenCard, TypeSpecimen } from './TokenCard'
import { SectionFrame, SubGroup } from './SectionFrame'
import { partAutoDemo } from './partsAutoDemos'
import { PaletteSection, paletteTotal } from './PaletteSection'

const uiModules = import.meta.glob<Record<string, unknown>>('@p/ds/ui/*/*.tsx', { eager: true })
const uiDemoModules = import.meta.glob<{ default: ComponentType }>('@p/ds/ui/*/_demos/*.demo.tsx', { eager: true })
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

// ── ui/<tier> → 업계 표준 어휘 매핑. 이 순서가 곧 화면 순서. ─────────────
const LANE_LABEL: Record<string, { label: string; standard: string }> = {
  'ui/parts':        { label: 'Content',    standard: 'Atomic atoms · Polaris/Atlassian Display' },
  'ui/0-primitives': { label: 'Primitives', standard: 'Atlassian Primitives · Radix Primitives' },
  'ui/1-status':     { label: 'Status',     standard: 'Atlassian Status indicators · Polaris Feedback' },
  'ui/2-action':     { label: 'Action',     standard: 'Ant General · Material Actions' },
  'ui/3-input':      { label: 'Input',      standard: 'Ant Data Entry · Material Text input' },
  'ui/4-selection':  { label: 'Selection',  standard: 'Ant Data Entry · Material Selection' },
  'ui/5-display':    { label: 'Display',    standard: 'Ant Data Display · Atlassian Text & data display' },
  'ui/6-overlay':    { label: 'Overlay',    standard: 'Polaris Overlays · Atlassian Overlays & layering' },
  'ui/patterns':     { label: 'Patterns',   standard: 'Polaris/Atlassian/GOV.UK Patterns' },
  'ui/8-layout':     { label: 'Layout',     standard: 'Ant Layout · Polaris Layout & structure' },
  devices:           { label: 'Devices',    standard: 'Mock frame · responsive shell separation' },
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
    lanes.get(group)!.push({ name, demo: resolveDemo(name, demoIndex.get(name), true) })
  }
  return [...lanes.keys()].map((lane) => ({
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
)

const deviceLanes = buildCompLanes(
  deviceModules,
  deviceDemoModules,
  /\/devices\/([^/]+)\.tsx$/,
  () => 'devices',
  (m) => m[1],
)

const allLanes = [...uiLanes, ...deviceLanes].sort((a, b) => laneRank(a.lane) - laneRank(b.lane))

// ── Atom 분류 (소스 ARIA role + roving 검증 기반) ─────────────────────
// ATOM = 1 role = 1 component · roving 0 · leaf role (button·switch·checkbox·radio·separator) 또는 role 없음.
// NOT ATOM = roving 1, 또는 composition role (listbox·menu·tablist·tree·grid·dialog·group·alert·status·feed·combobox·rowgroup 등),
//            또는 slot 합성 / 다중 자식 구조 (<dl>·<nav>·<table>).
const ATOM_LANES = new Set<string>([
  'ui/0-primitives', // CodeBlock·Link·Prose·Separator
  'ui/1-status',     // Badge·LegendDot·Progress
  'ui/2-action',     // Button·Switch·ToolbarButton
])
// 혼합 lane 의 atom 들 — 명시 화이트리스트
const ATOM_NAMES = new Set<string>([
  // ui/3-input 단순 (leaf role 또는 passive)
  'Input', 'Checkbox', 'Radio', 'Textarea',
  // ui/8-layout 의 layout primitive (composition role 없음)
  'Row', 'Column', 'Grid', 'Split',
  // ui/parts 의 content atoms (role 없음, 단일 시각 단위)
  'Heading', 'Tag', 'Code', 'Link', 'Avatar', 'Thumbnail',
  'Skeleton', 'Timestamp', 'Badge', 'Progress',
])
function isAtom(name: string, lane: string): boolean {
  if (ATOM_LANES.has(lane)) return true
  return ATOM_NAMES.has(name)
}
function splitLaneByAtom(l: CompLane): { atoms: CompLane; composed: CompLane } {
  const atoms: CompNode[] = []
  const composed: CompNode[] = []
  for (const n of l.nodes) {
    if (isAtom(n.name, l.lane)) atoms.push(n)
    else composed.push(n)
  }
  return {
    atoms: { lane: l.lane, nodes: atoms },
    composed: { lane: l.lane, nodes: composed },
  }
}
const atomLanes = allLanes.map(splitLaneByAtom).map((s) => s.atoms).filter((l) => l.nodes.length > 0)
const composedLanes = allLanes.map(splitLaneByAtom).map((s) => s.composed).filter((l) => l.nodes.length > 0)

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
      subtitle={`foundations/${g.category}`}
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
  const meta = LANE_LABEL[lane]
  const title = meta?.label ?? lane.replace(/^ui\//, '')
  return (
    <SectionFrame key={lane} title={title} subtitle={lane} standard={meta?.standard} count={nodes.length}>
      <div data-part="canvas-grid-comp">
        {nodes.map((node) => (
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
    </SectionFrame>
  )
}

// ── 페이지 섹션 ─────────────────────────────────────────────────────────

function SemanticSection() {
  return (
    <section data-part="canvas-semantic-page">
      <h2 data-part="canvas-page-label">
        <strong>L1 · Semantic</strong>
        <span>Foundations · token names</span>
        <small>palette 위 의미 레이어. text·surface·border·accent·state 등 role 별 토큰. widget 은 여기까지만 import.</small>
      </h2>
      {tokenGroups.map(renderTokenGroup)}
    </section>
  )
}

function AtomsSection({
  selected, setSelected,
}: {
  selected: string | null
  setSelected: (s: string | null) => void
}) {
  return (
    <section data-part="canvas-atoms-page">
      <h2 data-part="canvas-page-label">
        <strong>L2 · Atoms</strong>
        <span>UI · 1 role = 1 component</span>
        <small>단일 인터랙션 · 합성·roving·focus 없음. primitives · status · action · 단순 input · 단순 layout.</small>
      </h2>
      {atomLanes.map((lane) => renderLane(lane, selected, setSelected))}
    </section>
  )
}

function ComposedSection({
  selected, setSelected,
}: {
  selected: string | null
  setSelected: (s: string | null) => void
}) {
  return (
    <section data-part="canvas-composed-page">
      <h2 data-part="canvas-page-label">
        <strong>L3 · Composed</strong>
        <span>UI · parts · molecules · organisms · patterns · devices</span>
        <small>atoms + tokens 합성. roving·focus·gesture 가 핵심. content parts · selection · display · overlay · patterns · 합성 layout · devices.</small>
      </h2>
      {composedLanes.map((lane) => renderLane(lane, selected, setSelected))}
    </section>
  )
}

// ── render ──────────────────────────────────────────────────────────────

export function Canvas() {
  const totalTokens = tokenGroups.reduce((n, g) => n + g.exports.length, 0)
  const totalComps = uiLanes.reduce((n, l) => n + l.nodes.length, 0) + deviceLanes.reduce((n, l) => n + l.nodes.length, 0)
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
              {paletteTotal} palette · {totalTokens} semantic · {totalComps} components
            </div>
          </header>

          <div data-part="canvas-layers">
            <PaletteSection />
            <SemanticSection />
            <AtomsSection selected={selected} setSelected={setSelected} />
            <ComposedSection selected={selected} setSelected={setSelected} />
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
