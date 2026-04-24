import { css, pad, radius, rowPadding, surface } from '../../fn'

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
  /* 흐리지 않은 투명 백드롭 — 콘텐츠가 선명하게 비치도록 */
  :where(dialog)::backdrop {
    background: color-mix(in oklch, CanvasText 6%, transparent);
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
    overflow: auto;
    padding: ${pad(1)} 0 0;
  }
`

export const tooltipCss = css`
  :where([role="tooltip"]) {
    ${surface(2)}
    padding: ${rowPadding(2)};
    font-size: var(--ds-text-sm);
    border-radius: ${radius('sm')};
    color: inherit;
    pointer-events: none;
  }
`
