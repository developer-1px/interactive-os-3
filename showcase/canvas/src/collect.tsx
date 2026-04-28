/**
 * collect — 컴포넌트·devices 자동 수집 SSOT.
 *
 * 책임:
 *   - ui/devices glob 모듈 로드
 *   - demo resolver (colocated _demos · catalog · partAutoDemo · uiAutoDemo 우선순위)
 *   - lane 별 CompNode 묶기 (allLanes)
 *   - atom/composed 분리 (atomLanes · composedLanes)
 *   - 컴포넌트 이름 → import path 인덱스 (compIndex)
 *
 * Canvas.tsx 의 detail panel 및 섹션 컴포넌트들이 소비.
 */
import type { ComponentType, ReactNode } from 'react'
import { demos as catalogDemos } from '@showcase/catalog'
import { laneRank, isAtom, bucketOf, type Bucket } from './lanes'

const uiModules = import.meta.glob<Record<string, unknown>>('@p/ds/ui/*/*.tsx', { eager: true })
const uiSubModules = import.meta.glob<Record<string, unknown>>('@p/ds/ui/*/*/*.tsx', { eager: true })
const uiDemoModules = import.meta.glob<{ default: ComponentType }>('@p/ds/ui/*/_demos/*.demo.tsx', { eager: true })
const contentModules = import.meta.glob<Record<string, unknown>>('@p/ds/content/*.tsx', { eager: true })
const contentDemoModules = import.meta.glob<{ default: ComponentType }>('@p/ds/content/_demos/*.demo.tsx', { eager: true })
const deviceModules = import.meta.glob<Record<string, unknown>>('@p/ds/devices/*.tsx', { eager: true })
const deviceDemoModules = import.meta.glob<{ default: ComponentType }>('@p/ds/devices/_demos/*.demo.tsx', { eager: true })
const surfaceModules = import.meta.glob<Record<string, unknown>>('@p/ds/surfaces/*/*.tsx', { eager: true })
const surfaceDemoModules = import.meta.glob<{ default: ComponentType }>('@p/ds/surfaces/*/_demos/*.demo.tsx', { eager: true })
// style/widgets/* — CSS-only stylesheet (.ts). demo 는 _demos/<name>.demo.tsx 로 raw markup 시연.
const styleWidgetModules = import.meta.glob<Record<string, unknown>>('@p/ds/style/widgets/*/*.ts', { eager: true })
const styleWidgetDemoModules = import.meta.glob<{ default: ComponentType }>('@p/ds/style/widgets/*/_demos/*.demo.tsx', { eager: true })

export type DemoFn = () => ReactNode
export type CompNode = { name: string; demo: DemoFn | null; subgroup?: string }
export type CompLane = { lane: string; nodes: CompNode[]; bucket: Bucket }

function resolveDemo(
  name: string,
  colocated: ComponentType | undefined,
  ownModule: Record<string, unknown> | undefined,
): DemoFn | null {
  if (colocated) {
    const C = colocated
    return () => <C />
  }
  if (catalogDemos[name]) return catalogDemos[name]
  // fallback — 0-prop 자동 mount. ErrorBoundary 가 render-time 실패 흡수.
  const exported = ownModule?.[name]
  if (typeof exported === 'function' && /^[A-Z]/.test(name)) {
    const C = exported as ComponentType
    return () => <C />
  }
  return null
}

function buildCompLanes(
  components: Record<string, unknown>,
  demos: Record<string, { default: ComponentType }>,
  pathRe: RegExp,
  groupOf: (m: RegExpMatchArray) => string,
  nameOf: (m: RegExpMatchArray) => string,
  subgroupOf?: (m: RegExpMatchArray) => string | undefined,
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
    const subgroup = subgroupOf?.(m)
    // _demos/ 하위 파일은 부모 컴포넌트 카드의 demo 슬롯으로 이미 노출되므로 별도 카드 ❌.
    if (subgroup?.startsWith('_')) continue
    const group = groupOf(m)
    if (!lanes.has(group)) lanes.set(group, [])
    lanes.get(group)!.push({
      name,
      demo: resolveDemo(name, demoIndex.get(name), components[path] as Record<string, unknown> | undefined),
      subgroup,
    })
  }
  return [...lanes.keys()].map((lane) => ({
    lane,
    nodes: lanes.get(lane)!.sort((a, b) => a.name.localeCompare(b.name)),
    bucket: bucketOf(lane),
  }))
}

const uiLanesDepth2 = buildCompLanes(
  uiModules,
  uiDemoModules,
  /\/ui\/([^/]+)\/([^/]+)\.tsx$/,
  (m) => `ui/${m[1]}`,
  (m) => m[2],
)

