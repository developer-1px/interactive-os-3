import { accent, css, text } from '../../tokens/semantic'
import { pad } from '../../tokens/scalar'

export const cssPagination = () => css`
  [data-part="pagination"] > ol {
    display: inline-flex; align-items: center; gap: ${pad(0.5)};
    list-style: none; margin: 0; padding: 0;
  }
  [data-part="pagination"] [data-part="page-num"][aria-current="page"] {
    background: ${accent('soft')};
    color: ${accent()};
    border-color: ${accent()};
  }
  [data-part="pagination"] [data-part="page-ellipsis"] {
    padding: 0 ${pad(1)};
    color: ${text('mute')};
  }
`
