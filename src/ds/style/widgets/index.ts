import { switchCss } from './control/switch'
import { valueCss } from './control/progress'
import { sliderCss } from './control/slider'
import { buttonCss } from './control/button'
import { formCss } from './control/form'
import { toggle, alert } from './control/toggle'
import { dialogCss, tooltipCss } from './overlay/overlay'
import { detailsCss } from './overlay/details'
import { glassCss } from './overlay/glass'
import { feedCss } from './pattern/feed'
import { tabPanelCss, carouselCss } from './pattern/bar'
import { highlightMark } from './pattern/highlightMark'
import { barChart } from './pattern/barChart'
import { courseCard } from './pattern/courseCard'
import { display } from './pattern/display'
import { legendDot } from './pattern/legendDot'
import { roleCard } from './pattern/roleCard'
import { statCard } from './pattern/statCard'
import { top10 } from './pattern/top10'
import { postCard } from './pattern/postCard'
import { feedPost } from './pattern/feedPost'
import { messageBubble } from './pattern/messageBubble'
import { productCard } from './pattern/productCard'
import { contractCard } from './pattern/contractCard'
import { proseCss } from './pattern/prose'
import { listboxCss } from './collection/listbox'
import { orderableCss } from './collection/orderable'
import { menu } from './collection/menu'
import { tabs } from './collection/tabs'
import { tree } from './collection/tree'
import { grid } from './composite/grid'
import { toolbar } from './composite/toolbar'
import { sidebarCss } from './composite/sidebar'
import { sidebarFloatingCss } from './composite/sidebarFloating'
import { pageCss } from './composite/page'
import { layout } from './layout/layout'
import { splitCss } from './layout/split'

export const widgets = () =>
  [
    // control
    switchCss, valueCss, sliderCss, buttonCss, formCss, toggle(), alert(),
    // overlay
    dialogCss, tooltipCss, detailsCss, glassCss,
    // pattern
    feedCss, tabPanelCss, carouselCss,
    highlightMark(), barChart(), courseCard(), display(),
    legendDot(), roleCard(), statCard(), top10(), postCard(), feedPost(), messageBubble(), productCard(),
    contractCard(), proseCss(),
    // collection
    listboxCss(), orderableCss(), menu(), tabs(), tree(),
    // composite
    grid(), toolbar(), sidebarCss(), sidebarFloatingCss(), pageCss,
    // layout
    layout(), splitCss(),
  ].join('\n')
