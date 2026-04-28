// widget CSS aggregator — root level (ui/ + style/ 양쪽 import 가능).
// 1:1 sibling co-located 25개는 ui/<tier>/<Name>.style 에서, 미공유 orphan 은
// 잔존 style/widgets/ 에서 가져옴. 모든 export 는 css 로 시작 — naming-audit 합의.

// ─── 1:1 co-located (ui sibling) ────────────────────────────────────────
import { cssSwitch } from './ui/2-input/Switch.style'
import { cssValue } from './ui/5-live/Progress.style'
import { cssSlider } from './ui/2-input/Slider.style'
import { cssButton } from './ui/1-command/Button.style'
import { cssButtonGroup } from './ui/1-command/ButtonGroup.style'
import { cssFeed } from './ui/patterns/Feed.style'
import { cssBarChart } from './ui/patterns/BarChart.style'
import { cssLegendDot } from './ui/5-live/LegendDot.style'
import { cssSpinner } from './ui/5-live/Spinner.style'
import { cssTop10List } from './ui/patterns/Top10List.style'
import { cssListbox } from './ui/3-composite/Listbox.style'
import { cssSegmented } from './ui/3-composite/SegmentedControl.style'
import { cssOrderableList } from './ui/3-composite/OrderableList.style'
import { cssPagination } from './ui/7-landmark/Pagination.style'
import { cssStepper } from './ui/8-field/Stepper.style'
import { cssMenu } from './ui/3-composite/Menu.style'
import { cssTabs } from './ui/3-composite/Tabs.style'
import { cssTree } from './ui/3-composite/Tree.style'
import { cssGrid } from './ui/9-layout/Grid.style'
import { cssToolbar } from './ui/3-composite/Toolbar.style'
import { cssSplit } from './ui/9-layout/Split.style'

// ─── 잔존 (orphan / shared, 미공유 CSS) ───────────────────────────────────
import { cssForm } from './style/widgets/control/form'
import { cssItemRow } from './style/widgets/control/itemRow'
import { cssToggle, cssAlert } from './style/widgets/control/toggle'
import { cssDialog, cssTooltip } from './style/widgets/overlay/overlay'
import { cssDetails } from './style/widgets/overlay/details'
import { cssAccordion } from './ui/6-structure/Accordion.style'
import { cssToast } from './ui/5-live/Toast.style'
import { cssGlass } from './style/widgets/overlay/glass'
import { cssTabPanel, cssCarousel } from './style/widgets/pattern/bar'
import { cssHighlightMark } from './style/widgets/pattern/highlightMark'
import { cssSidebar } from './style/widgets/composite/sidebar'
import { cssSidebarFloating } from './style/widgets/composite/sidebarFloating'
import { cssPage } from './style/widgets/composite/page'
import { cssLayout } from './style/widgets/layout/layout'

// 모든 css* 는 () => string lazy 통일.
export const widgets = () =>
  [
    // control
    cssSwitch(), cssValue(), cssSlider(), cssButton(), cssButtonGroup(), cssForm(), cssItemRow(), cssToggle(), cssAlert(),
    // overlay
    cssDialog(), cssTooltip(), cssDetails(), cssAccordion(), cssToast(), cssGlass(),
    // pattern
    cssFeed(), cssTabPanel(), cssCarousel(),
    cssHighlightMark(), cssBarChart(),
    cssLegendDot(), cssSpinner(), cssTop10List(),
    /* data-card="*" 패턴은 src/index.ts 가 content layer 로 별도 등록. */
    // collection
    cssListbox(), cssSegmented(), cssOrderableList(), cssPagination(), cssStepper(), cssMenu(), cssTabs(), cssTree(),
    // composite
    cssGrid(), cssToolbar(), cssSidebar(), cssSidebarFloating(), cssPage(),
    // layout
    cssLayout(), cssSplit(),
  ].join('\n')
