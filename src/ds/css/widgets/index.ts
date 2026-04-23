import { switchCss } from './switch'
import { dialogCss, tooltipCss } from './overlay'
import { detailsCss } from './details'
import { valueCss } from './progress'
import { feedCss } from './feed'
import { tabPanelCss, carouselCss } from './bar'

export const widgets = () =>
  [switchCss, dialogCss, tooltipCss, detailsCss, valueCss, feedCss, tabPanelCss, carouselCss].join('\n')
