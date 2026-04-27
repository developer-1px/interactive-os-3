import { useEffect, useState, type ComponentPropsWithoutRef, type ReactNode } from 'react'
import Frame, { FrameContextConsumer } from 'react-frame-component'

/**
 * Phone — iPhone device chrome primitive (실물 크기).
 *
 * iPhone 14 Pro: 393 × 852pt logical. dynamic island 35×11 / 상단 status bar 47pt.
 *
 * **iframe 임베드 (default)** — children 은 react-frame-component 의 Frame 안에 portal 로
 * 렌더된다. iframe viewport=393px 이라 ds 의 모든 @media (max-width:600px) 모바일 분기가
 * 자연 발동 (Storybook · Chromatic 표준). 부모 document 의 ds 스타일시트는 자동 복제.
 *
 * `bare` prop 으로 iframe 끄고 같은 document 에 그릴 수도 있다 (display-only / 인터랙션 없음).
 *
 * 셀렉터 namespace: data-part="phone" + 자식의 data-part="phone-*"
 */
type PhoneProps = Omit<ComponentPropsWithoutRef<'figure'>, 'children'> & {
  label?: string
  /** classic notch vs dynamic island. default island. */
  notch?: 'classic' | 'island'
  /** 9:41 status bar. default true. */
  statusBar?: boolean
  topBar?: ReactNode
  bottomBar?: ReactNode
  /** iframe 끄고 부모 document 에 직접 렌더. 모바일 미디어쿼리 발동 ❌ (display-only). */
  bare?: boolean
  children?: ReactNode
}

/** 부모 document 의 모든 <style>/<link rel="stylesheet"> 를 iframe 안에 복제.
 *  ds preset (style#ds-preset), Vite HMR style, parts/widget CSS 모두 따라가게 한다. */
const useHeadClone = (doc: Document | null) => {
  useEffect(() => {
    if (!doc) return
    const head = doc.head
    if (!head) return
    const sources = Array.from(document.querySelectorAll('style, link[rel="stylesheet"]'))
    const clones = sources.map((el) => {
      const clone = el.cloneNode(true) as HTMLElement
      head.appendChild(clone)
      return clone
    })
    // 변경 감지 — Vite HMR 가 새 <style> 추가하면 즉시 복제
    const obs = new MutationObserver((muts) => {
      for (const m of muts) {
        m.addedNodes.forEach((n) => {
          if (n instanceof HTMLStyleElement || (n instanceof HTMLLinkElement && n.rel === 'stylesheet')) {
            head.appendChild(n.cloneNode(true))
          }
        })
      }
    })
    obs.observe(document.head, { childList: true })
    return () => { obs.disconnect(); clones.forEach((c) => c.remove()) }
  }, [doc])
}

const FrameStyles = ({ children }: { children: ReactNode }) => (
  <FrameContextConsumer>
    {(ctx) => <FrameStylesInner doc={ctx?.document ?? null}>{children}</FrameStylesInner>}
  </FrameContextConsumer>
)

const FrameStylesInner = ({ doc, children }: { doc: Document | null; children: ReactNode }) => {
  useHeadClone(doc)
  return <>{children}</>
}

const PhoneShell = ({ topBar, bottomBar, children }: { topBar?: ReactNode; bottomBar?: ReactNode; children?: ReactNode }) => (
  <div data-mobile-shell style={{
    blockSize: '100vh', display: 'grid',
    gridTemplateRows: `${topBar ? 'auto ' : ''}1fr${bottomBar ? ' auto' : ''}`,
    background: 'var(--ds-bg)', color: 'var(--ds-fg)',
  }}>
    {topBar}
    <div data-part="phone-body" style={{
      overflow: 'auto',
      // padding/gap 은 ancestor 가 --phone-body-pad / --phone-body-gap 로 override 가능.
      // wireframe guide-driven layout 이 이 hook 으로 layout 을 갈아끼운다 (기본값은 동일).
      padding: 'var(--phone-body-pad, calc(var(--ds-space) * 4))',
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--phone-body-gap, calc(var(--ds-space) * 3))',
    }}>
      {children}
    </div>
    {bottomBar}
  </div>
)

export function Phone({
  label,
  notch = 'island',
  statusBar = true,
  topBar,
  bottomBar,
  bare,
  children,
  ...rest
}: PhoneProps) {
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  const screen = bare ? (
    <PhoneShell topBar={topBar} bottomBar={bottomBar}>{children}</PhoneShell>
  ) : (
    <Frame
      title={label ?? 'phone screen'}
      initialContent={'<!DOCTYPE html><html><head></head><body style="margin:0"><div></div></body></html>'}
      style={{ inlineSize: '100%', blockSize: '100%', border: 0, display: 'block', background: 'var(--ds-bg)' }}
    >
      <FrameStyles>
        <PhoneShell topBar={topBar} bottomBar={bottomBar}>{children}</PhoneShell>
      </FrameStyles>
    </Frame>
  )

  return (
    <figure data-part="phone" aria-label={label} {...rest}>
      <div data-part="phone-frame">
        {statusBar && (
          <div data-part="phone-status">
            <span data-part="phone-time">9:41</span>
            <span data-part="phone-notch" data-shape={notch} />
            <span data-part="phone-signals">
              <span data-part="phone-signal" />
              <span data-part="phone-wifi" />
              <span data-part="phone-battery" />
            </span>
          </div>
        )}
        <div data-part="phone-screen">
          {mounted ? screen : null}
        </div>
        <div data-part="phone-home" />
      </div>
      {label && <figcaption>{label}</figcaption>}
    </figure>
  )
}

/**
 * PhoneTopBar — mobile sticky navigation header. iOS NavigationBar 관용구.
 * 좌측 back · 중앙 title · 우측 action.
 */
type PhoneTopBarProps = {
  back?: boolean
  title?: ReactNode
  action?: ReactNode
}

export function PhoneTopBar({ back, title, action }: PhoneTopBarProps) {
  return (
    <header data-part="phone-topbar">
      <span data-part="phone-topbar-lead">{back && <span data-icon="chevron-left" aria-label="back" />}</span>
      {title && <strong data-part="phone-topbar-title">{title}</strong>}
      <span data-part="phone-topbar-trail">{action}</span>
    </header>
  )
}

/**
 * PhoneTabBar — mobile sticky bottom navigation. iOS TabBar 관용구.
 * 5 슬롯 고정, active index 로 current 표시.
 */
type PhoneTabBarProps = {
  items: ReactNode[]
  active?: number
}

export function PhoneTabBar({ items, active }: PhoneTabBarProps) {
  return (
    <nav data-part="phone-tabbar">
      {items.map((item, i) => (
        <span
          key={i}
          data-part="phone-tab"
          aria-current={i === active || undefined}
        >
          {item}
        </span>
      ))}
    </nav>
  )
}
