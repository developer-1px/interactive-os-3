import { css, radius, slot, surface, text, toneTint, typography } from '../../../tokens/foundations'

/**
 * highlightMark — HTML <mark> 텍스트 하이라이트 스타일.
 * parts/Badge(count/status dot)와 의미가 다르다. 셀렉터: `mark`.
 */
export const cssHighlightMark = () => css`
  mark {
    display: inline-flex; align-items: center; gap: ${slot.mark.gap};
    padding: 1px ${slot.mark.padX};
    border-radius: ${radius('pill')};
    ${typography('microStrong')}
    line-height: 1.4;
    white-space: nowrap;
    background: ${surface('muted')};
    color: currentColor;
    cursor: default;
    user-select: none;
    vertical-align: middle;
  }
  mark[data-variant="info"]    { ${toneTint('accent', 10)} }
  mark[data-variant="success"] { ${toneTint('success', 10)} }
  mark[data-variant="warning"] { ${toneTint('warning', 10)} }
  mark[data-variant="danger"]  { ${toneTint('danger', 10)} }
  mark[data-variant="default"] { color: ${text('subtle')}; background: ${surface('muted')}; }
`
