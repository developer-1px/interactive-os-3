import { switchCss } from './control/switch'
import { valueCss } from './control/progress'
import { sliderCss } from './control/slider'
import { dialogCss, tooltipCss } from './overlay/overlay'
import { detailsCss } from './overlay/details'
import { feedCss } from './entity/feed'
import { proseCss } from './entity/prose'
import { tabPanelCss, carouselCss } from './entity/bar'
import { listboxCss } from './collection/listbox'
import { orderableCss } from './collection/orderable'

export const widgets = () =>
  [switchCss, dialogCss, tooltipCss, detailsCss, valueCss, sliderCss, feedCss, proseCss(), tabPanelCss, carouselCss, listboxCss(), orderableCss()].join('\n')
