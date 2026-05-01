import { css, grouping, radius } from '../../tokens/semantic'
import { font, rowPadding } from '../../tokens/scalar'

export const cssTooltip = () => css`
  :where([role="tooltip"]) {
    ${grouping(2)}
    padding: ${rowPadding(2)};
    font-size: ${font('sm')};
    border-radius: ${radius('sm')};
    color: inherit;
    pointer-events: none;
  }
`
