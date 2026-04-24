import { css, radius, surface } from '../../fn'
import { containerPad, slotGap } from '../../keyline'

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
    ${surface(1)}
    padding: ${containerPad};
    border-radius: ${radius('sm')};
  }
`
