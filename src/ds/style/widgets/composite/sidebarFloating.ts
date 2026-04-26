import { css } from '../../../foundations/primitives/css'
import { neutral, pad, radius, hierarchy, tint } from '../../../foundations'

/**
 * sidebarFloating — mobile surface of `sidebar/admin` intent.
 *
 * 두 가지 책임:
 *   1) 좌하단 FAB([data-ds-floating-nav-trigger]) 시각 + 아이콘 박스
 *   2) nav[popover][data-state="floating"] full-height overlay surface
 *
 * viewport 분기 (feedback_mobile_js_boundary — CSS만):
 *   - desktop(min-width:768px): trigger 숨김. 일반 sidebar 표시.
 *   - mobile(max-width:767px):  일반 sidebar 숨김. trigger 표시.
 *
 * 메인 sidebar.ts의 nav[aria-roledescription="sidebar"] 규칙은 [data-state="floating"]
 * 셀렉터로 폭/위치만 override (background/padding/gap/item style 모두 재사용).
 */
export const sidebarFloatingCss = () => css`
  [data-ds-floating-nav-trigger] {
    position: fixed;
    inset-block-end: ${pad(4)};
    inset-inline-start: ${pad(4)};
    z-index: 40;
    inline-size: ${pad(14)};
    block-size: ${pad(14)};
    border-radius: ${radius('full')};
    border: 1px solid ${neutral(3)};
    background: ${neutral(0)};
    box-shadow: var(--ds-elev-2);
    display: inline-flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
  }
  [data-ds-floating-nav-trigger][data-icon]::before {
    margin: 0;
    inline-size: 1.5em;
    block-size: 1.5em;
    opacity: 1;
  }

  nav[aria-roledescription="sidebar"][data-state="floating"] {
    position: fixed;
    inset-block: 0;
    inset-inline-start: 0;
    block-size: 100dvh;
    inline-size: min(85vw, 320px);
    margin: 0;
    border: 0;
    border-inline-end: 1px solid ${neutral(3)};
    box-shadow: var(--ds-elev-3);
    --ds-sidebar-w: min(85vw, 320px);
    padding: ${hierarchy.surface};
    gap: ${hierarchy.shell};
  }
  nav[aria-roledescription="sidebar"][data-state="floating"]::backdrop {
    background: ${tint('CanvasText', 10)};
    backdrop-filter: blur(8px);
  }

  @media (min-width: 768px) {
    [data-ds-floating-nav-trigger],
    nav[aria-roledescription="sidebar"][data-state="floating"] {
      display: none !important;
    }
  }
  @media (max-width: 767px) {
    nav[aria-roledescription="sidebar"]:not([data-state="floating"]) {
      display: none !important;
    }
  }
`
