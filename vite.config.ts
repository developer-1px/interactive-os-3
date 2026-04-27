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
