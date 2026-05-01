// dsCss / wrapAppsLayer / APPS_LAYER_DECL 는 './css' 로 이전.
// 배럴(이 파일)을 import 해도 CSS 합성 모듈을 평가하지 않도록 re-export 만 한다.
export { dsCss, wrapAppsLayer, APPS_LAYER_DECL } from './css'

export * from '@p/headless/types'
export * from '@p/headless/data'
export { reduce } from '@p/headless/state/reduce'
export { fromTree, fromList, pathAncestors } from '@p/headless/state/fromTree'
export { useControlState } from '@p/headless/state/useControlState'
export { useEventBridge } from '@p/headless/state/useEventBridge'
export { defineFlow, useFlow, type FlowDef } from '@p/headless/flow'
export {
  defineFeature, useFeature,
  type FeatureSpec, type CommandBase,
  type Effect, type QuerySpec, type QueryResult,
  invalidateQuery,
} from '@p/headless/feature'
export { useRoving } from '@p/headless/roving/useRoving'
export { useRovingDOM } from '@p/headless/roving/useRovingDOM'
export { parentOf } from '@p/headless/axes'
export {
  navigateOnActivate,
  activateOnNavigate,
  expandBranchOnActivate,
  composeGestures,
  activateProps,
  type GestureHelper,
} from '@p/headless/gesture'
export {
  defineMiddleware,
  type Middleware, type Phase,
  type PreDispatchCtx, type PostDispatchCtx, type ResourceCtx,
} from '@p/headless/middleware'
export { definePlugin, type PluginManifest } from './plugin'
// 1-status — 시각 토큰. 다른 컴포넌트의 슬롯으로 들어감.
export * from './ui/5-live/Badge'
export * from './ui/6-structure/Separator'
export * from './ui/5-live/LegendDot'
export * from './ui/5-live/Progress'
export * from './ui/5-live/Spinner'
// 2-action — 단일 탭 액션. 폼 값 ❌
export * from './ui/1-command/Button'
export * from './ui/1-command/ButtonGroup'
export * from './ui/2-input/ToggleButton'
export * from './ui/3-composite/ToggleGroup'
export * from './ui/1-command/ToolbarButton'
export * from './ui/2-input/Switch'
// 3-input — 폼 값을 갖는 단일 입력
export * from './ui/8-field/Field'
export * from './ui/2-input/Input'
export * from './ui/2-input/SearchBox'
export * from './ui/2-input/Textarea'
export * from './ui/2-input/NumberInput'
export * from './ui/2-input/Slider'
export * from './ui/2-input/ColorInput'
export * from './ui/2-input/Checkbox'
export * from './ui/2-input/Radio'
export * from './ui/2-input/Select'
export * from './ui/2-input/Combobox'
// 4-selection — roving 단일 진입 키보드 묶음
export * from './ui/3-composite/Listbox'
export * from './ui/2-input/Option'
export * from './ui/3-composite/ListboxGroup'
export * from './ui/3-composite/Menu'
export * from './ui/1-command/MenuItem'
export * from './ui/3-composite/MenuGroup'
export * from './ui/3-composite/Tree'
export * from './ui/3-composite/Columns'
export * from './ui/3-composite/RadioGroup'
export * from './ui/3-composite/CheckboxGroup'
export * from './ui/3-composite/Toolbar'
export * from './ui/3-composite/Tabs'
export * from './ui/3-composite/SegmentedControl'
export * from './ui/3-composite/Menubar'
export * from './ui/3-composite/MenuList'
// 5-display — 격자·계층 합성 roving
export * from './ui/3-composite/OrderableList'
export * from './ui/3-composite/DataGrid'
export * from './ui/3-composite/DataGridRow'
export * from './ui/3-composite/HeaderGroup'
export * from './ui/3-composite/RowGroup'
export * from './ui/3-composite/GridCell'
export * from './ui/3-composite/ColumnHeader'
export * from './ui/3-composite/RowHeader'
export * from './ui/3-composite/TreeGrid'
export * from './ui/3-composite/TreeRow'
export * from './ui/7-landmark/Pagination'
export * from './ui/8-field/Stepper'
// 6-overlay — surface
export * from './ui/4-window/Dialog'
export * from './ui/4-window/Sheet'
export * from './ui/4-window/Popover'
export * from './ui/4-window/FloatingNav'
export * from './ui/6-structure/Disclosure'
export * from './ui/6-structure/Accordion'
export * from './ui/5-live/Toast'
export * from './ui/4-window/Tooltip'
export * from './ui/4-window/MenuPopover'
// patterns — 도메인 중립 (BarChart·Feed·MessageBubble·StatCard 등)
export * from './ui/patterns/StatCard'
export * from './ui/patterns/Feed'
export * from './ui/patterns/FeedArticle'
export * from './ui/patterns/MessageBubble'
export * from './ui/patterns/BarChart'
export * from './ui/patterns/Top10List'
// content — 비즈니스 콘텐츠 (도메인 객체 props)
export * from './features/CourseCard'
export * from './features/RoleCard'
export * from './features/PostCard'
export * from './features/FeedPost'
export * from './features/ProductCard'
export * from './features/ContractCard'
// 8-layout — 시각 골격
export * from './ui/9-layout/Row'
export * from './ui/9-layout/Column'
export * from './ui/9-layout/Grid'
export * from './ui/9-layout/Carousel'
export { Renderer } from './ui/Renderer'
export {
  definePage, defineWidget, defineLayout, merge,
  placementAttrs, validatePage, validateFragment, node,
  type AnyNode, type NodeType,
  type RowNode as LayoutRowNode, type ColumnNode as LayoutColumnNode,
  type GridNode as LayoutGridNode, type AsideNode, type SectionNode,
  type HeaderNode, type FooterNode, type UiNode, type TextNode,
  type LayoutFlow, type Emphasis, type GridCols, type TextVariant, type Align,
  type ItemPlacement, type CommonNodeData, type TypedEntity,
} from '@p/headless/layout'
export {
  uiRegistry, resolveUi,
  type UiComponentName, type UiEntry, type Zone,
} from './registry'
// L4 templates — page-level 시각 골격 (defineLayout fragment)
export * from './ui/templates'
// L5 surfaces — single-instance shell (sidebar variants · command palette)
export * from './shells/sidebar'
// parts — content 부품 어휘 (Avatar, Chip, Thumbnail, ...).
export * from './ui/6-structure/Avatar'
export * from './ui/6-structure/AvatarGroup'
export * from './ui/6-structure/MediaObject'
export * from './ui/6-structure/Chip'
export * from './ui/6-structure/Thumbnail'
export * from './ui/6-structure/Timestamp'
export * from './ui/6-structure/Skeleton'
export * from './ui/6-structure/EmptyState'
export * from './ui/6-structure/Callout'
export * from './ui/6-structure/KeyValue'
export * from './ui/6-structure/CountBadge'
export * from './ui/6-structure/Heading'
export * from './ui/6-structure/Link'
export * from './ui/6-structure/Code'
export * from './ui/7-landmark/Breadcrumb'
export * from './ui/6-structure/Card'
export * from './ui/6-structure/Table'
export * from './devices/Phone'
