import { switchCss } from './control/switch'
import { valueCss } from './control/progress'
import { sliderCss } from './control/slider'
import { buttonCss } from './control/button'
import { formCss } from './control/form'
import { toggle, alert } from './control/toggle'
import { dialogCss, tooltipCss } from './overlay/overlay'
import { detailsCss } from './overlay/details'
import { glassCss } from './overlay/glass'
import { feedCss } from './entity/feed'
import { proseCss } from './entity/prose'
import { tabPanelCss, carouselCss } from './entity/bar'
import { highlightMark } from './entity/highlightMark'
import { barChart } from './entity/barChart'
import { courseCard } from './entity/courseCard'
import { display } from './entity/display'
import { legendDot } from './entity/legendDot'
import { roleCard } from './entity/roleCard'
import { statCard } from './entity/statCard'
import { top10 } from './entity/top10'
import { contractCard } from './entity/contractCard'
import { postCard } from './entity/postCard'
import { feedPost } from './entity/feedPost'
import { messageBubble } from './entity/messageBubble'
import { productCard } from './entity/productCard'
import { listboxCss } from './collection/listbox'
import { orderableCss } from './collection/orderable'
import { menu } from './collection/menu'
import { tabs } from './collection/tabs'
import { tree } from './collection/tree'
import { grid } from './composite/grid'
import { toolbar } from './composite/toolbar'
import { sidebarCss } from './composite/sidebar'
import { layout } from './layout/layout'

export const widgets = () =>
  [
    // control
    switchCss, valueCss, sliderCss, buttonCss, formCss, toggle(), alert(),
    // overlay
    dialogCss, tooltipCss, detailsCss, glassCss,
    // entity
    feedCss, proseCss(), tabPanelCss, carouselCss,
    highlightMark(), barChart(), courseCard(), display(),
    legendDot(), roleCard(), statCard(), top10(), contractCard(), postCard(), feedPost(), messageBubble(), productCard(),
    // collection
    listboxCss(), orderableCss(), menu(), tabs(), tree(),
    // composite
    grid(), toolbar(), sidebarCss(),
    // layout
    layout(),
  ].join('\n')
