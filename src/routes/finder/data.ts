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

/** Smart 그룹 = docs/YYYY/YYYY-MM/YYYY-MM-DD/ 캘린더 폴더로의 직접 alias.
 *  파일 수집 가상 뷰가 아니라 실제 폴더 경로를 만들어 navigate. 별도 스마트 라우팅 불필요. */
const pad2 = (n: number) => String(n).padStart(2, '0')
const ymd = (d: Date) => `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`
const ym = (d: Date) => `${d.getFullYear()}-${pad2(d.getMonth() + 1)}`

function todayFolder(): string {
  const d = new Date()
  return `/docs/${d.getFullYear()}/${ym(d)}/${ymd(d)}`
}
function yesterdayFolder(): string {
  const d = new Date(); d.setDate(d.getDate() - 1)
  return `/docs/${d.getFullYear()}/${ym(d)}/${ymd(d)}`
}
function thisMonthFolder(): string {
  const d = new Date()
  return `/docs/${d.getFullYear()}/${ym(d)}`
}
function thisYearFolder(): string {
  return `/docs/${new Date().getFullYear()}`
}

export const smartGroups: SmartGroupItem[] = [
  { id: 'today',     label: '오늘',     path: todayFolder(),     icon: 'inbox' },
  { id: 'yesterday', label: '어제',     path: yesterdayFolder(), icon: 'archive' },
  { id: 'thisMonth', label: '이번 달',  path: thisMonthFolder(), icon: 'calendar-days' },
  { id: 'thisYear',  label: '올해',     path: thisYearFolder(),  icon: 'calendar-range' },
]

/** 더 이상 smart: 가상 경로를 쓰지 않음 — 모든 path 는 실제 폴더. */
export function isSmartPath(_path: string): boolean { return false }
export function smartGroupOf(_path: string): SmartGroupItem | undefined { return undefined }

export function collectByAge(node: FsNode, predicate: (mtime: number) => boolean): FsNode[] {
  const out: FsNode[] = []
  const visit = (n: FsNode) => {
    if (n.type === 'file' && n.mtime != null && predicate(n.mtime)) out.push(n)
    n.children?.forEach(visit)
  }
  visit(node)
  return out.sort((a, b) => (b.mtime ?? 0) - (a.mtime ?? 0))
}

/** smart 그룹은 실제 폴더 경로 alias. 더 이상 가상 파일 수집을 하지 않는다. */
export function smartItems(_group: SmartGroupItem['id']): FsNode[] { return [] }

export const sidebar: SidebarItem[] = [
  { id: 'root',     label: tree.name, path: '/',            icon: 'home' },
  { id: 'src',      label: 'src',     path: '/src',         icon: 'dir' },
  { id: 'controls', label: 'controls', path: '/src/controls', icon: 'sliders' },
  { id: 'ds',       label: 'ds',      path: '/src/ds',      icon: 'palette' },
  { id: 'finder',   label: 'finder',  path: '/src/finder',  icon: 'dirOpen' },
  { id: 'public',   label: 'public',  path: '/public',      icon: 'dir' },
]
