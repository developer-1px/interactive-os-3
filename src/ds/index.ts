import { display } from './style/widgets/display/display'
import { grid } from './style/widgets/grid/grid'
import { toolbar } from './style/widgets/bar/toolbar'
import { toggle, alert } from './style/widgets/form/toggle'
import { buttonCss } from './style/widgets/form/button'
import { formCss } from './style/widgets/form/form'
import { chipCss } from './style/widgets/display/chip'
import { layout } from './style/widgets/layout/layout'
import { menu } from './style/widgets/menu/menu'
import { reset } from './style/seed/reset'
import { shell } from './style/shell'
import { glassCss } from './style/glass'
import { states } from './style/states'
import { seeds } from './style/seed/tokens'
import { breakpointsCss } from './style/seed/breakpoints'
import { tabs } from './style/widgets/list/tabs'
import { tree } from './style/widgets/tree/tree'
import { widgets } from './style/widgets'
import { iconVars, iconIndicator } from './fn/icon'

export const dsCss = [
  reset,
  seeds,
  breakpointsCss,
  iconVars(),
  states(),
  menu(),
  tree(),
  tabs(),
  widgets(),
  toggle(),
  alert(),
  buttonCss,
  formCss,
  chipCss,
  grid(),
  toolbar(),
  layout(),
  display(),
  iconIndicator(),
  shell(),
  glassCss,
].join('\n')
export * from './core/types'
export { reduce } from './core/state/reduce'
export { fromTree, fromList, pathAncestors } from './core/state/fromTree'
export { useControlState } from './core/hooks/useControlState'
export { useRoving } from './core/hooks/useRoving'
export { useRovingDOM } from './core/hooks/useRovingDOM'
export { useSwipe, type SwipeDir, type UseSwipeOpts } from './core/hooks/useSwipe'
export { parentOf } from './core/axes'
export {
  navigateOnActivate,
  activateOnNavigate,
  expandBranchOnActivate,
  composeGestures,
  type GestureHelper,
} from './core/gesture'
// zone: collection — data-driven (CollectionProps + useRoving)
export * from './ui/collection/Listbox'
export * from './ui/collection/Option'
export * from './ui/collection/ListboxGroup'
export * from './ui/collection/Menu'
export * from './ui/collection/MenuItems'
export * from './ui/collection/MenuGroup'
export * from './ui/collection/Tree'
export * from './ui/collection/Columns'
export * from './ui/collection/RadioGroup'
export * from './ui/collection/CheckboxGroup'
// zone: composite — composition roving (children + useRovingDOM)
export * from './ui/composite/Toolbar'
export * from './ui/composite/Tabs'
export * from './ui/composite/OrderableList'
export * from './ui/composite/Menubar'
export * from './ui/composite/MenuList'
export * from './ui/composite/DataGrid'
export * from './ui/composite/DataGridRow'
export * from './ui/composite/RowGroup'
export * from './ui/composite/GridCell'
export * from './ui/composite/ColumnHeader'
export * from './ui/composite/RowHeader'
export * from './ui/composite/TreeGrid'
export * from './ui/composite/TreeRow'
// zone: control — atomic native tabbable
export * from './ui/control/Button'
export * from './ui/control/Field'
export * from './ui/control/Progress'
export * from './ui/control/Checkbox'
export * from './ui/control/Radio'
export * from './ui/control/Switch'
export * from './ui/control/Input'
export * from './ui/control/Textarea'
export * from './ui/control/Slider'
export * from './ui/control/NumberInput'
export * from './ui/control/ColorInput'
export * from './ui/control/Select'
export * from './ui/control/Combobox'
export * from './ui/control/ToolbarButton'
// zone: overlay — surface
export * from './ui/overlay/Dialog'
export * from './ui/overlay/Sheet'
export * from './ui/overlay/Popover'
export * from './ui/overlay/FloatingNav'
export * from './ui/overlay/Disclosure'
export * from './ui/overlay/Tooltip'
// zone: entity — domain content cards
export * from './ui/entity/Badge'
export * from './ui/entity/StatCard'
export * from './ui/entity/CourseCard'
export * from './ui/entity/RoleCard'
export * from './ui/entity/Feed'
export * from './ui/entity/FeedArticle'
// zone: layout — primitives + decoration
export * from './ui/layout/Row'
export * from './ui/layout/Column'
export * from './ui/layout/Grid'
export * from './ui/layout/Separator'
export * from './ui/layout/Carousel'
export * from './ui/layout/BarChart'
export * from './ui/layout/Top10List'
export * from './ui/layout/LegendDot'
export {
  Renderer, definePage, uiRegistry, resolveUi, placementAttrs, validatePage, node,
  type UiComponentName, type AnyNode, type NodeType,
  type RowNode as LayoutRowNode, type ColumnNode as LayoutColumnNode,
  type GridNode as LayoutGridNode, type AsideNode, type SectionNode,
  type HeaderNode, type FooterNode, type UiNode, type TextNode,
  type Flow, type Emphasis, type GridCols, type TextVariant, type Align,
  type ItemPlacement, type CommonNodeData, type TypedEntity,
} from './layout'
