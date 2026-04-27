/**
 * collect — 컴포넌트·devices 자동 수집 SSOT.
 *
 * 책임:
 *   - ui/devices glob 모듈 로드
 *   - demo resolver (colocated _demos · catalog · partAutoDemo 우선순위)
 *   - lane 별 CompNode 묶기 (allLanes)
 *   - atom/composed 분리 (atomLanes · composedLanes)
 *   - 컴포넌트 이름 → import path 인덱스 (compIndex)
 *
 * Canvas.tsx 의 detail panel 및 섹션 컴포넌트들이 소비.
 */
import type { ComponentType, ReactNode } from 'react'
import { demos as catalogDemos } from '@showcase/catalog'
import { partAutoDemo } from './partsAutoDemos'
import { laneRank, isAtom } from './lanes'

const uiModules = import.meta.glob<Record<string, unknown>>('@p/ds/ui/*/*.tsx', { eager: true })
const uiDemoModules = import.meta.glob<{ default: ComponentType }>('@p/ds/ui/*/_demos/*.demo.tsx', { eager: true })
const deviceModules = import.meta.glob<Record<string, unknown>>('@p/ds/devices/*.tsx', { eager: true })
const deviceDemoModules = import.meta.glob<{ default: ComponentType }>('@p/ds/devices/_demos/*.demo.tsx', { eager: true })

export type DemoFn = () => ReactNode
export type CompNode = { name: string; demo: DemoFn | null }
export type CompLane = { lane: string; nodes: CompNode[] }

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

export const allLanes = [...uiLanes, ...deviceLanes].sort((a, b) => laneRank(a.lane) - laneRank(b.lane))

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

export const atomLanes = allLanes.map(splitLaneByAtom).map((s) => s.atoms).filter((l) => l.nodes.length > 0)
export const composedLanes = allLanes.map(splitLaneByAtom).map((s) => s.composed).filter((l) => l.nodes.length > 0)
export const totalCompCount = uiLanes.reduce((n, l) => n + l.nodes.length, 0) + deviceLanes.reduce((n, l) => n + l.nodes.length, 0)

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
addCompIndex(uiModules,    /\/ui\/([^/]+)\/([^/]+)\.tsx$/, (m) => `ui/${m[1]}`)
addCompIndex(deviceModules,/\/devices\/([^/]+)\.tsx$/,      () => 'devices')
