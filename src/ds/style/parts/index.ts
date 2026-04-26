import { avatar } from './avatar'
import { badge } from './badge'
import { tag } from './tag'
import { thumbnail } from './thumbnail'
import { timestamp } from './timestamp'
import { skeleton } from './skeleton'
import { emptyState } from './emptyState'
import { callout } from './callout'
import { keyValue } from './keyValue'
import { card } from './card'
import { table } from './table'
import { heading } from './heading'
import { link } from './link'
import { code } from './code'
import { progress } from './progress'
import { breadcrumb } from './breadcrumb'
import { phone } from './phone'

export const parts = () =>
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
    phone(),
  ].join('\n')
