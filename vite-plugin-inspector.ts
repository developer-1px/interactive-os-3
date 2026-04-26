import fs from 'node:fs'
import path from 'node:path'
import { createRequire } from 'node:module'
import type { Plugin } from 'vite'

/** Minimal shape for babel AST nodes used during walk */
interface BabelNode {
  type?: string
  name?: string | BabelNode
  end?: number
  loc?: { start: { line: number; column: number } }
  attributes?: BabelNode[]
  property?: BabelNode
  [key: string]: unknown
}

// Resolve @babel/parser from @vitejs/plugin-react's dependencies (pnpm-safe)
const _require = createRequire(import.meta.url)
let parsePath: string
try {
  parsePath = _require.resolve('@babel/parser', {
    paths: [_require.resolve('@vitejs/plugin-react')],
  })
} catch {
  parsePath = _require.resolve('@babel/parser')
}
const { parse } = await import(parsePath) as { parse: (code: string, options: Record<string, unknown>) => { program: BabelNode } }

export function inspectorPlugin(): Plugin {
  let root = ''

  return {
    name: 'vite-plugin-component-inspector',
    apply: 'serve',

    configResolved(config) {
      root = config.root
    },

    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        const url = new URL(req.url!, `http://${req.headers.host}`)
        if (url.pathname !== '/__inspector_source') return next()

        const file = url.searchParams.get('file')
        if (!file) { res.statusCode = 400; res.end('missing file'); return }

        const abs = path.resolve(root, file)
        if (!abs.startsWith(root) || !fs.existsSync(abs)) {
          res.statusCode = 404; res.end('not found'); return
        }

        res.setHeader('Content-Type', 'text/plain; charset=utf-8')
        res.end(fs.readFileSync(abs, 'utf-8'))
      })
    },

    transform: {
      order: 'pre',
      handler(code, id) {
        if (id.includes('node_modules')) return
        if (!/\.[tj]sx$/.test(id)) return
        if (id.includes('packages/devtools/src/')) return

        const relativePath = path.relative(root, id)
        const totalLines = code.split('\n').length

        let ast
        try {
          ast = parse(code, {
            sourceType: 'module',
            plugins: ['jsx', 'typescript', 'decorators-legacy'],
          })
        } catch {
          return // Unparseable file, skip
        }

        const insertions: { offset: number; line: number; col: number }[] = []

        const FRAGMENT_TYPES = new Set(['JSXFragment', 'JSXNamespacedName'])

        function isFragment(nameNode: BabelNode | undefined): boolean {
          if (!nameNode) return true
          if (FRAGMENT_TYPES.has(nameNode.type!)) return true
          if (nameNode.type === 'JSXMemberExpression' && nameNode.property?.name === 'Fragment') return true
          if (nameNode.type === 'JSXIdentifier' && nameNode.name === 'Fragment') return true
          return false
        }

        function hasInspectorAttr(node: BabelNode): boolean {
          return node.attributes?.some(
            (a) => a.type === 'JSXAttribute' && typeof a.name === 'object' && (a.name as BabelNode)?.name === 'data-inspector-line',
          ) ?? false
        }

        function collectJSX(node: BabelNode): void {
          const nameNode = node.name as BabelNode | undefined
          if (isFragment(nameNode) || hasInspectorAttr(node)) return
          const nameEnd = nameNode?.end
          if (nameEnd != null && node.loc) {
            insertions.push({ offset: nameEnd, line: node.loc.start.line, col: node.loc.start.column + 1 })
          }
        }

        const SKIP_KEYS = new Set(['leadingComments', 'trailingComments', 'innerComments'])

        function walk(node: BabelNode) {
          if (!node || typeof node !== 'object') return
          if (Array.isArray(node)) { node.forEach(walk); return }

          if (node.type === 'JSXOpeningElement' && node.loc && node.end != null) {
            collectJSX(node)
          }

          for (const key of Object.keys(node)) {
            if (SKIP_KEYS.has(key)) continue
            const child = node[key]
            if (child && typeof child === 'object' && ((child as BabelNode).type || Array.isArray(child))) {
              walk(child as BabelNode)
            }
          }
        }

        walk(ast.program as BabelNode)

        if (insertions.length === 0) return

        // Sort descending by offset so that later insertions don't shift earlier offsets
        insertions.sort((a, b) => b.offset - a.offset)

        let result = code
        for (const ins of insertions) {
          const attr = ` data-inspector-line="${relativePath}:${ins.line}:${ins.col}" data-inspector-loc="${totalLines}"`
          result = result.slice(0, ins.offset) + attr + result.slice(ins.offset)
        }

        return { code: result, map: null }
      },
    },
  }
}