// depth-3 (e.g. surfaces/command/CommandPalette, surfaces/sidebar/adminFloating)
// → 부모 lane 으로 병합하되 중간 폴더명을 subgroup 으로 보존 (fs 계층 1:1).
const uiLanesDepth3 = buildCompLanes(
  uiSubModules,
  uiDemoModules,
  /\/ui\/([^/]+)\/([^/]+)\/([^/]+)\.tsx$/,
  (m) => `ui/${m[1]}`,
  (m) => m[3],
  (m) => m[2],
)

function mergeLanes(a: CompLane[], b: CompLane[]): CompLane[] {
  const map = new Map<string, CompNode[]>()
  for (const l of [...a, ...b]) {
    if (!map.has(l.lane)) map.set(l.lane, [])
    map.get(l.lane)!.push(...l.nodes)
  }
  return [...map.entries()].map(([lane, nodes]) => ({
    lane,
    nodes: nodes.sort((x, y) => x.name.localeCompare(y.name)),
    bucket: bucketOf(lane),
  }))
}
const uiLanes = mergeLanes(uiLanesDepth2, uiLanesDepth3)

const contentLanes = buildCompLanes(
  contentModules,
  contentDemoModules,
  /\/content\/([^/]+)\.tsx$/,
  () => 'content',
  (m) => m[1],
)

const deviceLanes = buildCompLanes(
  deviceModules,
  deviceDemoModules,
  /\/devices\/([^/]+)\.tsx$/,
  () => 'devices',
  (m) => m[1],
)

const surfaceLanes = buildCompLanes(
  surfaceModules,
  surfaceDemoModules,
  /\/surfaces\/([^/]+)\/([^/]+)\.tsx$/,
  (m) => `surfaces/${m[1]}`,
  (m) => m[2],
)

const styleWidgetLanes = buildCompLanes(
  styleWidgetModules,
  styleWidgetDemoModules,
  /\/style\/widgets\/([^/]+)\/([^/]+)\.ts$/,
  (m) => `style/widgets/${m[1]}`,
  (m) => m[2],
)

export const allLanes = [...uiLanes, ...contentLanes, ...surfaceLanes, ...styleWidgetLanes, ...deviceLanes].sort((a, b) => laneRank(a.lane) - laneRank(b.lane))

// L2 lane 안에서 컴포넌트별 atom override (Foo.meta.ts) 가 composed 로 끌어내릴 수 있다.
// L3+ lane 은 default composed — atom override 가 있으면 L2 로 끌어올린다.
function rebucket(lanes: CompLane[]): Record<Bucket, CompLane[]> {
  const result: Record<Bucket, CompLane[]> = { L2: [], L3: [], L4: [], L5: [] }
  for (const l of lanes) {
    const atoms: CompNode[] = []
    const composed: CompNode[] = []
    for (const n of l.nodes) {
      if (isAtom(n.name, l.lane)) atoms.push(n)
      else composed.push(n)
    }
    if (l.bucket === 'L2') {
      if (atoms.length)    result.L2.push({ ...l, nodes: atoms })
      if (composed.length) result.L3.push({ ...l, nodes: composed, bucket: 'L3' })
    } else {
      if (atoms.length)    result.L2.push({ ...l, nodes: atoms,    bucket: 'L2' })
      if (composed.length) result[l.bucket].push({ ...l, nodes: composed })
    }
  }
  return result
}

export const lanesByBucket = rebucket(allLanes)
export const totalCompCount =
  uiLanes.reduce((n, l) => n + l.nodes.length, 0) +
  contentLanes.reduce((n, l) => n + l.nodes.length, 0) +
  surfaceLanes.reduce((n, l) => n + l.nodes.length, 0) +
  styleWidgetLanes.reduce((n, l) => n + l.nodes.length, 0) +
  deviceLanes.reduce((n, l) => n + l.nodes.length, 0)

// ── 컴포넌트 이름 → import path 인덱스 ──────────────────────────────────
export type CompMeta = { name: string; importPath: string; lane: string }
export const compIndex = new Map<string, CompMeta>()

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
addCompIndex(uiModules,     /\/ui\/([^/]+)\/([^/]+)\.tsx$/,         (m) => `ui/${m[1]}`)
addCompIndex(uiSubModules,  /\/ui\/([^/]+)\/([^/]+)\/([^/]+)\.tsx$/, (m) => `ui/${m[1]}`)
addCompIndex(contentModules,/\/content\/([^/]+)\.tsx$/,             () => 'content')
addCompIndex(deviceModules, /\/devices\/([^/]+)\.tsx$/,             () => 'devices')
addCompIndex(surfaceModules,/\/surfaces\/([^/]+)\/([^/]+)\.tsx$/,    (m) => `surfaces/${m[1]}`)
addCompIndex(styleWidgetModules, /\/style\/widgets\/([^/]+)\/([^/]+)\.ts$/, (m) => `style/widgets/${m[1]}`)
