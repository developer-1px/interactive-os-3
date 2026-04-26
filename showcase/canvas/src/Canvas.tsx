/**
 * Canvas — DS 자산 SSOT viewer.
 *
 * 자동 수집:
 *   - foundations 토큰      virtual:ds-audit ( @demo JSDoc 태그 )
 *   - ds/parts 부품         glob '@p/ds/parts/*.tsx' + _demos/*.demo.tsx
 *   - ds/ui 컴포넌트        glob '@p/ds/ui/<tier>/*.tsx' + _demos/*.demo.tsx
 *
 * 새 자산을 추가하면 (export + @demo 태그 또는 _demos/<Name>.demo.tsx) 이 페이지에
 * 즉시 등장한다 — 등록부 0개. 흡수 통합: /catalog · /foundations 라우트 대체.
 */
import type { ComponentType, ReactNode } from 'react'
import { ZoomPanCanvas } from '@p/ds/ui/8-layout/ZoomPanCanvas'
import { audit } from 'virtual:ds-audit'
import { demos as catalogDemos } from '@showcase/catalog'
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
// Foundations 카테고리 — 업계 만장일치 6개(color·typography·layout·motion·iconography·elevation)는
//   M3/HIG/Polaris/Atlassian/Spectrum/Fluent 거의 전부 등장. 나머지(shape·state·recipes·primitives·control)는
//   소수파라 standard 메타로 매핑처를 명시한다.
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
const CATEGORY_ORDER = Object.keys(CATEGORY_LABEL)

// ── ui/<tier> → 업계 표준 어휘 매핑 (Ant 6축 + Atlassian/Polaris/Radix 수렴)
//   tier 번호는 의존 DAG 메타로 유지하고 표시 라벨만 표준화한다.
const LANE_LABEL: Record<string, { label: string; standard: string }> = {
  parts:            { label: 'Content',    standard: 'Atomic atoms · Polaris/Atlassian Display' },
  'ui/0-primitives': { label: 'Primitives', standard: 'Atlassian Primitives · Radix Primitives' },
  'ui/1-status': { label: 'Status',     standard: 'Atlassian Status indicators · Polaris Feedback indicators' },
  'ui/2-action':    { label: 'Action',     standard: 'Ant General · Material Actions' },
  'ui/3-input':     { label: 'Input',      standard: 'Ant Data Entry · Material Text input' },
  'ui/4-selection':{ label: 'Selection',  standard: 'Ant Data Entry · Material Selection' },
  'ui/5-display': { label: 'Display',    standard: 'Ant Data Display · Atlassian Text & data display' },
  'ui/6-overlay':   { label: 'Overlay',    standard: 'Polaris Overlays · Atlassian Overlays & layering' },
  'ui/7-patterns':   { label: 'Patterns',   standard: 'Polaris/Atlassian/GOV.UK Patterns' },
  'ui/8-layout':    { label: 'Layout',     standard: 'Ant Layout · Polaris Layout & structure' },
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
  return CATEGORY_ORDER
    .filter((c) => map.has(c))
    .map((c) => ({
      category: c,
      exports: map.get(c)!.sort((a, b) => a.name.localeCompare(b.name)),
    }))
})()

// ── 컴포넌트 데모 SSOT 우선순위:
//   1. _demos/<Name>.demo.tsx  (colocated, default export)
//   2. @showcase/catalog 의 demos[name]  (inline registry — ui 부품 거의 모두 커버)
//   3. partAutoDemo(name)  (parts/ 에 한정한 휴리스틱 default render)
//   4. null → "no demo" placeholder
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

// ── render ──────────────────────────────────────────────────────────────

