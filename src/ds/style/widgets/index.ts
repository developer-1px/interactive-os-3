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
import { display } from './pattern/display'
import { legendDot } from './pattern/legendDot'
import { top10 } from './pattern/top10'
// contractCard / prose / Card 변형 (postCard · messageBubble · statCard · productCard ·
// courseCard · roleCard · feedPost) 는 content layer owner — src/ds/index.ts 가 등록.
// 여기 두 번 등록하면 cascade race → assertUniqueSelectors throw.
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
    highlightMark(), barChart(), display(),
    legendDot(), top10(),
    /* data-card="*" 패턴 (postCard·messageBubble·statCard·productCard·courseCard·
       roleCard·feedPost·contractCard) 은 src/ds/index.ts 에서 content layer 로 등록.
       parts/Card primitive override 가 필요하므로 widgets layer 로는 불충분. */
    // collection
    listboxCss(), orderableCss(), menu(), tabs(), tree(),
    // composite
    grid(), toolbar(), sidebarCss(), sidebarFloatingCss(), pageCss,
    // layout
    layout(), splitCss(),
  ].join('\n')
