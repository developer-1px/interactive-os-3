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
  const RESOLVED = '\0' + VIRTUAL
  return {
    name: 'fs-tree',
    resolveId(id) { return id === VIRTUAL ? RESOLVED : null },
    load(id) {
      if (id !== RESOLVED) return
      const root = process.cwd()
      const tree: FsNode = { name: root.split('/').pop() ?? 'root', path: '/', type: 'dir', children: scan(root, root) }
      return `export const tree = ${JSON.stringify(tree)}\nexport const rootPath = ${JSON.stringify(root)}\n`
    },
    configureServer(server) {
      const root = process.cwd()
      let timer: NodeJS.Timeout | null = null
      const push = () => {
        const mod = server.moduleGraph.getModuleById(RESOLVED)
        if (mod) server.moduleGraph.invalidateModule(mod)
        const tree: FsNode = { name: root.split('/').pop() ?? 'root', path: '/', type: 'dir', children: scan(root, root) }
        server.ws.send({ type: 'custom', event: 'fs-tree:update', data: tree })
      }
      const debouncedPush = (file: string) => {
        if (file.includes('/node_modules/') || file.includes('/.git/') || file.includes('/dist/')) return
        if (timer) clearTimeout(timer)
        timer = setTimeout(push, 150)
      }
      server.watcher.on('add', debouncedPush)
      server.watcher.on('unlink', debouncedPush)
      server.watcher.on('addDir', debouncedPush)
      server.watcher.on('unlinkDir', debouncedPush)
    },
  }
}
