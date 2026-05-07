import { copyFileSync, mkdirSync, readdirSync, readFileSync, statSync } from 'node:fs'
import { dirname, join, relative, resolve } from 'node:path'
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

const IGNORE = new Set(['node_modules', 'dist', '.DS_Store'])
/** dot 으로 시작하는 디렉터리 전체 차단 (.git, .claude, .idea, .tanstack, .vite 등) */
const isHiddenDir = (name: string): boolean => name.startsWith('.')

/** finder 에 노출할 root-level entries — 화이트리스트.
 *  형태: '<topdir>' (전체) 또는 '<topdir>/<sub>' (한 단계 좁히기).
 *  배포 사이즈·노출 범위 모두 이 한 곳에서 통제. */
const ALLOW_ROOTS: ReadonlyArray<readonly string[]> = [
  ['packages', 'aria-kernel'],
  ['docs'],
]

const TEXT_MIME: Record<string, string> = {
  md: 'text/markdown', mdx: 'text/markdown', txt: 'text/plain',
  ts: 'text/plain', tsx: 'text/plain', js: 'text/plain', jsx: 'text/plain', mjs: 'text/plain', cjs: 'text/plain',
  json: 'application/json', yml: 'text/yaml', yaml: 'text/yaml', toml: 'text/plain',
  css: 'text/css', scss: 'text/plain', sass: 'text/plain',
  html: 'text/html', svg: 'image/svg+xml',
}
const IMAGE_MIME: Record<string, string> = {
  png: 'image/png', jpg: 'image/jpeg', jpeg: 'image/jpeg', gif: 'image/gif',
  webp: 'image/webp', avif: 'image/avif', svg: 'image/svg+xml',
}

function scanDir(dir: string, root: string, depth = 0, max = 8): FsNode[] {
  if (depth > max) return []
  const entries = readdirSync(dir, { withFileTypes: true })
    .filter((e) => !IGNORE.has(e.name) && !(e.isDirectory() && isHiddenDir(e.name)))
    .sort((a, b) => {
      if (a.isDirectory() !== b.isDirectory()) return a.isDirectory() ? -1 : 1
      return a.name.localeCompare(b.name)
    })
  return entries.map((e) => {
    const full = join(dir, e.name)
    const rel = '/' + relative(root, full)
    if (e.isDirectory()) {
      return { name: e.name, path: rel, type: 'dir', children: scanDir(full, root, depth + 1, max) }
    }
    const st = statSync(full)
    const ext = (e.name.match(/\.([^.]+)$/)?.[1] ?? '').toLowerCase()
    return { name: e.name, path: rel, type: 'file', size: st.size, mtime: st.mtimeMs, ext }
  })
}

/** ALLOW_ROOTS 만 트리에 포함. 중간 디렉터리는 자동 합성. */
function scan(root: string): FsNode[] {
  const topByName = new Map<string, FsNode>()
  for (const segs of ALLOW_ROOTS) {
    if (segs.length === 0) continue
    const [top, ...rest] = segs
    const fullPath = '/' + segs.join('/')
    const target = join(root, ...segs)
    const leaf: FsNode = { name: segs[segs.length - 1], path: fullPath, type: 'dir', children: scanDir(target, root) }
    if (rest.length === 0) {
      topByName.set(top, leaf)
    } else {
      // 합성된 중간 노드: e.g. ALLOW=['packages','aria-kernel'] → packages 라는 가상 dir 안에 headless 만 노출
      const existing = topByName.get(top)
      const child = leaf
      if (existing) existing.children!.push(child)
      else topByName.set(top, { name: top, path: '/' + top, type: 'dir', children: [child] })
    }
  }
  return Array.from(topByName.values()).sort((a, b) => a.name.localeCompare(b.name))
}

/** tree 의 모든 file 노드를 평탄화하여 path 목록 반환. */
function flattenFiles(nodes: FsNode[]): string[] {
  const out: string[] = []
  const visit = (n: FsNode) => {
    if (n.type === 'file') out.push(n.path)
    n.children?.forEach(visit)
  }
  nodes.forEach(visit)
  return out
}

/** ALLOW_ROOTS 화이트리스트 안에 들어오는 path 인지. */
function isAllowedPath(p: string): boolean {
  if (!p.startsWith('/')) return false
  if (p.includes('..')) return false
  const parts = p.slice(1).split('/')
  for (const seg of parts) {
    if (IGNORE.has(seg)) return false
    if (isHiddenDir(seg)) return false
  }
  return ALLOW_ROOTS.some((segs) => segs.every((s, i) => parts[i] === s))
}

export default function fsTree(): Plugin {
  const VIRTUAL = 'virtual:fs-tree'
  const RESOLVED = '\0' + VIRTUAL
  const root = process.cwd()
  return {
    name: 'fs-tree',
    resolveId(id) { return id === VIRTUAL ? RESOLVED : null },
    load(id) {
      if (id !== RESOLVED) return
      const tree: FsNode = { name: root.split('/').pop() ?? 'root', path: '/', type: 'dir', children: scan(root) }
      return `export const tree = ${JSON.stringify(tree)}\nexport const rootPath = ${JSON.stringify(root)}\n`
    },
    configureServer(server) {
      // dev: /_fs/<absolute-monorepo-path> → 디스크 read
      server.middlewares.use((req, res, next) => {
        const url = req.url ?? ''
        if (!url.startsWith('/_fs/')) return next()
        const rawPath = decodeURIComponent(url.slice('/_fs'.length).split('?')[0])
        if (!isAllowedPath(rawPath)) { res.statusCode = 403; res.end('forbidden'); return }
        const abs = join(root, rawPath)
        try {
          const buf = readFileSync(abs)
          const ext = (rawPath.match(/\.([^.]+)$/)?.[1] ?? '').toLowerCase()
          const mime = TEXT_MIME[ext] ?? IMAGE_MIME[ext] ?? 'application/octet-stream'
          res.setHeader('Content-Type', mime)
          res.setHeader('Cache-Control', 'no-cache')
          res.end(buf)
        } catch { res.statusCode = 404; res.end('not found') }
      })

      let timer: NodeJS.Timeout | null = null
      const push = () => {
        const mod = server.moduleGraph.getModuleById(RESOLVED)
        if (mod) server.moduleGraph.invalidateModule(mod)
        const tree: FsNode = { name: root.split('/').pop() ?? 'root', path: '/', type: 'dir', children: scan(root) }
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
    // build: dist/_fs/<path> 로 트리 파일을 그대로 카피
    closeBundle: {
      sequential: true,
      order: 'post',
      handler() {
        // outDir 은 vite.config 의 build.outDir 와 일치해야 함 — 현재 monorepo root /dist
        const outDir = resolve(root, 'dist')
        const tree = scan(root)
        const files = flattenFiles(tree)
        for (const p of files) {
          if (!isAllowedPath(p)) continue
          const src = join(root, p)
          const dst = join(outDir, '_fs', p)
          try {
            mkdirSync(dirname(dst), { recursive: true })
            copyFileSync(src, dst)
          } catch { /* skip unreadable */ }
        }
      },
    },
  }
}
