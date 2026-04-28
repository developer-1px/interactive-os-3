/**
 * dsCss · wrapAppsLayer — entry 가 @p/ds 배럴 전체(UI·widget tree)를 끌어오지
 * 않도록 CSS 합성만 분리. main.tsx 는 `@p/ds/css` 로 import 한다.
 */
import { reset } from './tokens/internal/seed/reset'
import { shell } from './tokens/internal/shell'
import { states } from './tokens/internal/states'
import { seeds } from './tokens/internal/seed/tokens'
import { cssContainerQueries } from './tokens/internal/seed/containerQueries'
import { widgets } from './widgets.styles'
import { partsStyles } from './ui/6-structure/styles'
import { cssPhone } from './devices/Phone.style'
import { cssProse } from './ui/6-structure/Prose.style'
import { cssContractCard } from './features/ContractCard.style'
import { cssPostCard } from './features/PostCard.style'
import { cssMessageBubble } from './ui/patterns/MessageBubble.style'
import { cssStatCard } from './ui/patterns/StatCard.style'
import { cssProductCard } from './features/ProductCard.style'
import { cssCourseCard } from './features/CourseCard.style'
import { cssRoleCard } from './features/RoleCard.style'
import { cssFeedPost } from './features/FeedPost.style'
import { cssInboxRow } from './style/widgets/pattern/inboxRow'
import { cssAuthCard } from './style/widgets/pattern/authCard'
import { iconVars, iconIndicator } from './tokens/semantic/iconography/icon'
import { assertUniqueSelectors } from './style/assertUnique'

export const APPS_LAYER_DECL = '@layer reset, states, widgets, parts, content, shell, apps;\n'
const layerDecl = APPS_LAYER_DECL

const wrap = (name: string, css: string) => `@layer ${name} {\n${css}\n}\n`

const segments: ReadonlyArray<readonly [string, string]> = [
  ['seed/tokens', seeds],
  ['seed/containerQueries', cssContainerQueries()],
  ['fn/iconVars', iconVars()],
  ['seed/reset', wrap('reset', reset)],
  ['states', wrap('states', states())],
  ['fn/iconIndicator', wrap('states', iconIndicator())],
  ['widgets', wrap('widgets', widgets())],
  ['parts', wrap('parts', partsStyles())],
  ['parts/phone', wrap('parts', cssPhone())],
  ['content/prose', wrap('content', cssProse())],
  ['content/contractCard',  wrap('content', cssContractCard())],
  ['content/postCard',      wrap('content', cssPostCard())],
  ['content/messageBubble', wrap('content', cssMessageBubble())],
  ['content/statCard',      wrap('content', cssStatCard())],
  ['content/productCard',   wrap('content', cssProductCard())],
  ['content/courseCard',    wrap('content', cssCourseCard())],
  ['content/roleCard',      wrap('content', cssRoleCard())],
  ['content/feedPost',      wrap('content', cssFeedPost())],
  ['content/inboxRow',      wrap('content', cssInboxRow())],
  ['content/authCard',      wrap('content', cssAuthCard())],
  ['shell', wrap('shell', shell())],
] as const

export const wrapAppsLayer = (cssStrings: readonly string[]) =>
  `@layer apps {\n${cssStrings.join('\n')}\n}\n`

export const dsCss = layerDecl + segments.map(([, css]) => css).join('\n')

if (import.meta.env.DEV) {
  assertUniqueSelectors(segments)
}
