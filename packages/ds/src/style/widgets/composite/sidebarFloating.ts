import { SHELL_MOBILE_MAX, border, css, hairlineWidth, hierarchy, radius, scrim, slot, surface } from '../../../tokens/semantic'
import { elev } from '../../../tokens/scalar'

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
 * 메인 sidebar.ts의 nav[data-part="sidebar"] 규칙은 [data-state="floating"]
 * 셀렉터로 폭/위치만 override (background/padding/gap/item style 모두 재사용).
 */
export const cssSidebarFloating = () => css`
  [data-ds-floating-nav-trigger] {
    position: fixed;
    inset-block-end: ${slot.fab.inset};
    inset-inline-start: ${slot.fab.inset};
    z-index: 40;
    inline-size: ${slot.fab.size};
    block-size: ${slot.fab.size};
    border-radius: ${radius('full')};
    border: ${hairlineWidth()} solid ${border()};
    background: ${surface('default')};
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

  /* 뒤로 버튼 — popoverTargetAction="hide"로 popover 닫음. backdrop 탭이 모바일에서
     직관적이지 않으므로 명시적 affordance 제공. */
  [data-ds-floating-nav-back] {
    inline-size: ${slot.sidebar.avatarSize};
    block-size: ${slot.sidebar.avatarSize};
    border: 0;
    background: transparent;
    border-radius: ${radius('md')};
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    justify-content: center;
  }
  [data-ds-floating-nav-back][data-icon]::before {
    margin: 0;
    inline-size: 1.25em;
    block-size: 1.25em;
    opacity: 1;
  }

  /* 닫힌 상태 — sidebar.ts의 display:flex가 specificity 동등으로 polyfill의
     [popover]:not(.\\:popover-open){display:none}을 덮어쓰는 문제 차단.
     명시적으로 display:none을 두고 :popover-open / 폴리필 클래스에서만 flex 부활. */
  nav[data-part="sidebar"][data-state="floating"] {
    display: none;
  }
  nav[data-part="sidebar"][data-state="floating"]:popover-open,
  nav[data-part="sidebar"][data-state="floating"].\\:popover-open {
    display: flex;
    flex-direction: column;
    position: fixed;
    inset-block: 0;
    inset-inline-start: 0;
    block-size: 100dvh;
    inline-size: min(85vw, 320px);
    margin: 0;
    border: 0;
    border-inline-end: ${hairlineWidth()} solid ${border()};
    box-shadow: var(--ds-elev-3);
    --ds-sidebar-w: min(85vw, 320px);
    padding: ${hierarchy.surface};
    gap: ${hierarchy.shell};
    z-index: 100;
  }
  nav[data-part="sidebar"][data-state="floating"]::backdrop {
    background: ${scrim('subtle')};
    backdrop-filter: blur(8px);
  }

  @media (min-width: 768px) {
    [data-ds-floating-nav-trigger] {
      display: none !important;
    }
  }
  @media (max-width: 767px) {
    nav[data-part="sidebar"]:not([data-state="floating"]) {
      display: none !important;
    }
  }

  /* ── 모바일 컨텐츠 영역 공식화 ─────────────────────────────────────────────
     모든 라우트의 main 컨텐츠가 viewport 가장자리에 붙지 않도록 hierarchy 토큰으로
     일괄 적용. L4 surface(pad(2)) inline padding + FAB 클리어런스 block-end 패딩.

     Opt-out: main[data-no-mobile-pad] (이미 자체 padding 가진 라우트는 명시 거부).
     Opt-out for chat/feed-style stream containers: main[data-stream]도 padding 0.
     ───────────────────────────────────────────────────────────────────────── */
  @media (max-width: ${SHELL_MOBILE_MAX}) {
    main:not([data-no-mobile-pad]):not([data-stream]) {
      padding-inline: ${hierarchy.surface};
    }
    /* FAB(좌하단 56px + pad(4) inset) 위로 본문이 가리지 않도록 main 끝에 여백 추가 */
    main:not([data-no-mobile-pad]) {
      padding-block-end: calc(${slot.fab.size} + ${slot.fab.inset} + ${hierarchy.surface});
    }
    /* article[prose]는 이미 자체 padding-inline 가지고 있어 main의 inline padding과
       이중으로 겹치지 않게 article 안의 inline은 0으로 리셋 */
    main > article[data-flow="prose"] {
      padding-inline: 0;
    }

    /* 모바일 hairline + explicit 1px 일괄 제거 — DPR≥2에서 흐려 보이는 문제.
       --ds-hairline 토큰 0 + surface 컨테이너 explicit border-width 0.
       컨트롤(button/input/select/textarea + role="checkbox/radio/switch/option")은
       affordance 유지를 위해 제외. */
    :root {
      --ds-hairline: 0px;
    }
    article, section, aside, header, footer, main, nav,
    figure, blockquote, pre, table, hr,
    dialog, [popover],
    [role="dialog"], [role="region"], [role="group"],
    [role="list"], [role="listitem"],
    [role="tabpanel"], [role="separator"],
    [data-ds="Row"], [data-ds="Column"], [data-ds="Grid"] {
      border-width: 0;
      box-shadow: none;
    }
    hr { background: transparent; }

    /* 경계는 border 대신 soft shadow — Apple HIG / Material 3 elevation 패턴.
       "raised" emphasis 가진 카드성 surface만 1px ring + 가벼운 drop으로 떠 보이게.
       hairline ring(4% alpha)이 sub-pixel 흐림 없이 "옆 표면과 분리"를 표현. */
    [data-variant="raised"],
    article[data-flow="prose"],
    [popover][role="dialog"][data-part="popover"],
    dialog:not([data-ds-sheet]) {
      box-shadow: ${elev(2)};
      border-radius: ${radius('lg')};
    }
  }
`
