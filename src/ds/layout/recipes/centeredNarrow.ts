/**
 * centeredNarrow — 폭 상한 + 자동 가운데 정렬 Section.
 *
 *   wrap (Section, grow, place:'center', maxWidth) → contentSlot → ...
 *
 * 단독 사용 또는 다른 레이아웃의 mainSlot 안쪽에 합성. 콘텐츠가 넘치면 safe-center
 * 덕분에 자연 스크롤 (layout.ts:158).
 */
import { ROOT } from '../../core/types'
import { defineLayout } from '../defineLayout'
import type { NormalizedData } from '../../core/types'

export interface CenteredNarrowProps {
  /** 콘텐츠 Section 의 id. 라우트가 children 을 merge 로 채운다. */
  contentSlot: string
  /** Section 가로 상한. 기본 '72rem'. */
  maxWidth?: number | string
  /** Section 의 시각 디버깅용 roledescription. */
  roledescription?: string
}

export const centeredNarrow = defineLayout<CenteredNarrowProps>(
  ({ contentSlot, maxWidth = '72rem', roledescription }) => ({
    entities: {
      [ROOT]: { id: ROOT, data: {} },
      [contentSlot]: {
        id: contentSlot,
        data: {
          type: 'Section',
          flow: 'list',
          grow: true,
          place: 'center',
          maxWidth,
          roledescription,
        },
      },
    },
    relationships: {
      [ROOT]: [contentSlot],
      [contentSlot]: [],
    } satisfies NormalizedData['relationships'],
  }),
)