export function Canvas() {
  const totalTokens = tokenGroups.reduce((n, g) => n + g.exports.length, 0)
  const totalComps = uiLanes.reduce((n, l) => n + l.nodes.length, 0) + partsLanes.reduce((n, l) => n + l.nodes.length, 0)

  return (
    <div data-part="canvas-app">
      <ZoomPanCanvas initialScale={0.4}>
        <div data-part="canvas-page">
          <header data-part="canvas-header">
            <div data-meta>Design System · Library</div>
            <h1>Product UI Styleguide</h1>
            <div data-stats>
              {totalTokens} tokens · {totalComps} components · auto-collected from{' '}
              <code>@demo</code> JSDoc + <code>_demos/*.demo.tsx</code>
            </div>
          </header>

          <div data-part="canvas-board">
            {/* ── ZONE 1 — FOUNDATIONS ─────────────────────────────────── */}
            <section data-part="canvas-zone">
              <header data-part="canvas-zone-label">
                Foundations
                <small>{totalTokens} tokens</small>
              </header>
              <div data-part="canvas-zone-row">
                {tokenGroups.map(({ category, exports }) => {
                  const byFile = new Map<string, typeof exports>()
                  for (const e of exports) {
                    const sub = e.file.match(/\/([^/]+)\.ts$/)?.[1] ?? 'misc'
                    if (!byFile.has(sub)) byFile.set(sub, [])
                    byFile.get(sub)!.push(e)
                  }
                  const subs = [...byFile.keys()].sort()
                  const gridPart =
                    category === 'color' || category === 'iconography'
                      ? 'canvas-grid-color'
                      : 'canvas-grid-value'
                  return (
                    <SectionFrame
                      key={category}
                      title={CATEGORY_LABEL[category]?.label ?? category}
                      subtitle={category}
                      standard={CATEGORY_LABEL[category]?.standard}
                      count={exports.length}
                    >
                      {category === 'typography' ? (
                        <div data-part="canvas-type-stack">
                          {exports.map((e) => (
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
                          {exports.map((e) => (
                            <TokenCard key={e.name + e.file} e={e} />
                          ))}
                        </div>
                      )}
                    </SectionFrame>
                  )
                })}
              </div>
            </section>

            {/* ── ZONE 2 — COMPONENTS ──────────────────────────────────── */}
            <section data-part="canvas-zone">
              <header data-part="canvas-zone-label">
                Components
                <small>{totalComps} components</small>
              </header>
              <div data-part="canvas-zone-row">
                {[...partsLanes, ...uiLanes].sort((a, b) => laneRank(a.lane) - laneRank(b.lane)).map(({ lane, nodes }) => {
                  // 모양 비슷한 것끼리 sub-group: 이름의 마지막 PascalCase 토큰을 shape key로
                  //   Button·IconButton·LinkButton·SubmitButton → "Button" 군
                  //   Listbox·Combobox → "box" 군 (last camel token = box)
                  //   Card·ProductCard·StatCard → "Card" 군
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
                  // 그룹이 다 1개씩이면 grouping 불필요 → flat
                  const useGrouping = [...shapeGroups.values()].some((g) => g.length > 1)
                  const groupEntries = useGrouping
                    ? [...shapeGroups.entries()].sort((a, b) => b[1].length - a[1].length || a[0].localeCompare(b[0]))
                    : [['', nodes] as const]
                  const meta = LANE_LABEL[lane]
                  const title = meta?.label ?? lane.replace(/^ui\//, '')
                  return (
                  <SectionFrame
                    key={lane}
                    title={title}
                    subtitle={lane}
                    standard={meta?.standard}
                    count={nodes.length}
                  >
                    {groupEntries.map(([gkey, groupNodes]) => (
                      <div key={gkey || '__flat__'} data-part="canvas-shape-group">
                        {gkey && <div data-part="canvas-shape-label">{gkey}</div>}
                        <div data-part="canvas-grid-comp">
                          {groupNodes.map((node) => (
                            <figure key={node.name} data-part="canvas-comp-card">
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
                })}
              </div>
            </section>

            {/* ── ZONE 3 — DEVICES (mock frames, 별도 zone) ─────────────── */}
            {deviceLanes.length > 0 && (
              <section data-part="canvas-zone">
                <header data-part="canvas-zone-label">
                  Devices
                  <small>{deviceLanes.reduce((n, l) => n + l.nodes.length, 0)} mocks</small>
                </header>
                <div data-part="canvas-zone-row">
                  {deviceLanes.map(({ lane, nodes }) => (
                    <SectionFrame key={lane} title="Mock frames" count={nodes.length}>
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
                </div>
              </section>
            )}
          </div>
        </div>
      </ZoomPanCanvas>
    </div>
  )
}
