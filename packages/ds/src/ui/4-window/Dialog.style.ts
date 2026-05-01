import { border, css, grouping, hairlineWidth, radius, scrim, slot } from '../../tokens/semantic'
import { font, pad } from '../../tokens/scalar'

export const cssDialog = () => css`
  :where(dialog) {
    ${grouping(3)}
    color: inherit;
    padding: ${slot.dialog.pad};
    border-radius: ${radius('lg')};
    max-width: min(90vw, 480px);
    min-width: 280px;
    margin: auto;
  }
  /* 2026 — 얇은 틴트 + backdrop-filter blur로 콘텐츠를 "위에 뜬" 듯 분리 */
  :where(dialog)::backdrop {
    background: ${scrim('subtle')};
    backdrop-filter: blur(8px);
  }

  /* Command palette — 상단 정렬, 가로 확장, 입력/목록 스택 */
  :where(dialog[aria-label="Command palette"][open]) {
    max-width: min(92vw, 1120px);
    width: 100%;
    margin-top: 8vh;
    padding: ${pad(1)};
    display: grid;
    gap: ${pad(1)};
  }
  :where(dialog[aria-label="Command palette"]) :where(input[role="combobox"]) {
    border: 0;
    background: transparent;
    font-size: ${font('md')};
    padding: ${pad(2)} ${pad(3)};
  }
  :where(dialog[aria-label="Command palette"]) :where(input[role="combobox"]):focus {
    outline: none;
    box-shadow: none;
  }
  :where(dialog[aria-label="Command palette"]) :where([role="listbox"]) {
    border: 0;
    border-top: ${hairlineWidth()} solid ${border()};
    border-radius: 0;
    max-height: min(60vh, 420px);
    min-height: 0;
    overflow: auto;
    padding: ${pad(1)} 0 0;
  }
`
