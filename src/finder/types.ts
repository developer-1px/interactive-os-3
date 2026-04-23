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

export type SidebarItem = { id: string; label: string; path: string; icon: string }
