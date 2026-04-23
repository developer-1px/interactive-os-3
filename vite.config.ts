import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import fsTree from './vite-plugin-fs'

export default defineConfig({
  plugins: [react(), fsTree()],
})
