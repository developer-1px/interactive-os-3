import '@oddbird/popover-polyfill'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { dsCss, wrapAppsLayer } from './ds'
import { catalogCss } from './routes/catalog/style'
import { finderCss } from './routes/finder/style'
import { finderMobileCss } from './routes/m.finder/style'
import { inspectorCss } from './routes/inspector/style'
import { eduPortalAdminCss } from './routes/edu-portal-admin/style'
import { markdownCss } from './routes/markdown/style'
import { inboxCss } from './routes/genres/inbox/style'

const appsCss = wrapAppsLayer([
  inspectorCss, finderCss, finderMobileCss, eduPortalAdminCss, catalogCss, markdownCss, inboxCss,
])
import { applyPreset, defaultPreset, hairlinePreset } from './ds/style/preset'
import { onShortcut } from './ds/core/hooks/useShortcut'
import { RouterProvider } from '@tanstack/react-router'
import { router } from './router'
import { ReproRecorderOverlay } from './devtools/rec/ReproRecorderOverlay'

const styleEl = document.createElement('style')
styleEl.setAttribute('data-ds', '')
styleEl.textContent = dsCss + appsCss
document.head.appendChild(styleEl)

// preset 런타임 핸들 — Cmd+Shift+P로 토글, DevTools에서 window.ds로 호출.
const presets = { default: defaultPreset, hairline: hairlinePreset }
applyPreset(defaultPreset)

// User theme overrides — /theme 라우트에서 핀 박은 토큰을 모든 라우트에 적용.
// applyPreset 직후·router 마운트 전에 :root에 setProperty해야 FOUC 없이 첫 페인트부터 반영.
const THEME_KEY = 'ds-theme-overrides'
const THEME_VARS = ['--ds-tone-hue', '--ds-tone-chroma', '--ds-tone-tint', '--ds-step-scale', '--ds-hue', '--ds-density'] as const
try {
  const raw = localStorage.getItem(THEME_KEY)
  if (raw) {
    const o = JSON.parse(raw) as Partial<Record<typeof THEME_VARS[number], number>>
    for (const k of THEME_VARS) if (typeof o[k] === 'number') document.documentElement.style.setProperty(k, String(o[k]))
  }
} catch { /* localStorage 접근 실패 / JSON 파싱 실패: 무시하고 preset 기본값 유지 */ }

onShortcut('mod+shift+p', () => {
  const next = document.documentElement.dataset.dsPreset === 'hairline' ? defaultPreset : hairlinePreset
  applyPreset(next)
})
;(window as unknown as { ds: unknown }).ds = { applyPreset, presets }

if (import.meta.hot) {
  import.meta.hot.accept('./ds', (mod) => {
    if (mod) styleEl.textContent = (mod as { dsCss: string }).dsCss + appsCss
  })
}

if (import.meta.env.DEV) {
  import('./devtools/guides')
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
    <ReproRecorderOverlay />
  </StrictMode>,
)
