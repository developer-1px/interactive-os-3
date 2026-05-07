import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import path from 'node:path'

const headless = path.resolve(__dirname, '../../packages/aria-kernel/src')
const outliner = path.resolve(__dirname, '../outliner/src')

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: [
      { find: /^@p\/headless\/patterns$/, replacement: path.join(headless, 'patterns/index.ts') },
      { find: /^@p\/headless\/adapters\/zod-crud$/, replacement: path.join(headless, 'adapters/zod-crud/index.ts') },
      { find: /^@p\/headless\/store$/, replacement: path.join(headless, 'store/index.ts') },
      { find: /^@p\/headless\/key$/, replacement: path.join(headless, 'key/index.ts') },
      { find: /^@p\/headless\/axes$/, replacement: path.join(headless, 'axes/index.ts') },
      { find: /^@p\/headless\/state$/, replacement: path.join(headless, 'state/index.ts') },
      { find: /^@p\/headless\/local$/, replacement: path.join(headless, 'local/index.ts') },
      { find: /^@p\/headless$/, replacement: path.join(headless, 'index.ts') },
      { find: /^@apps\/outliner\/(.+)$/, replacement: path.join(outliner, '$1') },
      { find: /^@apps\/outliner$/, replacement: path.join(outliner, 'index.ts') },
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
