/**
 * dsCss · wrapAppsLayer — entry 가 @p/ds 배럴 전체(UI·widget tree)를 끌어오지
 * 않도록 CSS 합성만 분리. main.tsx 는 `@p/ds/css` 로 import 한다.
 */
import { reset } from './tokens/style/seed/reset'
import { shell } from './tokens/style/shell'
import { states } from './tokens/style/states'
import { seeds } from './tokens/style/seed/tokens'
import { breakpointsCss } from './tokens/style/seed/breakpoints'
import { widgets } from './widgets.styles'
import { partsStyles } from './ui/parts/styles'
import { phone } from './devices/Phone.style'
import { proseCss } from './ui/0-primitives/Prose.style'
import { contractCard } from './content/ContractCard.style'
import { postCard } from './content/PostCard.style'
import { messageBubble } from './ui/patterns/MessageBubble.style'
import { statCard } from './ui/patterns/StatCard.style'
import { productCard } from './content/ProductCard.style'
import { courseCard } from './content/CourseCard.style'
import { roleCard } from './content/RoleCard.style'
import { feedPost } from './content/FeedPost.style'
import { inboxRow } from './style/widgets/pattern/inboxRow'
import { authCard } from './style/widgets/pattern/authCard'
import { iconVars, iconIndicator } from './tokens/foundations/iconography/icon'
import { assertUniqueSelectors } from './style/assertUnique'

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
  ['parts', wrap('parts', partsStyles())],
  ['parts/phone', wrap('parts', phone())],
  ['content/prose', wrap('content', proseCss())],
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

if (import.meta.env.DEV) {
  assertUniqueSelectors(segments)
}
