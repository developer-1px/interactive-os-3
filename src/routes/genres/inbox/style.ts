import { css } from '../../../ds/foundations'
import { SHELL_MOBILE_MAX } from '../../../ds/style/preset/breakpoints'

// inbox 모바일 — 메일 목록만 표시. 사이드 폴더는 좌하단 FAB로 접근, 상세는 숨김.
export const inboxCss = css`
  @media (max-width: ${SHELL_MOBILE_MAX}) {
    [data-part="inbox-page"] > aside { display: none; }
    [data-part="inbox-page"] [aria-label="메시지 목록"] {
      flex: 1; min-inline-size: 0;
    }
  }
`
