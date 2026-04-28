import { accent, accentTint, css, text } from '../../tokens/foundations'
import { pad } from '../../tokens/palette'

export const cssPagination = () => css`
  [data-part="pagination"] > ol {
    display: inline-flex; align-items: center; gap: ${pad(0.5)};
    list-style: none; margin: 0; padding: 0;
  }
  [data-part="pagination"] [data-part="page-num"][aria-current="page"] {
    background: ${accentTint('soft')};
    color: ${accent()};
    border-color: ${accent()};
  }
  [data-part="pagination"] [data-part="page-ellipsis"] {
    padding: 0 ${pad(1)};
    color: ${text('mute')};
  }
`
