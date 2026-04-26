import { css, pad } from '../../ds/foundations'
import { SHELL_MOBILE_MAX } from '../../ds/style/preset/breakpoints'

// Markdown viewer — 데스크톱은 중앙 정렬 + 여백, 모바일은 폭 100% + safe-area.
export const markdownCss = css`
  main[aria-roledescription="markdown-app"] {
    display: flex; flex-direction: column; gap: ${pad(3)};
    padding: ${pad(4)} max(${pad(4)}, env(safe-area-inset-left)) ${pad(8)} max(${pad(4)}, env(safe-area-inset-right));
    min-block-size: 100svh;
    overflow-x: hidden;
  }
  main[aria-roledescription="markdown-app"] > nav[aria-label="경로"] {
    inline-size: 100%; max-inline-size: 72ch; margin-inline: auto;
    font-size: var(--ds-text-sm); opacity: .8;
  }
  main[aria-roledescription="markdown-app"] > nav[aria-label="경로"] > code {
    font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
    overflow-wrap: anywhere; min-inline-size: 0;
  }
  main[aria-roledescription="markdown-app"] > article {
    inline-size: 100%; margin-inline: auto;
  }
  @media (max-width: ${SHELL_MOBILE_MAX}) {
    main[aria-roledescription="markdown-app"] {
      padding: ${pad(2)} max(${pad(2)}, env(safe-area-inset-left)) ${pad(6)} max(${pad(2)}, env(safe-area-inset-right));
      gap: ${pad(2)};
    }
  }
`
