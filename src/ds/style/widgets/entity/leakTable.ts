import { css, dim, font, pad, radius, status, surface, tint } from '../../../fn'

/**
 * LeakTable — raw-value 누수 보고서.
 * 시각: surface(1). 파일 단위 details 접기, 행은 monospace + line/kind/snippet 3컬럼.
 */
export const leakTable = () => css`
  .leak-table {
    ${surface(1)}
    border: 1px solid ${dim(8)};
    border-radius: ${radius('md')};
    overflow: hidden;
  }
  .leak-table > details {
    border-block-end: 1px solid ${dim(6)};
  }
  .leak-table > details:last-child { border-block-end: 0; }

  .leak-table > details > summary {
    cursor: pointer;
    user-select: none;
    padding: ${pad(1.5)} ${pad(2)};
    display: flex; align-items: center; gap: ${pad(1)};
    font-size: ${font('sm')};
    color: ${dim(75)};
    background: ${dim(3)};
  }
  .leak-table > details > summary:hover { background: ${dim(6)}; }
  .leak-table > details[open] > summary {
    border-block-end: 1px solid ${dim(8)};
    color: ${dim(85)};
    font-weight: 500;
  }
  .leak-table > details > summary > code {
    font-family: var(--ds-font-mono);
    font-size: ${font('xs')};
  }
  .leak-table > details > summary > small {
    color: ${status('warning')};
    background: ${tint(status('warning'), 12)};
    padding: 1px ${pad(0.75)};
    border-radius: ${radius('pill')};
    font-size: ${font('xs')};
    font-variant-numeric: tabular-nums;
  }

  .leak-table table {
    inline-size: 100%;
    border-collapse: collapse;
    font-size: ${font('xs')};
    font-family: var(--ds-font-mono);
  }
  .leak-table thead th {
    text-align: start;
    padding: ${pad(0.75)} ${pad(2)};
    color: ${dim(55)};
    font-weight: 500;
    background: ${dim(2)};
    border-block-end: 1px solid ${dim(6)};
  }
  .leak-table tbody tr { border-block-end: 1px solid ${dim(4)}; }
  .leak-table tbody tr:last-child { border-block-end: 0; }
  .leak-table tbody td {
    padding: ${pad(0.5)} ${pad(2)};
    color: ${dim(70)};
    vertical-align: top;
  }
  .leak-table td[data-col="line"]    { color: ${dim(45)}; inline-size: 4em; font-variant-numeric: tabular-nums; }
  .leak-table td[data-col="kind"]    { color: ${status('warning')}; inline-size: 7em; }
  .leak-table td[data-col="snippet"] {
    color: ${dim(85)};
    overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
    max-inline-size: 0;
  }

  .leak-table > p[data-tone="good"] {
    margin: 0;
    padding: ${pad(2)};
    color: ${status('success')};
    text-align: center;
  }
`
