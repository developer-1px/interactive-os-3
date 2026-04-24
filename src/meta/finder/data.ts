import { tree } from 'virtual:fs-tree'
import type { FsNode, SidebarItem } from './types'

export { tree }

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
  { id: 'root',     label: tree.name, path: '/',            icon: 'home' },
  { id: 'src',      label: 'src',     path: '/src',         icon: 'dir' },
  { id: 'controls', label: 'controls', path: '/src/controls', icon: 'sliders' },
  { id: 'ds',       label: 'ds',      path: '/src/ds',      icon: 'palette' },
  { id: 'finder',   label: 'finder',  path: '/src/finder',  icon: 'dirOpen' },
  { id: 'public',   label: 'public',  path: '/public',      icon: 'dir' },
]
