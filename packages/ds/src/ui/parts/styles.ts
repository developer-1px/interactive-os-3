// Phase 2h: ui/parts co-location aggregator.
// 각 part 의 CSS 는 <Name>.style.ts 형제로 동거 (sibling pattern, no barrel).
import { avatar } from './Avatar.style'
import { badge } from './CountBadge.style'
import { tag } from './Tag.style'
import { thumbnail } from './Thumbnail.style'
import { timestamp } from './Timestamp.style'
import { skeleton } from './Skeleton.style'
import { emptyState } from './EmptyState.style'
import { callout } from './Callout.style'
import { keyValue } from './KeyValue.style'
import { card } from './Card.style'
import { table } from './Table.style'
import { heading } from './Heading.style'
import { link } from './Link.style'
import { code } from './Code.style'
import { progress } from './ProgressBar.style'
import { breadcrumb } from './Breadcrumb.style'
import { rovingItem } from './RovingItem.style'

export const partsStyles = () =>
  [
    avatar(),
    badge(),
    tag(),
    thumbnail(),
    timestamp(),
    skeleton(),
    emptyState(),
    callout(),
    keyValue(),
    card(),
    table(),
    heading(),
    link(),
    code(),
    progress(),
    breadcrumb(),
    rovingItem(),
  ].join('\n')
