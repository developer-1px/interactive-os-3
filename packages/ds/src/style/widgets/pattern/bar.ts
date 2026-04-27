import { css, radius, grouping } from '../../../tokens/foundations'
import { containerPad, slotGap } from '../../../tokens/style/seed/keyline'

export const tabPanelCss = css`
  :where([role="tabpanel"]) { padding: ${containerPad}; }
`

export const carouselCss = css`
  :where(section[data-part="carousel"]) {
    display: flex;
    gap: ${slotGap};
    align-items: stretch;
  }
  :where([data-part="slide"]) {
    ${grouping(1)}
    padding: ${containerPad};
    border-radius: ${radius('sm')};
  }
`
