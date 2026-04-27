import { border, css, dim, font, hairlineWidth, pad, radius } from '../../tokens/foundations'

/**
 * Table — 데이터 주도 표 부품의 시각.
 * 셀렉터: :where(table). classless — tag + data-col + data-align만.
 * sticky header + 가독 행간. monospace는 호출처가 cell 내부에 <code>로 감쌀 것.
 */
export const table = () => css`
  :where(table) {
    inline-size: 100%;
    border-collapse: collapse;
    font-size: ${font('sm')};
    color: ${dim(75)};
  }
  :where(table) > caption {
    text-align: start;
    font-size: ${font('xs')};
    color: ${dim(55)};
    padding: ${pad(1)} 0;
    caption-side: top;
  }
  :where(table) thead th {
    position: sticky;
    inset-block-start: 0;
    text-align: start;
    padding: ${pad(0.75)} ${pad(2)};
    color: ${dim(55)};
    font-weight: 500;
    font-size: ${font('xs')};
    background: ${dim(2)};
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
