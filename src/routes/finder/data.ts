import { tree as initialTree } from 'virtual:fs-tree'
import type { FsNode, SidebarItem, SmartGroupItem } from './types'

let currentTree: FsNode = (import.meta.hot?.data.tree as FsNode | undefined) ?? initialTree
const listeners: Set<() => void> = (import.meta.hot?.data.listeners as Set<() => void> | undefined) ?? new Set()
if (import.meta.hot) {
  import.meta.hot.data.listeners = listeners
  import.meta.hot.accept()
}

export const tree = initialTree
export function getTree(): FsNode { return currentTree }
export function subscribeTree(l: () => void): () => void {
  listeners.add(l)
  return () => { listeners.delete(l) }
}

if (import.meta.hot) {
  import.meta.hot.on('fs-tree:update', (next: FsNode) => {
    currentTree = next
    if (import.meta.hot) import.meta.hot.data.tree = next
    listeners.forEach((l) => l())
  })
}

/** 프로젝트 파일 raw 텍스트 lazy loader — path → () => Promise<string> */
const textLoaders = {
  ...import.meta.glob('/src/**/*.{ts,tsx,js,jsx,mjs,cjs,json,md,mdx,txt,css,scss,sass,html,svg,yml,yaml,toml}', {
    query: '?raw', import: 'default',
  }),
  ...import.meta.glob('/public/**/*.{json,md,mdx,txt,css,html,svg,yml,yaml}', {
    query: '?raw', import: 'default',
  }),
  ...import.meta.glob('/docs/**/*.{md,mdx,txt}', {
    query: '?raw', import: 'default',
  }),
  ...import.meta.glob('/{README,package,tsconfig,eslint.config,vite.config,vite-plugin-fs}.*', {
    query: '?raw', import: 'default',
  }),
} as Record<string, () => Promise<string>>

/** 이미지 url — path → public url (eager) */
const imageUrls = {
  ...import.meta.glob('/src/**/*.{png,jpg,jpeg,gif,webp,avif,svg}', {
    query: '?url', import: 'default', eager: true,
  }),
  ...import.meta.glob('/public/**/*.{png,jpg,jpeg,gif,webp,avif,svg}', {
    query: '?url', import: 'default', eager: true,
  }),
  ...import.meta.glob('/docs/**/*.{png,jpg,jpeg,gif,webp,avif,svg}', {
    query: '?url', import: 'default', eager: true,
  }),
} as Record<string, string>

export function getImageUrl(path: string): string | undefined {
  return imageUrls[path]
}

export async function loadText(path: string): Promise<string | null> {
  const loader = textLoaders[path]
  if (!loader) return null
  try { return await loader() } catch { return null }
}

/** path를 / 세그먼트로 분해해 tree 경로를 따라가며 각 단계의 노드를 반환. */
export function walk(path: string): FsNode[] {
  const parts = path.split('/').filter(Boolean)
  const root = currentTree
  const chain: FsNode[] = [root]
  let cur: FsNode | undefined = root
  for (const p of parts) {
    cur = cur?.children?.find((c) => c.name === p)
    if (!cur) break
    chain.push(cur)
  }
  return chain
}

export function formatSize(n?: number): string {
  if (n == null) return '—'
  if (n < 1024) return `${n} B`
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KB`
  return `${(n / 1024 / 1024).toFixed(1)} MB`
}

export function formatDate(ms?: number): string {
  if (!ms) return '—'
  return new Date(ms).toLocaleString('ko-KR')
}

export const SMART_PREFIX = 'smart:'
/** docs/YYYY/YYYY-MM/YYYY-MM-DD/ 폴더 위계와 동일한 의미.
 *  사건이 일어난 날짜(mtime) 기준 calendar 경계(rolling 24h 아님). */
export const smartGroups: SmartGroupItem[] = [
  { id: 'today',     label: '오늘',     path: 'smart:today',     icon: 'inbox' },
  { id: 'yesterday', label: '어제',     path: 'smart:yesterday', icon: 'archive' },
  { id: 'thisWeek',  label: '이번 주',  path: 'smart:thisWeek',  icon: 'calendar' },
  { id: 'thisMonth', label: '이번 달',  path: 'smart:thisMonth', icon: 'calendar-days' },
  { id: 'thisYear',  label: '올해',     path: 'smart:thisYear',  icon: 'calendar-range' },
]

/** Calendar 경계 — Date 객체로 자연스럽게 계산, mtime ms와 비교. */
function startOfToday(): number {
  const d = new Date(); d.setHours(0, 0, 0, 0); return d.getTime()
}
function startOfThisWeek(): number {
  // 월요일 시작 (ISO). KST 기준 dayOfWeek: 0=Sun ~ 6=Sat. (mon..sun) 월=1.
  const d = new Date(); d.setHours(0, 0, 0, 0)
  const dow = d.getDay()
  const offsetToMon = (dow + 6) % 7  // Mon=0, Sun=6
  d.setDate(d.getDate() - offsetToMon)
  return d.getTime()
}
function startOfThisMonth(): number {
  const d = new Date(); d.setHours(0, 0, 0, 0); d.setDate(1); return d.getTime()
}
function startOfThisYear(): number {
  const d = new Date(); d.setHours(0, 0, 0, 0); d.setMonth(0, 1); return d.getTime()
}

export function isSmartPath(path: string): boolean {
  return path.startsWith(SMART_PREFIX)
}

export function smartGroupOf(path: string): SmartGroupItem | undefined {
  return smartGroups.find((g) => g.path === path)
}

export function collectByAge(node: FsNode, predicate: (mtime: number) => boolean): FsNode[] {
  const out: FsNode[] = []
  const visit = (n: FsNode) => {
    if (n.type === 'file' && n.mtime != null && predicate(n.mtime)) out.push(n)
    n.children?.forEach(visit)
  }
  visit(node)
  return out.sort((a, b) => (b.mtime ?? 0) - (a.mtime ?? 0))
}

/** 각 버킷은 자기 calendar 단위 안의 mtime을 모두 포함(중복 허용).
 *  '오늘 폴더'의 의미: 오늘 calendar day에 일어난 모든 일 — 즉 today는 thisWeek에도, thisMonth에도, thisYear에도 포함된다.
 *  docs/2026/2026-04/2026-04-25/ 가 docs/2026/, docs/2026/2026-04/ 에 모두 속하는 것과 동일. */
export function smartItems(group: SmartGroupItem['id']): FsNode[] {
  const t0  = startOfToday()
  const tW  = startOfThisWeek()
  const tM  = startOfThisMonth()
  const tY  = startOfThisYear()
  const dayMs = 24 * 60 * 60 * 1000
  const pred =
    group === 'today'      ? (m: number) => m >= t0 :
    group === 'yesterday'  ? (m: number) => m >= t0 - dayMs && m < t0 :
    group === 'thisWeek'   ? (m: number) => m >= tW :
    group === 'thisMonth'  ? (m: number) => m >= tM :
    /* thisYear */           (m: number) => m >= tY
  return collectByAge(currentTree, pred)
}

export const sidebar: SidebarItem[] = [
  { id: 'root',     label: tree.name, path: '/',            icon: 'home' },
  { id: 'src',      label: 'src',     path: '/src',         icon: 'dir' },
  { id: 'controls', label: 'controls', path: '/src/controls', icon: 'sliders' },
  { id: 'ds',       label: 'ds',      path: '/src/ds',      icon: 'palette' },
  { id: 'finder',   label: 'finder',  path: '/src/finder',  icon: 'dirOpen' },
  { id: 'public',   label: 'public',  path: '/public',      icon: 'dir' },
]
