/**
 * heroSection — 미디어 + 카피 + CTA 의 split Section. 랜딩·intro 패턴.
 *
 *   hero (Section, split, callout)
 *     ├── mediaSlot
 *     └── copy (Column, list)
 *           ├── copySlot
 *           └── ctas (Row, cluster) → ctaSlot?
 *
 * mediaSlot 은 좌·우 어느 쪽이든 호출자가 결정 — split flow 의 자연 배치 위에서
 * 라우트가 상하 순서만 책임진다.
 */
import { defineLayout } from '../defineLayout'
import type { NormalizedData } from '../../core/types'

export interface HeroSectionProps {
  /** Section 의 root id. */
  id: string
  /** 미디어(이미지·일러스트·video) 영역 id. */
  mediaSlot: string
  /** 카피(타이틀·서브타이틀·설명) 영역 id. */
  copySlot: string
  /** CTA 버튼 그룹 영역 id. 없으면 ctas Row 자체를 생성하지 않는다. */
  ctaSlot?: string
  /** Section 의 시각 디버깅용 roledescription. */
  roledescription?: string
}

export const heroSection = defineLayout<HeroSectionProps>(
  ({ id, mediaSlot, copySlot, ctaSlot, roledescription }) => {
    const copyId = `${id}.copy`
    const ctasId = `${id}.ctas`
    const copyChildren = ctaSlot ? [copySlot, ctasId] : [copySlot]
    return {
      entities: {
        [id]: {
          id,
          data: { type: 'Section', flow: 'split', emphasis: 'callout', roledescription },
        },
        [copyId]: {
          id: copyId,
          data: { type: 'Column', flow: 'list', grow: true },
        },
        ...(ctaSlot
          ? { [ctasId]: { id: ctasId, data: { type: 'Row', flow: 'cluster' } } }
          : {}),
      },
      relationships: {
        [id]: [mediaSlot, copyId],
        [copyId]: copyChildren,
        ...(ctaSlot ? { [ctasId]: [ctaSlot] } : {}),
      },
    } satisfies NormalizedData
  },
)
