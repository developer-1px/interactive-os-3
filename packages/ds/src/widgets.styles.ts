// Phase 2h-2: widget CSS aggregator (root level — ui/ + style/ 양쪽 import 가능).
// 1:1 sibling co-location 된 25개는 ui/<tier>/<Name>.style 에서, 미공유 orphan 은
// 잔존 style/widgets/ 에서 가져옴.

// ─── 1:1 co-located (ui sibling) ────────────────────────────────────────
import { switchCss } from './ui/2-action/Switch.style'
import { valueCss } from './ui/1-status/Progress.style'
import { sliderCss } from './ui/3-input/Slider.style'
import { buttonCss } from './ui/2-action/Button.style'
import { feedCss } from './ui/patterns/Feed.style'
import { barChart } from './ui/patterns/BarChart.style'
import { legendDot } from './ui/1-status/LegendDot.style'
import { top10 } from './ui/patterns/Top10List.style'
import { listboxCss } from './ui/4-selection/Listbox.style'
import { orderableCss } from './ui/5-display/OrderableList.style'
import { menu } from './ui/4-selection/Menu.style'
import { tabs } from './ui/4-selection/Tabs.style'
import { tree } from './ui/4-selection/Tree.style'
import { grid } from './ui/8-layout/Grid.style'
import { toolbar } from './ui/4-selection/Toolbar.style'
import { splitCss } from './ui/8-layout/Split.style'
import { routeGrid } from './ui/6-overlay/command/RouteGrid.style'

// ─── 잔존 (orphan / shared, 미공유 CSS) ───────────────────────────────────
import { formCss } from './style/widgets/control/form'
import { toggle, alert } from './style/widgets/control/toggle'
import { dialogCss, tooltipCss } from './style/widgets/overlay/overlay'
import { detailsCss } from './style/widgets/overlay/details'
import { glassCss } from './style/widgets/overlay/glass'
import { tabPanelCss, carouselCss } from './style/widgets/pattern/bar'
import { highlightMark } from './style/widgets/pattern/highlightMark'
import { sidebarCss } from './style/widgets/composite/sidebar'
import { sidebarFloatingCss } from './style/widgets/composite/sidebarFloating'
import { pageCss } from './style/widgets/composite/page'
import { layout } from './style/widgets/layout/layout'

export const widgets = () =>
  [
    // control
    switchCss, valueCss, sliderCss, buttonCss, formCss, toggle(), alert(),
    // overlay
    dialogCss, tooltipCss, detailsCss, glassCss,
    // pattern
    feedCss, tabPanelCss, carouselCss,
    highlightMark(), barChart(),
    legendDot(), top10(),
    /* data-card="*" 패턴은 src/index.ts 가 content layer 로 별도 등록. */
    // collection
    listboxCss(), orderableCss(), menu(), tabs(), tree(),
    // composite
    grid(), toolbar(), sidebarCss(), sidebarFloatingCss(), pageCss,
    // layout
    layout(), splitCss(),
    // command palette
    routeGrid(),
  ].join('\n')
