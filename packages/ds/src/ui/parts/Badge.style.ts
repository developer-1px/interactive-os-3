import { css, dim, font, pad, radius, status, toneTint, weight } from '../../tokens/foundations'

/**
 * Badge (parts) — counter / status dot.
 * entity/highlightMark.ts의 <mark>(텍스트 하이라이트)와 분리된 표면적 dot/count 부품.
 * 셀렉터: span[data-part="badge"]. tone은 의미 토큰.
 */
export const badge = () => css`
  :where(span[data-part="badge"]) {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-inline-size: 1.25em;
    block-size: 1.25em;
    padding: 0 ${pad(0.5)};
    border-radius: ${radius('pill')};
    font-size: ${font('xs')};
    font-weight: ${weight('semibold')};
    line-height: 1;
    background: ${dim(10)};
    color: inherit;
    vertical-align: middle;
    user-select: none;
  }
  :where(span[data-part="badge"][data-dot="true"]) {
    inline-size: .5em;
    block-size: .5em;
    min-inline-size: 0;
    padding: 0;
    background: currentColor;
  }
  span[data-part="badge"][data-tone="success"] { ${toneTint('success', 12)} }
  span[data-part="badge"][data-tone="warning"] { ${toneTint('warning', 12)} }
  span[data-part="badge"][data-tone="danger"]  { ${toneTint('danger', 12)} }
  span[data-part="badge"][data-dot="true"][data-tone="success"] { background: ${status('success')}; color: ${status('success')}; }
  span[data-part="badge"][data-dot="true"][data-tone="warning"] { background: ${status('warning')}; color: ${status('warning')}; }
  span[data-part="badge"][data-dot="true"][data-tone="danger"]  { background: ${status('danger')};  color: ${status('danger')}; }
`
