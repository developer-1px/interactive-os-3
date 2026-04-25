import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { tanstackRouter } from '@tanstack/router-plugin/vite'
import fsTree from './vite-plugin-fs'
import dsAudit from './vite-plugin-ds-audit'
import dsContracts from './vite-plugin-ds-contracts'

export default defineConfig({
  base: process.env.GITHUB_PAGES ? '/interactive-os-3/' : '/',
  plugins: [
    tanstackRouter({
      target: 'react',
      routesDirectory: 'src/routes',
      generatedRouteTree: 'src/routeTree.gen.ts',
      autoCodeSplitting: false,
      // 컴포넌트 파일(PascalCase)은 라우트로 해석하지 않는다.
      // 라우트 파일은 모두 lowercase / dot-segment 규약(예: finder.$.tsx)을 따른다.
      routeFileIgnorePattern: '(^|/)[A-Z][^/]*\\.(tsx?|jsx?)$',
    }),
    react(),
    fsTree(),
    dsAudit(),
    dsContracts(),
  ],
})
