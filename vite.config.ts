import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import fsTree from './vite-plugin-fs'
import dsAudit from './vite-plugin-ds-audit'
import dsContracts from './vite-plugin-ds-contracts'

export default defineConfig({
  plugins: [react(), fsTree(), dsAudit(), dsContracts()],
})
