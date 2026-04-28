import { css, mute } from '../../tokens/foundations'
import { font, pad } from '../../tokens/palette'

export const cssKeyValue = () => css`
  :where(dl) {
    display: grid;
    grid-template-columns: max-content 1fr;
    gap: ${pad(0.75)} ${pad(2)};
    margin: 0;
  }
  :where(dl) > dt {
    ${mute(2)}
    font-size: ${font('sm')};
  }
  :where(dl) > dd {
    margin: 0;
    font-size: ${font('sm')};
    font-variant-numeric: tabular-nums;
  }
`
