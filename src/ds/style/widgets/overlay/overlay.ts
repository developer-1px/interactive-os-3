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
