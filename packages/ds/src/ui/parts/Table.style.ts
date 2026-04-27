import { border, css, currentTint, hairlineWidth, radius, text, typography } from '../../tokens/foundations'
import { font, pad } from '../../tokens/palette'

/**
 * Table — 데이터 주도 표 부품의 시각.
 * 셀렉터: :where(table). classless — tag + data-col + data-align만.
 * sticky header + 가독 행간. monospace는 호출처가 cell 내부에 <code>로 감쌀 것.
 */
export const cssTable = () => css`
  :where(table) {
    inline-size: 100%;
    border-collapse: collapse;
    font-size: ${font('sm')};
    color: ${text('subtle')};
  }
  :where(table) > caption {
    text-align: start;
    font-size: ${font('xs')};
    color: ${text('mute')};
    padding: ${pad(1)} 0;
    caption-side: top;
  }
  :where(table) thead th {
    position: sticky;
    inset-block-start: 0;
    text-align: start;
    padding: ${pad(0.75)} ${pad(2)};
    color: ${text('mute')};
    ${typography('micro')};
    background: ${currentTint('subtle')};
    border-block-end: ${hairlineWidth()} solid ${border()};
  }
  :where(table) tbody tr {
    border-block-end: ${hairlineWidth()} solid ${border()};
  }
  :where(table) tbody tr:last-child { border-block-end: 0; }
  :where(table) tbody td {
    padding: ${pad(0.75)} ${pad(2)};
    vertical-align: top;
    line-height: 1.5;
  }
  :where(table) th[data-align="end"],
  :where(table) td[data-align="end"] { text-align: end; }
  :where(table) th[data-align="center"],
  :where(table) td[data-align="center"] { text-align: center; }
  :where(table) td > code {
    font-family: var(--ds-font-mono);
    font-size: ${font('xs')};
  }
  :where(table) {
    border: ${hairlineWidth()} solid ${border()};
    border-radius: ${radius('md')};
    overflow: hidden;
  }
`
