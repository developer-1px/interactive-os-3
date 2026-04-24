import type { IconToken } from '../../ds/fn/icon'

declare module 'virtual:fs-tree' {
  export const tree: FsNode
  export const rootPath: string
}

export type FsNode = {
  name: string
  path: string
  type: 'dir' | 'file'
  size?: number
  mtime?: number
  ext?: string
  children?: FsNode[]
}

export type SidebarItem = { id: string; label: string; path: string; icon: IconToken }

export function extToIcon(ext?: string): IconToken {
  if (!ext) return 'file'
  if (['ts', 'tsx', 'js', 'jsx', 'mjs', 'cjs'].includes(ext)) return 'fileCode'
  if (['json', 'yaml', 'yml', 'toml'].includes(ext)) return 'fileConfig'
  if (['md', 'mdx', 'txt'].includes(ext)) return 'fileText'
  if (['png', 'jpg', 'jpeg', 'gif', 'webp', 'svg'].includes(ext)) return 'fileImage'
  if (['css', 'scss', 'sass'].includes(ext)) return 'filePalette'
  if (['html'].includes(ext)) return 'fileGlobe'
  return 'file'
}
