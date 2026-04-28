// ui/parts CSS aggregator — sibling co-location, no barrel.
// 모든 export 는 css 로 시작 (naming-audit 합의).
import { cssAvatar } from './Avatar.style'
import { cssAvatarGroup } from './AvatarGroup.style'
import { cssMedia } from './MediaObject.style'
import { cssCountBadge } from './CountBadge.style'
import { cssChip } from './Chip.style'
import { cssThumbnail } from './Thumbnail.style'
import { cssTimestamp } from './Timestamp.style'
import { cssSkeleton } from './Skeleton.style'
import { cssEmptyState } from './EmptyState.style'
import { cssCallout } from './Callout.style'
import { cssKeyValue } from './KeyValue.style'
import { cssCard } from './Card.style'
import { cssTable } from './Table.style'
import { cssHeading } from './Heading.style'
import { cssLink } from './Link.style'
import { cssCode } from './Code.style'
import { cssProgressBar } from './ProgressBar.style'
import { cssBreadcrumb } from '../7-landmark/Breadcrumb.style'
import { cssRovingItem } from './RovingItem.style'

export const partsStyles = () =>
  [
    cssAvatar(),
    cssAvatarGroup(),
    cssMedia(),
    cssCountBadge(),
    cssChip(),
    cssThumbnail(),
    cssTimestamp(),
    cssSkeleton(),
    cssEmptyState(),
    cssCallout(),
    cssKeyValue(),
    cssCard(),
    cssTable(),
    cssHeading(),
    cssLink(),
    cssCode(),
    cssProgressBar(),
    cssBreadcrumb(),
    cssRovingItem(),
  ].join('\n')
