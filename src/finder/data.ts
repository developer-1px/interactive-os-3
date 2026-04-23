import { tree } from 'virtual:fs-tree'
import type { FsNode, SidebarItem } from './types'

export { tree }

/** path를 / 세그먼트로 분해해 tree 경로를 따라가며 각 단계의 노드를 반환. */
export function walk(path: string): FsNode[] {
  const parts = path.split('/').filter(Boolean)
  const chain: FsNode[] = [tree]
  let cur: FsNode | undefined = tree
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

export const sidebar: SidebarItem[] = [
  { id: 'root',     label: tree.name, path: '/',            icon: '🏠' },
  { id: 'src',      label: 'src',     path: '/src',         icon: '📁' },
  { id: 'controls', label: 'controls', path: '/src/controls', icon: '🎛' },
  { id: 'ds',       label: 'ds',      path: '/src/ds',      icon: '🎨' },
  { id: 'finder',   label: 'finder',  path: '/src/finder',  icon: '🗂' },
  { id: 'public',   label: 'public',  path: '/public',      icon: '📂' },
]
