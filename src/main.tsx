import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { dsCss } from './ds'
import { applyPreset, defaultPreset, hairlinePreset } from './ds/style/preset'
import { RouterProvider } from '@tanstack/react-router'
import { router } from './router'

const styleEl = document.createElement('style')
styleEl.setAttribute('data-ds', '')
styleEl.textContent = dsCss
document.head.appendChild(styleEl)

// preset 런타임 핸들 — Cmd+Shift+P로 토글, DevTools에서 window.ds로 호출.
const presets = { default: defaultPreset, hairline: hairlinePreset }
applyPreset(defaultPreset)
window.addEventListener('keydown', (e) => {
  if ((e.metaKey || e.ctrlKey) && e.shiftKey && e.key.toLowerCase() === 'p') {
    e.preventDefault()
    const next = document.documentElement.dataset.dsPreset === 'hairline' ? defaultPreset : hairlinePreset
    applyPreset(next)
  }
})
;(window as unknown as { ds: unknown }).ds = { applyPreset, presets }

if (import.meta.hot) {
  import.meta.hot.accept('./ds', (mod) => {
    if (mod) styleEl.textContent = (mod as { dsCss: string }).dsCss
  })
}

if (import.meta.env.DEV) {
  import('./routes/debug/guides')
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
