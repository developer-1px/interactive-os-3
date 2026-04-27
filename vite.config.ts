import { defineConfig } from 'vite'
import { copyFileSync, existsSync } from 'node:fs'
import { resolve } from 'node:path'
import react from '@vitejs/plugin-react'
import { tanstackRouter } from '@tanstack/router-plugin/vite'
import fsTree from './vite-plugin-fs'
import dsAudit from './vite-plugin-ds-audit'
import dsContracts from './vite-plugin-ds-contracts'
import { inspectorPlugin } from './vite-plugin-inspector'

const spaFallback = () => ({
  name: 'spa-404-fallback',
  apply: 'build' as const,
  enforce: 'post' as const,
  writeBundle(_options: unknown, bundle: Record<string, { fileName?: string }>) {
    const indexEntry = Object.values(bundle).find((b) => b.fileName === 'index.html')
    if (!indexEntry) return
    const outDir = resolve(__dirname, 'dist')
    const src = resolve(outDir, 'index.html')
    if (!existsSync(src)) return
    copyFileSync(src, resolve(outDir, '404.html'))
  },
})

export default defineConfig({
  base: process.env.GITHUB_PAGES ? '/interactive-os-3/' : '/',
  resolve: {
    alias: [
      { find: /^@p\/ds$/, replacement: resolve(__dirname, 'packages/ds/src/index.ts') },
      // 3-layer reorg (PRD: prd-immutable-anchor.md) — 이동된 경로 alias.
      // 일반 wildcard 보다 먼저 매칭되어야 함 (vite 는 위에서부터 순차 매칭).
      { find: /^@p\/ds\/foundations$/, replacement: resolve(__dirname, 'packages/ds/src/tokens/foundations/index.ts') },
      { find: /^@p\/ds\/foundations\//, replacement: resolve(__dirname, 'packages/ds/src/tokens/foundations/') + '/' },
      { find: /^@p\/ds\/palette$/, replacement: resolve(__dirname, 'packages/ds/src/tokens/palette/index.ts') },
      { find: /^@p\/ds\/palette\//, replacement: resolve(__dirname, 'packages/ds/src/tokens/palette/') + '/' },
      { find: /^@p\/ds\/style\/preset$/, replacement: resolve(__dirname, 'packages/ds/src/tokens/style/preset/index.ts') },
      { find: /^@p\/ds\/style\/preset\//, replacement: resolve(__dirname, 'packages/ds/src/tokens/style/preset/') + '/' },
      { find: /^@p\/ds\/style\/seed$/, replacement: resolve(__dirname, 'packages/ds/src/tokens/style/seed/index.ts') },
      { find: /^@p\/ds\/style\/seed\//, replacement: resolve(__dirname, 'packages/ds/src/tokens/style/seed/') + '/' },
      { find: /^@p\/ds\/style\/shell$/, replacement: resolve(__dirname, 'packages/ds/src/tokens/style/shell/index.ts') },
      { find: /^@p\/ds\/style\/states$/, replacement: resolve(__dirname, 'packages/ds/src/tokens/style/states/index.ts') },
      { find: /^@p\/ds\/core\//, replacement: resolve(__dirname, 'packages/ds/src/headless/') + '/' },
      { find: /^@p\/ds\/layout$/, replacement: resolve(__dirname, 'packages/ds/src/headless/layout/index.ts') },
      { find: /^@p\/ds\/layout\/recipes$/, replacement: resolve(__dirname, 'packages/ds/src/ui/recipes/index.ts') },
      { find: /^@p\/ds\/layout\/recipes\//, replacement: resolve(__dirname, 'packages/ds/src/ui/recipes/') + '/' },
      { find: /^@p\/ds\/parts$/, replacement: resolve(__dirname, 'packages/ds/src/ui/parts/index.ts') },
      { find: /^@p\/ds\/parts\//, replacement: resolve(__dirname, 'packages/ds/src/ui/parts/') + '/' },
      { find: /^@p\/ds\/ui\/7-patterns\/(ContractCard|CourseCard|RoleCard|ProductCard|PostCard|FeedPost)$/, replacement: resolve(__dirname, 'packages/ds/src/content') + '/$1.tsx' },
      { find: /^@p\/ds\/ui\/7-patterns\//, replacement: resolve(__dirname, 'packages/ds/src/ui/patterns/') + '/' },
      { find: /^@p\/ds\//, replacement: resolve(__dirname, 'packages/ds/src/') + '/' },
      { find: /^@p\/fs$/, replacement: resolve(__dirname, 'packages/fs/src/index.ts') },
      { find: /^@p\/fs\//, replacement: resolve(__dirname, 'packages/fs/src/') + '/' },
      { find: /^@p\/devtools$/, replacement: resolve(__dirname, 'packages/devtools/src/index.ts') },
      { find: /^@p\/devtools\//, replacement: resolve(__dirname, 'packages/devtools/src/') + '/' },
      { find: /^@p\/app$/, replacement: resolve(__dirname, 'packages/app/src/main.tsx') },
      { find: /^@p\/app\//, replacement: resolve(__dirname, 'packages/app/src/') + '/' },
      { find: /^@apps\/([^/]+)$/, replacement: resolve(__dirname, 'apps') + '/$1/src/index.ts' },
      { find: /^@apps\/([^/]+)\//, replacement: resolve(__dirname, 'apps') + '/$1/src/' },
      { find: /^@showcase\/([^/]+)$/, replacement: resolve(__dirname, 'showcase') + '/$1/src/index.ts' },
      { find: /^@showcase\/([^/]+)\//, replacement: resolve(__dirname, 'showcase') + '/$1/src/' },
    ],
  },
  plugins: [
    tanstackRouter({
      target: 'react',
      routesDirectory: 'packages/app/src/routes',
      generatedRouteTree: 'packages/app/src/routeTree.gen.ts',
      autoCodeSplitting: false,
      // 컴포넌트 파일(PascalCase)은 라우트로 해석하지 않는다.
      // 라우트 파일은 모두 lowercase / dot-segment 규약(예: finder.$.tsx)을 따른다.
      routeFileIgnorePattern: '(^|/)[A-Z][^/]*\\.(tsx?|jsx?)$',
    }),
    react(),
    inspectorPlugin(),
    fsTree(),
    dsAudit(),
    dsContracts(),
    spaFallback(),
  ],
})
