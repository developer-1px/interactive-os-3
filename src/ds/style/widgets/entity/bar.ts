import { css, radius, grouping } from '../../../foundations'
import { containerPad, slotGap } from '../../seed/keyline'

export const tabPanelCss = css`
  :where([role="tabpanel"]) { padding: ${containerPad}; }
`

export const carouselCss = css`
  :where(section[aria-roledescription="carousel"]) {
    display: flex;
    gap: ${slotGap};
    align-items: stretch;
  }
  :where([aria-roledescription="slide"]) {
    ${grouping(1)}
    padding: ${containerPad};
    border-radius: ${radius('sm')};
  }
`
