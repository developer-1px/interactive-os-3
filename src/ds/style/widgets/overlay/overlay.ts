import { css, pad, radius, rowPadding, surface, tint } from '../../../fn'

export const dialogCss = css`
  :where(dialog) {
    ${surface(3)}
    color: inherit;
    padding: ${pad(4)};
    border-radius: ${radius('lg')};
    max-width: min(90vw, 480px);
    min-width: 280px;
    margin: auto;
  }
  /* 2026 — 얇은 틴트 + backdrop-filter blur로 콘텐츠를 "위에 뜬" 듯 분리 */
  :where(dialog)::backdrop {
    background: ${tint('CanvasText', 10)};
    backdrop-filter: blur(8px);
  }

  /* Command palette — 상단 정렬, 가로 확장, 입력/목록 스택 */
  :where(dialog[aria-label="Command palette"][open]) {
    max-width: min(92vw, 640px);
    width: 100%;
    margin-top: 12vh;
    padding: ${pad(1)};
    display: grid;
    gap: ${pad(1)};
  }
  :where(dialog[aria-label="Command palette"]) :where(input[role="combobox"]) {
    border: 0;
    background: transparent;
    font-size: var(--ds-text-md);
    padding: ${pad(2)} ${pad(3)};
  }
  :where(dialog[aria-label="Command palette"]) :where(input[role="combobox"]):focus {
    outline: none;
    box-shadow: none;
  }
  :where(dialog[aria-label="Command palette"]) :where([role="listbox"]) {
    border: 0;
    border-top: 1px solid var(--ds-border);
    border-radius: 0;
    max-height: min(60vh, 420px);
    min-height: 0;
    overflow: auto;
    padding: ${pad(1)} 0 0;
  }
`

export const tooltipCss = css`
  /* Popover — non-modal light-dismiss. native [popover] element. dialog와 외형 공유하되
     centered 강제 풀고, padding/border-radius만 기본값. 위치는 소비 측이 결정.
     [popover]는 modal <dialog>와 달리 ::backdrop을 만들지 않으므로 scrim 옵션 시
     body::before로 dim layer를 깐다 (popover는 top layer라 scrim 위에 떠 있음). */
  [popover][role="dialog"][aria-roledescription="popover"] {
    ${surface(3)}
    background-color: var(--ds-bg);
    color: inherit;
    margin: 0;
    padding: ${pad(3)};
    border-radius: ${radius('lg')};
    border: 1px solid var(--ds-border);
    /* 선명도 우선 — 1px hairline ring(경계 또렷) + 짧은 드롭(공간감만). 큰 blur는 흐림 원인. */
    box-shadow:
      0 0 0 1px ${tint('CanvasText', 6)},
      0 2px 6px ${tint('CanvasText', 8)},
      0 8px 16px ${tint('CanvasText', 10)};
  }
  body:has([popover][data-ds-scrim]:popover-open)::before {
    content: '';
    position: fixed; inset: 0;
    background: ${tint('CanvasText', 30)};
    z-index: 99;
    pointer-events: none;
  }

  /* Sheet — edge-anchored dialog (모바일 drawer). max-width/centering 무력화 + 슬라이드. */
  :where(dialog[data-ds-sheet]) {
    margin: 0;
    max-width: none;
    border-radius: 0;
    padding: ${pad(3)};
    transition: translate var(--ds-dur-base) var(--ds-ease-out);
  }
  :where(dialog[data-ds-sheet="end"]) {
    inset-block: 0; inset-inline-end: 0; inset-inline-start: auto;
    block-size: 100dvh; inline-size: min(360px, 92vw);
    border-inline-start: 1px solid var(--ds-border);
  }
  :where(dialog[data-ds-sheet="start"]) {
    inset-block: 0; inset-inline-start: 0; inset-inline-end: auto;
    block-size: 100dvh; inline-size: min(320px, 88vw);
    border-inline-end: 1px solid var(--ds-border);
  }
  :where(dialog[data-ds-sheet="bottom"]) {
    inset-inline: 0; inset-block-end: 0; inset-block-start: auto;
    inline-size: 100%; max-block-size: 88dvh;
    border-start-start-radius: ${radius('lg')};
    border-start-end-radius: ${radius('lg')};
    border-block-start: 1px solid var(--ds-border);
  }

  :where([role="tooltip"]) {
    ${surface(2)}
    padding: ${rowPadding(2)};
    font-size: var(--ds-text-sm);
    border-radius: ${radius('sm')};
    color: inherit;
    pointer-events: none;
  }
`
