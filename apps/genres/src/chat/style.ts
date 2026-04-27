import { SHELL_MOBILE_MAX, css } from '@p/ds/tokens/foundations'

// chat 모바일 — 메인 = 메시지 스트림+composer. 멤버 aside 숨김. 채널 nav는 좌하단 FAB.
export const chatCss = css`
  @media (max-width: ${SHELL_MOBILE_MAX}) {
    aside[aria-label="멤버"] { display: none; }
  }
`
