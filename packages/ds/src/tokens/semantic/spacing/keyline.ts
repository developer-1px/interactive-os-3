import { pad } from '../../scalar/space'

/**
 * 모든 수직 리스트 컨테이너가 공유하는 subgrid 축 + spacing 상수.
 *   [lead]  = 체브론·아이콘·아바타 등 선두 슬롯 (auto)
 *   [label] = 메인 콘텐츠 (1fr)
 *   [trail] = 배지·시간·메뉴 버튼 등 후위 슬롯 (auto)
 *
 * Law of Proximity: slotGap < containerPad — 같은 행 안 아이콘·라벨은 붙고,
 * 행끼리는 여유 있게 떨어져야 시각 그룹이 뚜렷해진다.
 */

/** @demo type=value fn=tracks */
export const tracks = '[lead] auto [label] 1fr [trail] auto'

/** @demo type=value fn=gap */
export const gap = pad(2)
/** @demo type=value fn=rowGap */
export const rowGap = gap
/** @demo type=value fn=slotGap */
export const slotGap = pad(1.5)
/** @demo type=value fn=containerPad */
export const containerPad = gap

/**
 * Tree level 하나당 수평 들여쓰기 폭.
 * @demo type=value fn=levelShift
 */
export const levelShift = pad(4)

/**
 * Feed 아바타 폭·높이 (lead 슬롯이 auto이지만 실제 요소 크기는 여기서 통제).
 * @demo type=value fn=avatarSize
 */
export const avatarSize = pad(9)

/**
 * mobileGrid — 모바일 화면 guide 별 keyline SSoT (`pad()` step 단위).
 *
 * SSoT 단위는 절대 px 가 아니라 **ds-space step** (`pad(N)` 의 N). 이렇게 해야
 * iframe viewer 가 ds-space 를 1.5× 로 zoom 해도 (desktop catalog 가독성용) 토큰
 * 컴퓨티드 px 와 자연스럽게 함께 scale — false-positive 0.
 *
 * 8 LayoutGuide 와 1:1. 각 step 은 같은 guide 의 `slot.<guide>.pad` 와 일치.
 * audit (./keyline-audit.ts) 가 phone-body 의 `--ds-space` 를 읽어 동적으로
 * expected px 를 계산한다.
 *
 *   list   · thread · grid · article — pad(4) (= hierarchy.shell)
 *   feed   · hero                     — pad(0) (= hierarchy.group, full-bleed)
 *   state                             — pad(8) (centered fallback, 큰 호흡)
 *   form                              — pad(4) (field 자체가 inner pad)
 *
 * @demo type=spacing fn=mobileGrid
 */
export const mobileGrid = {
  list:    { outerMarginSteps: 4 },
  thread:  { outerMarginSteps: 4 },
  feed:    { outerMarginSteps: 0 },
  grid:    { outerMarginSteps: 4 },
  article: { outerMarginSteps: 4 },
  hero:    { outerMarginSteps: 0 },
  state:   { outerMarginSteps: 8 },
  form:    { outerMarginSteps: 4 },
} as const

export type MobileGuideName = keyof typeof mobileGrid
