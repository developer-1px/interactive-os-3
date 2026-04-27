import { css, font, mute, pad } from '../../tokens/foundations'

export const keyValue = () => css`
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
