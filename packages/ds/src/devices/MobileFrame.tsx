import { useEffect, useRef, useState, type ReactNode } from 'react'

// 모바일 컨테이너 토글 — dev 도구.
// ⚠️ ds shell 분기는 @media (max-width: 600px)이라 단순 div 축소로는 발동 안 함.
// → iframe에 같은 origin으로 라우트를 로드. iframe viewport 기준으로 @media 평가되어
//   shell·toolbar·sidebar 모바일 분기가 그대로 작동.
// 상태는 localStorage('ds:mobile-frame')에 저장. 토글 단축키 ⌘⇧M.
// iframe 안에서는 자기 자신이 또 MobileFrame을 켜지 않도록 ?frame=mobile=embed 쿼리로 차단.

type Device = { id: string; label: string; w: number; h: number }
const DEVICES: Device[] = [
  { id: 'iphone-15',  label: 'iPhone 15',     w: 393, h: 852 },
  { id: 'iphone-se',  label: 'iPhone SE',     w: 375, h: 667 },
  { id: 'pixel-7',    label: 'Pixel 7',       w: 412, h: 915 },
  { id: 'galaxy-s23', label: 'Galaxy S23',    w: 360, h: 780 },
  { id: 'fold',       label: 'Fold (narrow)', w: 320, h: 720 },
]

const KEY = 'ds:mobile-frame'

interface State { on: boolean; deviceId: string }

const load = (): State => {
  try {
    const raw = localStorage.getItem(KEY)
    if (raw) return { on: false, deviceId: DEVICES[0].id, ...JSON.parse(raw) }
  } catch { /* noop */ }
  return { on: false, deviceId: DEVICES[0].id }
}

const save = (s: State) => {
  try { localStorage.setItem(KEY, JSON.stringify(s)) } catch { /* noop */ }
}

const EMBED_FLAG = 'mf-embed'

const isEmbedded = (): boolean => {
  if (typeof window === 'undefined') return false
  return new URLSearchParams(window.location.search).has(EMBED_FLAG)
}

const buildEmbedSrc = (): string => {
  const u = new URL(window.location.href)
  u.searchParams.set(EMBED_FLAG, '1')
  return u.pathname + u.search + u.hash
}

export function MobileFrame({ children }: { children: ReactNode }) {
  const [state, setState] = useState<State>(() => load())
  const [embedded] = useState(() => isEmbedded())
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const device = DEVICES.find((d) => d.id === state.deviceId) ?? DEVICES[0]

  useEffect(() => { save(state) }, [state])

  useEffect(() => {
    if (embedded) return
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.shiftKey && e.key.toLowerCase() === 'm') {
        e.preventDefault()
        setState((s) => ({ ...s, on: !s.on }))
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [embedded])

  // iframe 안에서는 toggle/iframe 둘 다 표시하지 않고 그냥 children만.
  if (embedded) return <>{children}</>

  if (!state.on) {
    return (
      <>
        {children}
        <MobileToggle on={false} onToggle={() => setState((s) => ({ ...s, on: true }))} />
      </>
    )
  }

  return (
    <>
      <MobileFrameStyles />
      <section data-ds-dev="mobile-frame" aria-label={`${device.label} preview`}>
        <header data-ds-dev="mobile-toolbar">
          <strong>{device.label}</strong>
          <small>{device.w}×{device.h}</small>
          <select
            value={state.deviceId}
            onChange={(e) => setState((s) => ({ ...s, deviceId: e.target.value }))}
            aria-label="Device"
          >
            {DEVICES.map((d) => (
              <option key={d.id} value={d.id}>{d.label} ({d.w}×{d.h})</option>
            ))}
          </select>
          <button type="button" onClick={() => setState((s) => ({ ...s, on: false }))} aria-label="Exit mobile frame"><span data-icon="x" aria-hidden /></button>
        </header>
        <div
          data-ds-dev="mobile-viewport"
          style={{ inlineSize: `${device.w}px`, blockSize: `${device.h}px` }}
        >
          <iframe
            ref={iframeRef}
            data-ds-dev="mobile-canvas"
            title={`${device.label} preview`}
            src={buildEmbedSrc()}
          />
        </div>
      </section>
    </>
  )
}

function MobileToggle({ on, onToggle }: { on: boolean; onToggle: () => void }) {
  return (
    <>
      <MobileToggleStyles />
      <button
        type="button"
        data-ds-dev="mobile-toggle"
        aria-pressed={on}
        aria-label="Toggle mobile frame (⌘⇧M)"
        title="Toggle mobile frame (⌘⇧M)"
        onClick={onToggle}
      ><span data-icon="layout-grid" aria-hidden /></button>
    </>
  )
}

const MobileFrameStyles = () => (
  <style>{`
    [data-ds-dev="mobile-frame"] {
      position: fixed; inset: 0; z-index: 9998;
      display: grid; grid-template-rows: auto 1fr; gap: var(--ds-space, 12px);
      padding: var(--ds-space, 12px);
      background: var(--ds-canvas, #1a1a1a);
      color: var(--ds-text, #eee);
    }
    [data-ds-dev="mobile-toolbar"] {
      display: flex; align-items: center; gap: calc(var(--ds-space, 12px) * 0.75);
      padding: calc(var(--ds-space, 12px) * 0.5) calc(var(--ds-space, 12px) * 1);
      font-size: var(--ds-text-xs, 11px);
      background: var(--ds-surface, #222);
      border-radius: var(--ds-radius-sm, 6px);
    }
    [data-ds-dev="mobile-toolbar"] > strong { font-weight: 600; }
    [data-ds-dev="mobile-toolbar"] > small { color: var(--ds-muted, #888); margin-inline-end: auto; }
    [data-ds-dev="mobile-toolbar"] > button { background: transparent; color: inherit; border: 0; cursor: pointer; padding: 4px 8px; }
    [data-ds-dev="mobile-viewport"] {
      justify-self: center; align-self: center;
      max-block-size: 100%;
      overflow: hidden;
      background: var(--ds-bg, #fff);
      color: var(--ds-text, #111);
      border-radius: 28px;
      box-shadow: 0 0 0 8px #111, 0 24px 64px rgba(0,0,0,0.5);
      container-type: inline-size;
    }
    iframe[data-ds-dev="mobile-canvas"] {
      inline-size: 100%; block-size: 100%; border: 0; display: block;
    }
  `}</style>
)

const MobileToggleStyles = () => (
  <style>{`
    [data-ds-dev="mobile-toggle"] {
      position: fixed; inset-block-end: 16px; inset-inline-end: 80px; z-index: 9997;
      inline-size: 40px; block-size: 40px;
      border-radius: 50%;
      background: var(--ds-surface, #222);
      color: var(--ds-text, #eee);
      border: 1px solid var(--ds-border, #444);
      cursor: pointer;
      font-size: 18px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.2);
    }
    [data-ds-dev="mobile-toggle"][aria-pressed="true"] {
      background: var(--ds-accent, #4a9eff);
      color: var(--ds-accent-on, #fff);
    }
  `}</style>
)
