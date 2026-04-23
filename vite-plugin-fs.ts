import { readdirSync, statSync } from 'node:fs'
import { join, relative } from 'node:path'
import type { Plugin } from 'vite'

export type FsNode = {
  name: string
  path: string
  type: 'dir' | 'file'
  size?: number
  mtime?: number
  ext?: string
  children?: FsNode[]
}

const IGNORE = new Set(['node_modules', 'dist', '.git', '.DS_Store', '.next', '.turbo'])

function scan(dir: string, root: string, depth = 0, max = 8): FsNode[] {
  if (depth > max) return []
  const entries = readdirSync(dir, { withFileTypes: true })
    .filter((e) => !IGNORE.has(e.name))
    .sort((a, b) => {
      if (a.isDirectory() !== b.isDirectory()) return a.isDirectory() ? -1 : 1
      return a.name.localeCompare(b.name)
    })
  return entries.map((e) => {
    const full = join(dir, e.name)
    const rel = '/' + relative(root, full)
    if (e.isDirectory()) {
      return { name: e.name, path: rel, type: 'dir', children: scan(full, root, depth + 1, max) }
    }
    const st = statSync(full)
    const ext = (e.name.match(/\.([^.]+)$/)?.[1] ?? '').toLowerCase()
    return { name: e.name, path: rel, type: 'file', size: st.size, mtime: st.mtimeMs, ext }
  })
}

export default function fsTree(): Plugin {
  const VIRTUAL = 'virtual:fs-tree'
  return {
    name: 'fs-tree',
    resolveId(id) { return id === VIRTUAL ? id : null },
    load(id) {
      if (id !== VIRTUAL) return
      const root = process.cwd()
      const tree: FsNode = { name: root.split('/').pop() ?? 'root', path: '/', type: 'dir', children: scan(root, root) }
      return `export const tree = ${JSON.stringify(tree)}\nexport const rootPath = ${JSON.stringify(root)}\n`
    },
  }
}
