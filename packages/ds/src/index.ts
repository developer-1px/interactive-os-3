import { reset } from './tokens/style/seed/reset'
import { shell } from './tokens/style/shell'
import { states } from './tokens/style/states'
import { seeds } from './tokens/style/seed/tokens'
import { breakpointsCss } from './tokens/style/seed/breakpoints'
import { widgets } from './style/widgets'
import { parts } from './style/parts'
import { proseCss } from './style/widgets/pattern/prose'
import { contractCard } from './style/widgets/pattern/contractCard'
import { postCard } from './style/widgets/pattern/postCard'
import { messageBubble } from './style/widgets/pattern/messageBubble'
import { statCard } from './style/widgets/pattern/statCard'
import { productCard } from './style/widgets/pattern/productCard'
import { courseCard } from './style/widgets/pattern/courseCard'
import { roleCard } from './style/widgets/pattern/roleCard'
import { feedPost } from './style/widgets/pattern/feedPost'
import { inboxRow } from './style/widgets/pattern/inboxRow'
import { authCard } from './style/widgets/pattern/authCard'
import { iconVars, iconIndicator } from './tokens/foundations/iconography/icon'
import { assertUniqueSelectors } from './style/assertUnique'

/**
 * CSS Cascade Layers — 우선순위 함정 구조적 해법.
 *
 * 후순위 layer 가 specificity 무관하게 무조건 이긴다. LLM/개발자가 selector
 * specificity 카운트 없이 "어느 layer 에 속하는지"만 보고 판단 가능.
 *
 * 순서 (좌→우, 우측이 강함):
 *   reset    — :where() 0-spec HTML 기본
 *   states   — focus/hover/disabled mixin
 *   widgets  — control·collection·composite·pattern widget
 *   parts    — content 부품 (Card, Tag, Avatar...)
 *   content  — prose article (markdown 출력) — widgets 보다 강해야 form 등 leak 차단
 *   shell    — chrome·sidebar shell 골격
 *   apps     — 앱별 라우트 override (각 routes/<app>/style.ts 가 owner. main.tsx가 합친다)
 *
 * tokens(:root)·breakpoints·iconVars 는 unlayered — 토큰은 layer 비교 대상 아님.
 */
export const APPS_LAYER_DECL = '@layer reset, states, widgets, parts, content, shell, apps;\n'
const layerDecl = APPS_LAYER_DECL

const wrap = (name: string, css: string) => `@layer ${name} {\n${css}\n}\n`

const segments: ReadonlyArray<readonly [string, string]> = [
  ['seed/tokens', seeds],
  ['seed/breakpoints', breakpointsCss],
  ['fn/iconVars', iconVars()],
  ['seed/reset', wrap('reset', reset)],
  ['states', wrap('states', states())],
  ['fn/iconIndicator', wrap('states', iconIndicator())],
  ['widgets', wrap('widgets', widgets())],
  ['parts', wrap('parts', parts())],
  ['content/prose', wrap('content', proseCss())],
  /* Card 변형 slot CSS 는 parts/Card primitive 를 override 해야 하므로 content layer
     (parts 보다 후순위). 모든 data-card="*" 패턴이 여기. (이전엔 contractCard 만
     content 였고 나머지는 widgets 에 있어 parts 에 깔림 — 이번 PR 에서 일괄 수렴) */
  ['content/contractCard',  wrap('content', contractCard())],
  ['content/postCard',      wrap('content', postCard())],
  ['content/messageBubble', wrap('content', messageBubble())],
  ['content/statCard',      wrap('content', statCard())],
  ['content/productCard',   wrap('content', productCard())],
  ['content/courseCard',    wrap('content', courseCard())],
  ['content/roleCard',      wrap('content', roleCard())],
  ['content/feedPost',      wrap('content', feedPost())],
  ['content/inboxRow',      wrap('content', inboxRow())],
  ['content/authCard',      wrap('content', authCard())],
  ['shell', wrap('shell', shell())],
] as const

export const wrapAppsLayer = (cssStrings: readonly string[]) =>
  `@layer apps {\n${cssStrings.join('\n')}\n}\n`

export const dsCss = layerDecl + segments.map(([, css]) => css).join('\n')

// 부팅 시 selector 중복 차단 — cascade race 는 영구 부채. 새 중복은 throw.
assertUniqueSelectors(segments)

