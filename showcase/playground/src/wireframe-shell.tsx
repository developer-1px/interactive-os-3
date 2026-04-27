/**
 * wireframe-shell — 모바일 골격 헬퍼.
 *
 * 모든 chapter screen 이 공유: Phone 안의 body/footer 슬롯, primary CTA,
 * tabBar 아이콘, sample 이미지 URL.
 *
 *  - <Body>          flex column, 스크롤 가능한 본문
 *  - <StickyAction>  하단 고정 sticky CTA 영역
 *  - <PrimaryButton> 100% 폭 primary 버튼
 *  - tabIcons(idx)   하단 탭바용 아이콘 5개 (active 강조)
 *  - sampleImg(seed) picsum.photos 320×320 URL
 */
import type { ReactNode } from 'react'
import { Column } from '@p/ds'
import { Button } from '@p/ds/ui/2-action/Button'
import { tabBar, composer, bodyFill, fullW } from './wireframe-tokens'

const TAB_TOKENS = ['home', 'search', 'inbox', 'list', 'settings'] as const

export const tabIcons = (active: number) =>
  TAB_TOKENS.map((token, i) => (
    <span key={token} data-icon={token} aria-hidden style={{ color: i === active ? tabBar.activeColor : undefined }} />
  ))

export const Body = ({ children }: { children: ReactNode }) => (
  <Column flow="form" style={bodyFill}>{children}</Column>
)

export const StickyAction = ({ children }: { children: ReactNode }) => (
  <div style={{ paddingBlock: composer.paddingBlock, borderBlockStart: composer.borderBlockStart, background: composer.background }}>
    {children}
  </div>
)

export const PrimaryButton = ({ children }: { children: ReactNode }) => (
  <Button data-emphasis="primary" style={fullW}>{children}</Button>
)

export const sampleImg = (seed: string) => `https://picsum.photos/seed/${seed}/320/320`
