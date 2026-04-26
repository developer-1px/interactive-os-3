import { reset } from './style/seed/reset'
import { shell } from './style/shell'
import { states } from './style/states'
import { seeds } from './style/seed/tokens'
import { breakpointsCss } from './style/seed/breakpoints'
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
import { iconVars, iconIndicator } from './foundations/iconography/icon'
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
  ['shell', wrap('shell', shell())],
] as const

export const wrapAppsLayer = (cssStrings: readonly string[]) =>
  `@layer apps {\n${cssStrings.join('\n')}\n}\n`

export const dsCss = layerDecl + segments.map(([, css]) => css).join('\n')

// 부팅 시 selector 중복 차단 — cascade race 는 영구 부채. 새 중복은 throw.
assertUniqueSelectors(segments)

export * from './core/types'
export * from './data'
export { reduce } from './core/state/reduce'
export { fromTree, fromList, pathAncestors } from './core/state/fromTree'
export { useControlState } from './core/hooks/useControlState'
export { useEventBridge } from './core/hooks/useEventBridge'
export { defineFlow, useFlow, type FlowDef } from './core/flow'
export {
  defineFeature, useFeature,
  type FeatureSpec, type CommandBase,
  type Effect, type QuerySpec, type QueryResult,
  invalidateQuery,
} from './core/feature'
export { useRoving } from './core/hooks/useRoving'
export { useRovingDOM } from './core/hooks/useRovingDOM'
export { parentOf } from './core/axes'
export {
  navigateOnActivate,
  activateOnNavigate,
  expandBranchOnActivate,
  composeGestures,
  type GestureHelper,
} from './core/gesture'
// 1-indicator — 시각 토큰. 다른 컴포넌트의 슬롯으로 들어감.
export * from './ui/1-indicator/Badge'
export * from './ui/1-indicator/Separator'
export * from './ui/1-indicator/LegendDot'
// 2-action — 단일 탭 액션. 폼 값 ❌
export * from './ui/2-action/Button'
export * from './ui/2-action/ToolbarButton'
export * from './ui/2-action/Switch'
export * from './ui/2-action/Progress'
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
// 4-collection — roving 단일 진입 키보드 묶음
export * from './ui/4-collection/Listbox'
export * from './ui/4-collection/Option'
export * from './ui/4-collection/ListboxGroup'
export * from './ui/4-collection/Menu'
export * from './ui/4-collection/MenuItems'
export * from './ui/4-collection/MenuGroup'
export * from './ui/4-collection/Tree'
export * from './ui/4-collection/Columns'
export * from './ui/4-collection/RadioGroup'
export * from './ui/4-collection/CheckboxGroup'
export * from './ui/4-collection/Toolbar'
export * from './ui/4-collection/Tabs'
// 5-composite — 격자·계층 합성 roving
export * from './ui/5-composite/OrderableList'
export * from './ui/5-composite/Menubar'
export * from './ui/5-composite/MenuList'
export * from './ui/5-composite/DataGrid'
export * from './ui/5-composite/DataGridRow'
export * from './ui/5-composite/RowGroup'
export * from './ui/5-composite/GridCell'
export * from './ui/5-composite/ColumnHeader'
export * from './ui/5-composite/RowHeader'
export * from './ui/5-composite/TreeGrid'
export * from './ui/5-composite/TreeRow'
// 6-overlay — surface
export * from './ui/6-overlay/Dialog'
export * from './ui/6-overlay/Sheet'
export * from './ui/6-overlay/Popover'
export * from './ui/6-overlay/FloatingNav'
export * from './ui/6-overlay/Disclosure'
export * from './ui/6-overlay/Tooltip'
export * from './ui/6-overlay/MenuPopover'
// 7-pattern — 도메인 콘텐츠 / 데이터 시각화
export * from './ui/7-pattern/StatCard'
export * from './ui/7-pattern/CourseCard'
export * from './ui/7-pattern/RoleCard'
export * from './ui/7-pattern/Feed'
export * from './ui/7-pattern/FeedArticle'
export * from './ui/7-pattern/MessageBubble'
export * from './ui/7-pattern/PostCard'
export * from './ui/7-pattern/FeedPost'
export * from './ui/7-pattern/ProductCard'
export * from './ui/7-pattern/ContractCard'
export * from './ui/7-pattern/BarChart'
export * from './ui/7-pattern/Top10List'
// 8-layout — 시각 골격
export * from './ui/8-layout/Row'
export * from './ui/8-layout/Column'
export * from './ui/8-layout/Grid'
export * from './ui/8-layout/Carousel'
export {
  Renderer, definePage, defineWidget, defineLayout, merge,
  uiRegistry, resolveUi, placementAttrs, validatePage, validateFragment, node,
  type UiComponentName, type AnyNode, type NodeType,
  type RowNode as LayoutRowNode, type ColumnNode as LayoutColumnNode,
  type GridNode as LayoutGridNode, type AsideNode, type SectionNode,
  type HeaderNode, type FooterNode, type UiNode, type TextNode,
  type Flow, type Emphasis, type GridCols, type TextVariant, type Align,
  type ItemPlacement, type CommonNodeData, type TypedEntity,
} from './layout'
// layout/recipes — APG 외 page-level 시각 골격 (defineLayout fragment) + sidebar variants
export * from './layout/recipes'
// parts — content 부품 어휘 (Avatar, Tag, Thumbnail, ...). Badge/BadgeTone은 ui/1-indicator/Badge와 이름 충돌하므로 alias.
export * from './parts/Avatar'
export * from './parts/Tag'
export * from './parts/Thumbnail'
export * from './parts/Timestamp'
export * from './parts/Skeleton'
export * from './parts/EmptyState'
export * from './parts/Callout'
export * from './parts/KeyValue'
export { Badge as CountBadge, type BadgeTone as CountBadgeTone } from './parts/Badge'
export * from './parts/Heading'
export * from './parts/Link'
export * from './parts/Code'
export { Progress as ProgressBar } from './parts/Progress'
export * from './parts/Breadcrumb'
export * from './parts/Card'
export * from './parts/Table'
