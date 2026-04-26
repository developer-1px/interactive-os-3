import { css } from '../../../ds/foundations'
import { SHELL_MOBILE_MAX } from '../../../ds/style/preset/breakpoints'

// feed 모바일 — 메인 = 피드 카드 컬럼만. 추천 aside 숨김. nav는 좌하단 FAB.
export const feedCss = css`
  @media (max-width: ${SHELL_MOBILE_MAX}) {
    aside[aria-label="추천"] { display: none; }
  }
`
