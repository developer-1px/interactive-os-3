import { switchCss } from './form/switch'
import { valueCss } from './form/progress'
import { sliderCss } from './form/slider'
import { dialogCss, tooltipCss } from './overlay/overlay'
import { detailsCss } from './overlay/details'
import { feedCss } from './display/feed'
import { tabPanelCss, carouselCss } from './display/bar'

export const widgets = () =>
  [switchCss, dialogCss, tooltipCss, detailsCss, valueCss, sliderCss, feedCss, tabPanelCss, carouselCss].join('\n')
