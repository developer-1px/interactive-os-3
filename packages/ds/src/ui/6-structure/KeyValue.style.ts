import { css, mute } from '../../tokens/semantic'
import { font, pad } from '../../tokens/scalar'

export const cssKeyValue = () => css`
  :where(dl:has(> dd)) {
    display: grid;
    grid-template-columns: max-content 1fr;
    gap: ${pad(0.75)} ${pad(2)};
    margin: 0;
  }
  :where(dl:has(> dd)) > dt {
    ${mute(2)}
    font-size: ${font('sm')};
  }
  :where(dl:has(> dd)) > dd {
    margin: 0;
    font-size: ${font('sm')};
    font-variant-numeric: tabular-nums;
  }
`
