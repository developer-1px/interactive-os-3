import { switchCss } from './switch'
import { dialogCss, tooltipCss } from './overlay'
import { detailsCss } from './details'
import { valueCss } from './progress'
import { sliderCss } from './slider'
import { feedCss } from './feed'
import { tabPanelCss, carouselCss } from './bar'

export const widgets = () =>
  [switchCss, dialogCss, tooltipCss, detailsCss, valueCss, sliderCss, feedCss, tabPanelCss, carouselCss].join('\n')
