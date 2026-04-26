import type { ComponentPropsWithoutRef, ReactNode } from 'react'

/**
 * Phone — iPhone device chrome primitive (실물 크기).
 *
 * iPhone 14 Pro: 393 × 852pt logical. dynamic island 35×11 / 상단 status bar 47pt.
 * showcase / wireframe / mockup 라우트의 mobile screen frame 으로 사용.
 *
 * 슬롯:
 *   children          — screen body (스크롤 영역)
 *   topBar (옵션)      — sticky header (status bar 바로 아래)
 *   bottomBar (옵션)   — sticky tab bar (home indicator 바로 위)
 *
 * 셀렉터 namespace: data-part="phone" + 자식의 data-part="phone-*"
 */
type PhoneProps = Omit<ComponentPropsWithoutRef<'figure'>, 'children'> & {
  label?: string
  /** classic notch (iPhone X~13) vs dynamic island (iPhone 14 Pro+). default island. */
  notch?: 'classic' | 'island'
  /** 9:41 status bar. default true. */
  statusBar?: boolean
  topBar?: ReactNode
  bottomBar?: ReactNode
  /** iframe 임베드 모드. src 가 있으면 children/topBar/bottomBar 무시하고 iframe 으로 라우트 임베드.
   *  iframe viewport=393px 이라 ds @media (max-width:600px) 모바일 분기가 자연 발동.
   *  Storybook viewport · Chromatic · Polaris docs 표준 패턴. */
  src?: string
  children?: ReactNode
}

export function Phone({
  label,
  notch = 'island',
  statusBar = true,
  topBar,
  bottomBar,
  src,
  children,
  ...rest
}: PhoneProps) {
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
        {!src && topBar}
        <div data-part="phone-screen">
          {src ? <iframe src={src} title={label ?? 'phone screen'} loading="lazy" /> : children}
        </div>
        {!src && bottomBar}
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
      <span data-part="phone-topbar-lead">{back && <span aria-hidden>‹</span>}</span>
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
