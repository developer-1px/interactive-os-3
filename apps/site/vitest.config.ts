import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import path from 'node:path'

const headless = path.resolve(__dirname, '../../packages/headless/src')

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: [
      { find: /^@p\/headless\/patterns$/, replacement: path.join(headless, 'patterns/index.ts') },
      { find: /^@p\/headless\/local$/, replacement: path.join(headless, 'local/index.ts') },
      { find: /^@p\/headless$/, replacement: path.join(headless, 'index.ts') },
    ],
  },
  test: {
    environment: 'jsdom',
    include: ['src/**/*.test.ts', 'src/**/*.test.tsx'],
    coverage: {
      provider: 'v8',
      include: ['**/patterns/accordion.ts', '**/demos/accordion.tsx'],
      exclude: ['**/dist/**', '**/node_modules/**'],
      all: false,
      reporter: ['text'],
      reportsDirectory: path.resolve(__dirname, 'coverage'),
    },
  },
})
