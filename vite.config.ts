import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import fsTree from './vite-plugin-fs'
import dsAudit from './vite-plugin-ds-audit'

export default defineConfig({
  plugins: [react(), fsTree(), dsAudit()],
})
