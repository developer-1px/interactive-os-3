import '@oddbird/popover-polyfill'
import { StrictMode, lazy, Suspense } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { dsCss, wrapAppsLayer } from '@p/ds/css'
import { applyPreset, defaultPreset, hairlinePreset } from '@p/ds/tokens/internal/preset'
import { onShortcut } from '@p/headless/key/useShortcut'
import { RouterProvider } from '@tanstack/react-router'
import { router } from './router'

// devtools overlay 는 DEV 에서만 lazy 로드 (prod entry 에서 완전히 제거).
const Devtools = import.meta.env.DEV
  ? lazy(() => import('@p/devtools').then((m) => ({
      default: () => (
        <>
          <m.ReproRecorderOverlay />
          <m.SpacingOverlay />
        </>
      ),
    })))
  : null

// 앱·쇼케이스 CSS 와 plugin manifest 합산은 첫 페인트 후 lazy.
// (entry 가 모든 app 모듈 트리를 끌어와 cold-start 가 망가지던 문제를 차단)
const styleEl = document.createElement('style')
styleEl.setAttribute('data-ds', '')
styleEl.textContent = dsCss
document.head.appendChild(styleEl)

const appsStyleEl = document.createElement('style')
appsStyleEl.setAttribute('data-ds-apps', '')
document.head.appendChild(appsStyleEl)

const loadAppsLayer = async () => {
  const [
    { catalogCss },
    { canvasCss },
    { keyboardCss },
    { finderCss, finderMobileCss, setFinderNav },
    { inspectorCss },
    { eduPortalAdminCss },
    { markdownCss },
    { slidesCss },
    { inboxCss, chatCss, feedCss },
    { plugins },
    { composeRegistry },
  ] = await Promise.all([
    import('@showcase/catalog'),
    import('@showcase/canvas'),
    import('@showcase/keyboard'),
    import('@apps/finder'),
    import('@showcase/inspector'),
    import('@apps/edu-portal-admin'),
    import('@apps/markdown'),
    import('@apps/slides'),
    import('@apps/genres'),
    import('./boot/plugins'),
    import('./boot/registry'),
  ])
  void composeRegistry(plugins)
  setFinderNav((splat) => {
    void router.navigate({ to: '/finder/$', params: { _splat: splat } })
  })
  appsStyleEl.textContent = wrapAppsLayer([
    inspectorCss, finderCss, finderMobileCss, eduPortalAdminCss, catalogCss, canvasCss, keyboardCss, markdownCss, slidesCss, inboxCss, chatCss, feedCss,
  ])
}

const idle = (cb: () => void) => {
  const ric = (window as unknown as { requestIdleCallback?: (cb: () => void) => void }).requestIdleCallback
  if (ric) ric(cb)
  else setTimeout(cb, 0)
}
idle(() => { void loadAppsLayer() })

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
  import.meta.hot.accept('@p/ds', (mod) => {
    if (mod) styleEl.textContent = (mod as { dsCss: string }).dsCss
  })
}

if (import.meta.env.DEV) {
  import('@p/devtools/guides')
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
    {Devtools && (
      <Suspense fallback={null}>
        <Devtools />
      </Suspense>
    )}
  </StrictMode>,
)