export * from './headless/types'
export * from './data'
export { reduce } from './headless/state/reduce'
export { fromTree, fromList, pathAncestors } from './headless/state/fromTree'
export { useControlState } from './headless/hooks/useControlState'
export { useEventBridge } from './headless/hooks/useEventBridge'
export { defineFlow, useFlow, type FlowDef } from './headless/flow'
export {
  defineFeature, useFeature,
  type FeatureSpec, type CommandBase,
  type Effect, type QuerySpec, type QueryResult,
  invalidateQuery,
} from './headless/feature'
export { useRoving } from './headless/hooks/useRoving'
export { useRovingDOM } from './headless/hooks/useRovingDOM'
export { parentOf } from './headless/axes'
export {
  navigateOnActivate,
  activateOnNavigate,
  expandBranchOnActivate,
  composeGestures,
  activateProps,
  type GestureHelper,
} from './headless/gesture'
export {
  defineMiddleware,
  type Middleware, type Phase,
  type PreDispatchCtx, type PostDispatchCtx, type ResourceCtx,
} from './headless/middleware'
export { definePlugin, type PluginManifest } from './plugin'
// 1-status — 시각 토큰. 다른 컴포넌트의 슬롯으로 들어감.
export * from './ui/1-status/Badge'
export * from './ui/0-primitives/Separator'
export * from './ui/1-status/LegendDot'
export * from './ui/1-status/Progress'
// 2-action — 단일 탭 액션. 폼 값 ❌
export * from './ui/2-action/Button'
export * from './ui/2-action/ToolbarButton'
export * from './ui/2-action/Switch'
// 3-input — 폼 값을 갖는 단일 입력
export * from './ui/3-input/Field'
export * from './ui/3-input/Input'
export * from './ui/3-input/SearchBox'
export * from './ui/3-input/Textarea'
export * from './ui/3-input/NumberInput'
export * from './ui/3-input/Slider'
export * from './ui/3-input/ColorInput'
export * from './ui/3-input/Checkbox'
export * from './ui/3-input/Radio'
export * from './ui/3-input/Select'
export * from './ui/3-input/Combobox'
// 4-selection — roving 단일 진입 키보드 묶음
export * from './ui/4-selection/Listbox'
export * from './ui/4-selection/Option'
export * from './ui/4-selection/ListboxGroup'
export * from './ui/4-selection/Menu'
export * from './ui/4-selection/MenuItems'
export * from './ui/4-selection/MenuGroup'
export * from './ui/4-selection/Tree'
export * from './ui/4-selection/Columns'
export * from './ui/4-selection/RadioGroup'
export * from './ui/4-selection/CheckboxGroup'
export * from './ui/4-selection/Toolbar'
export * from './ui/4-selection/Tabs'
export * from './ui/4-selection/Menubar'
export * from './ui/4-selection/MenuList'
// 5-display — 격자·계층 합성 roving
export * from './ui/5-display/OrderableList'
export * from './ui/5-display/DataGrid'
export * from './ui/5-display/DataGridRow'
export * from './ui/5-display/RowGroup'
export * from './ui/5-display/GridCell'
export * from './ui/5-display/ColumnHeader'
export * from './ui/5-display/RowHeader'
export * from './ui/5-display/TreeGrid'
export * from './ui/5-display/TreeRow'
// 6-overlay — surface
export * from './ui/6-overlay/Dialog'
export * from './ui/6-overlay/Sheet'
export * from './ui/6-overlay/Popover'
export * from './ui/6-overlay/FloatingNav'
export * from './ui/6-overlay/Disclosure'
export * from './ui/6-overlay/Tooltip'
export * from './ui/6-overlay/MenuPopover'
// patterns — 도메인 중립 (BarChart·Feed·MessageBubble·StatCard 등)
export * from './ui/patterns/StatCard'
export * from './ui/patterns/Feed'
export * from './ui/patterns/FeedArticle'
export * from './ui/patterns/MessageBubble'
export * from './ui/patterns/BarChart'
export * from './ui/patterns/Top10List'
// content — 비즈니스 콘텐츠 (도메인 객체 props)
export * from './content/CourseCard'
export * from './content/RoleCard'
export * from './content/PostCard'
export * from './content/FeedPost'
export * from './content/ProductCard'
export * from './content/ContractCard'
// 8-layout — 시각 골격
export * from './ui/8-layout/Row'
export * from './ui/8-layout/Column'
export * from './ui/8-layout/Grid'
export * from './ui/8-layout/Carousel'
export { Renderer } from './ui/Renderer'
export {
  definePage, defineWidget, defineLayout, merge,
  placementAttrs, validatePage, validateFragment, node,
  type AnyNode, type NodeType,
  type RowNode as LayoutRowNode, type ColumnNode as LayoutColumnNode,
  type GridNode as LayoutGridNode, type AsideNode, type SectionNode,
  type HeaderNode, type FooterNode, type UiNode, type TextNode,
  type Flow, type Emphasis, type GridCols, type TextVariant, type Align,
  type ItemPlacement, type CommonNodeData, type TypedEntity,
} from './headless/layout'
export {
  uiRegistry, resolveUi,
  type UiComponentName, type UiEntry, type Zone,
} from './registry'
// layout/recipes — APG 외 page-level 시각 골격 (defineLayout fragment) + sidebar variants
export * from './ui/recipes'
// parts — content 부품 어휘 (Avatar, Tag, Thumbnail, ...). Badge/BadgeTone은 ui/1-status/Badge와 이름 충돌하므로 alias.
export * from './ui/parts/Avatar'
export * from './ui/parts/Tag'
export * from './ui/parts/Thumbnail'
export * from './ui/parts/Timestamp'
export * from './ui/parts/Skeleton'
export * from './ui/parts/EmptyState'
export * from './ui/parts/Callout'
export * from './ui/parts/KeyValue'
export { Badge as CountBadge, type BadgeTone as CountBadgeTone } from './ui/parts/Badge'
export * from './ui/parts/Heading'
export * from './ui/parts/Link'
export * from './ui/parts/Code'
export { Progress as ProgressBar } from './ui/parts/Progress'
export * from './ui/parts/Breadcrumb'
export * from './ui/parts/Card'
export * from './ui/parts/Table'
export * from './devices/Phone'
