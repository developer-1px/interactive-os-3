/**
 * pageHeader — 페이지 상단 Header 골격. 좌측에 breadcrumb·title, 우측에 actions.
 *
 *   header (Header, split)
 *     ├── left (Row, cluster)
 *     │     ├── breadcrumbSlot?
 *     │     └── titleSlot
 *     └── right (Row, cluster) → actionsSlot?
 *
 * Header 는 page-level 구조 landmark — layout fragment 로 허용.
 * 좌·우 row 는 'cluster' flow 로 자연 wrap + gap.
 */
import { defineLayout } from '../layout/defineLayout'
import type { NormalizedData } from '../core/types'

export interface PageHeaderProps {
  /** Header 의 root id. 라우트가 외부에서 참조한다. */
  id: string
  /** 좌측 title 영역 id (Row.cluster 의 자식). */
  titleSlot: string
  /** 좌측 breadcrumb 영역 id. titleSlot 앞에 위치. */
  breadcrumbSlot?: string
  /** 우측 actions 영역 id (Row.cluster 의 자식). */
  actionsSlot?: string
  /** Header 의 시각 디버깅용 roledescription. */
  roledescription?: string
}

export const pageHeader = defineLayout<PageHeaderProps>(
  ({ id, titleSlot, breadcrumbSlot, actionsSlot, roledescription }) => {
    const leftId = `${id}.left`
    const rightId = `${id}.right`
    const leftChildren = breadcrumbSlot ? [breadcrumbSlot, titleSlot] : [titleSlot]
    const headerChildren = actionsSlot ? [leftId, rightId] : [leftId]
    return {
      entities: {
        [id]: {
          id,
          data: { type: 'Header', flow: 'split', roledescription },
        },
        [leftId]: {
          id: leftId,
          data: { type: 'Row', flow: 'cluster' },
        },
        ...(actionsSlot
          ? { [rightId]: { id: rightId, data: { type: 'Row', flow: 'cluster' } } }
          : {}),
      },
      relationships: {
        [id]: headerChildren,
        [leftId]: leftChildren,
        ...(actionsSlot ? { [rightId]: [actionsSlot] } : {}),
      },
    } satisfies NormalizedData
  },
)
