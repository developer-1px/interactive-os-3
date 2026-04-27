import { css, grouping, keyline, radius } from '../../../tokens/foundations'

export const cssTabPanel = () => css`
  :where([role="tabpanel"]) { padding: ${keyline.containerPad}; }
`

export const cssCarousel = () => css`
  :where(section[data-part="carousel"]) {
    display: flex;
    gap: ${keyline.slotGap};
    align-items: stretch;
  }
  :where([data-part="slide"]) {
    ${grouping(1)}
    padding: ${keyline.containerPad};
    border-radius: ${radius('sm')};
  }
`
