import { css, dim, font, pad, radius, toneTint } from '../../../tokens/foundations'

/**
 * highlightMark — HTML <mark> 텍스트 하이라이트 스타일.
 * parts/Badge(count/status dot)와 의미가 다르다. 셀렉터: `mark`.
 */
export const highlightMark = () => css`
  mark {
    display: inline-flex; align-items: center; gap: ${pad(0.5)};
    padding: 1px ${pad(1.25)};
    border-radius: ${radius('pill')};
    font-size: ${font('xs')};
    font-weight: 600;
    line-height: 1.4;
    white-space: nowrap;
    background: ${dim(8)};
    color: currentColor;
    cursor: default;
    user-select: none;
    vertical-align: middle;
  }
  mark[data-tone="info"]    { ${toneTint('accent', 10)} }
  mark[data-tone="success"] { ${toneTint('success', 10)} }
  mark[data-tone="warning"] { ${toneTint('warning', 10)} }
  mark[data-tone="danger"]  { ${toneTint('danger', 10)} }
  mark[data-tone="neutral"] { color: ${dim(65)}; background: ${dim(6)}; }
`
