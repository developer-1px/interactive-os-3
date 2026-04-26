/**
 * masterDetail — list | detail 2-column 레이아웃.
 *
 *   ROOT → md (Row, list)
 *            ├── listSlot   (Section, width:listWidth) → ...    — 라우트가 children 채움
 *            └── detailSlot (Section, grow)            → ...    — 라우트가 children 채움
 *
 * inbox·email·finder 류 패턴. 좌측 list 는 고정 폭, 우측 detail 은 grow.
 */
import { ROOT } from '../../core/types'
import { defineLayout } from '../defineLayout'
import type { NormalizedData } from '../../core/types'

export interface MasterDetailProps {
  /** 좌측 list Section 의 id. 라우트가 children 을 merge 로 채운다. */
  listSlot: string
  /** 우측 detail Section 의 id. */
  detailSlot: string
  /** 좌측 고정 폭. 기본 320px. */
  listWidth?: number | string
  /** Row 의 시각 디버깅용 roledescription. */
  roledescription?: string
}

export const masterDetail = defineLayout<MasterDetailProps>(
  ({ listSlot, detailSlot, listWidth = '320px', roledescription }) => ({
    entities: {
      [ROOT]: { id: ROOT, data: {} },
      md: {
        id: 'md',
        data: { type: 'Row', flow: 'list', roledescription, grow: true },
      },
      [listSlot]: {
        id: listSlot,
        data: { type: 'Section', flow: 'list', width: listWidth },
      },
      [detailSlot]: {
        id: detailSlot,
        data: { type: 'Section', flow: 'list', grow: true },
      },
    },
    relationships: {
      [ROOT]: ['md'],
      md: [listSlot, detailSlot],
      [listSlot]: [],
      [detailSlot]: [],
    } satisfies NormalizedData['relationships'],
  }),
)
