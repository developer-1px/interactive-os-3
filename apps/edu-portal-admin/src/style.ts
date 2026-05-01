import { SHELL_MOBILE_MAX, border, css, hairlineWidth, radius, surface, text, typography } from '@p/ds/tokens/semantic'
import { pad } from '@p/ds/tokens/scalar'

// edu-portal-admin — admin 백오피스 셸 (sidebar | workspace / topbar + content).
// 모바일에서 sidebar는 좌측 드로어로 변환.
export const eduPortalAdminCss = css`
  main[data-part="edu-portal-admin-app"] {
    height: 100vh; display: flex; flex-direction: column; overflow: hidden;
    container-type: inline-size; container-name: shell;
  }
  main[data-part="edu-portal-admin-app"] > section[data-part="body"] {
    flex: 1; display: flex; min-height: 0;
  }
  section[data-part="workspace"] {
    flex: 1; display: flex; flex-direction: column; min-width: 0; min-height: 0;
  }
  header[data-part="topbar"] {
    flex: none;
    padding: ${pad(3)} ${pad(6)};
    border-bottom: var(--ds-hairline) solid var(--ds-border);
    display: flex; align-items: center; justify-content: space-between;
    gap: ${pad(3)};
  }
  header[data-part="topbar"] > hgroup h1 {
    ${typography('headingStrong')}; margin: 0;
  }
  header[data-part="topbar"] > hgroup p {
    color: ${text('subtle')}; margin: ${pad(0.5)} 0 0;
  }
  header[data-part="topbar"] > [data-part="actions"] {
    display: flex; gap: ${pad(2)};
  }
  section[data-part="content"] {
    flex: 1; overflow: auto; padding: ${pad(4)};
    display: flex; flex-direction: column; gap: ${pad(4)};
  }
  main[data-part="edu-portal-admin-app"] section[data-part="content"] > [data-page-root] {
    padding: 0;
    inline-size: 100%;
    max-inline-size: 72rem;
    margin-inline: auto;
  }
  main[data-part="edu-portal-admin-app"] section[data-part="content"] > [data-page-root] > aside:not([data-part]) {
    background: ${surface()};
    border: ${hairlineWidth()} solid ${border()};
    border-inline-start: ${hairlineWidth()} solid ${border()};
    border-left: ${hairlineWidth()} solid ${border()};
    border-radius: ${radius('md')};
  }

  /* nav-toggle은 데스크톱에서 숨김 — admin/catalog 공통 */
  main[data-part="edu-portal-admin-app"] [data-part="nav-toggle"] { display: none; }

  /* edu-portal-admin 모바일 — sidebar 좌측 드로어 + topbar/content 컴팩트 */
  @media (max-width: ${SHELL_MOBILE_MAX}) {
    main[data-part="edu-portal-admin-app"] [data-part="nav-toggle"] {
      display: inline-flex; align-items: center; justify-content: center;
      inline-size: 2.25rem; block-size: 2.25rem;
      border: var(--ds-hairline) solid var(--ds-border); border-radius: ${radius('md')};
      background: var(--ds-bg); cursor: pointer; flex: none;
      position: absolute; inset-block-start: ${pad(2)}; inset-inline-start: ${pad(2)};
      z-index: 10;
    }
    main[data-part="edu-portal-admin-app"] > section[data-part="body"] > nav[data-part="sidebar"] {
      position: fixed;
      inset-block: 0; inset-inline-start: 0;
      inline-size: min(80vw, 18rem);
      z-index: 50;
      transform: translateX(-100%);
      transition: transform var(--ds-dur-fast) var(--ds-ease-out);
      box-shadow: 0 0 24px color-mix(in oklch, CanvasText 12%, transparent);
    }
    main[data-part="edu-portal-admin-app"][data-nav-open="true"] > section[data-part="body"] > nav[data-part="sidebar"] {
      transform: translateX(0);
    }
    main[data-part="edu-portal-admin-app"] > section[data-part="body"] > button[data-part="scrim"] {
      position: fixed; inset: 0; z-index: 49;
      background: color-mix(in oklch, CanvasText 35%, transparent);
      border: 0;
    }

    main[data-part="edu-portal-admin-app"] > section[data-part="body"] > section[data-part="workspace"] {
      position: relative;
    }
    main[data-part="edu-portal-admin-app"] header[data-part="topbar"] {
      padding: ${pad(2)} ${pad(2)} ${pad(2)} calc(${pad(2)} + 2.25rem + ${pad(1.5)});
      gap: ${pad(2)};
    }
    main[data-part="edu-portal-admin-app"] header[data-part="topbar"] > hgroup h1 {
      font-size: var(--ds-text-md);
      overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
      min-inline-size: 0;
    }
    main[data-part="edu-portal-admin-app"] header[data-part="topbar"] > hgroup p { display: none; }

    main[data-part="edu-portal-admin-app"] > section[data-part="body"] > section[data-part="workspace"] > section[data-part="content"] {
      padding: ${pad(2)} max(${pad(2)}, env(safe-area-inset-left)) ${pad(4)} max(${pad(2)}, env(safe-area-inset-right));
      gap: ${pad(3)};
    }
  }
`
