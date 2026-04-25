import { switchCss } from './form/switch'
import { valueCss } from './form/progress'
import { sliderCss } from './form/slider'
import { dialogCss, tooltipCss } from './overlay/overlay'
import { detailsCss } from './overlay/details'
import { feedCss } from './display/feed'
import { proseCss } from './display/prose'
import { tabPanelCss, carouselCss } from './display/bar'
import { listboxCss } from './list/listbox'
import { orderableCss } from './list/orderable'

export const widgets = () =>
  [switchCss, dialogCss, tooltipCss, detailsCss, valueCss, sliderCss, feedCss, proseCss(), tabPanelCss, carouselCss, listboxCss(), orderableCss()].join('\n')
