import { css, dim, font, pad, radius } from '../../foundations'

/**
 * Table — 데이터 주도 표 부품의 시각.
 * 셀렉터: table[data-part="table"]. classless — tag + data-col + data-align만.
 * sticky header + 가독 행간. monospace는 호출처가 cell 내부에 <code>로 감쌀 것.
 */
export const table = () => css`
  table[data-part="table"] {
    inline-size: 100%;
    border-collapse: collapse;
    font-size: ${font('sm')};
    color: ${dim(75)};
  }
  table[data-part="table"] > caption {
    text-align: start;
    font-size: ${font('xs')};
    color: ${dim(55)};
    padding: ${pad(1)} 0;
    caption-side: top;
  }
  table[data-part="table"] thead th {
    position: sticky;
    inset-block-start: 0;
    text-align: start;
    padding: ${pad(0.75)} ${pad(2)};
    color: ${dim(55)};
    font-weight: 500;
    font-size: ${font('xs')};
    background: ${dim(2)};
    border-block-end: 1px solid ${dim(8)};
  }
  table[data-part="table"] tbody tr {
    border-block-end: 1px solid ${dim(4)};
  }
  table[data-part="table"] tbody tr:last-child { border-block-end: 0; }
  table[data-part="table"] tbody td {
    padding: ${pad(0.75)} ${pad(2)};
    vertical-align: top;
    line-height: 1.5;
  }
  table[data-part="table"] th[data-align="end"],
  table[data-part="table"] td[data-align="end"] { text-align: end; }
  table[data-part="table"] th[data-align="center"],
  table[data-part="table"] td[data-align="center"] { text-align: center; }
  table[data-part="table"] td > code {
    font-family: var(--ds-font-mono);
    font-size: ${font('xs')};
  }
  table[data-part="table"] {
    border: 1px solid ${dim(8)};
    border-radius: ${radius('md')};
    overflow: hidden;
  }
`
