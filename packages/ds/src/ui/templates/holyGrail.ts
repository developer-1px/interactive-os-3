/**
 * holyGrail — sidebar | main 페이지 셸. 선택적 aside 한 칼럼을 더 받는다.
 *
 *   ROOT → page (Row, list)
 *            ├── navSlot       — 외부 sidebar widget 이 같은 id 로 채움
 *            ├── workspace (Main, grow, place:'center')
 *            │     └── contentSlot (Section, grow, maxWidth)
 *            │           └── ...   — 라우트가 merge 로 자식 채움
 *            └── asideSlot?    — 선택적 외부 widget id
 *
 * 슬롯 id 는 prop 으로 받아 호출자가 외부 네임스페이스 충돌을 제어한다.
 * navSlot/asideSlot 은 외부 widget 의 root id, contentSlot 은 내부 Section 의
 * id 로 라우트가 그 children 을 merge 한다.
 */
import { ROOT } from '@p/headless/types'
import { defineLayout } from '@p/headless/layout/defineLayout'
import type { NormalizedData } from '@p/headless/types'

export interface HolyGrailProps {
  /** Main landmark 의 aria-label. 보통 페이지 헤더 라벨. */
  label: string
  /** 외부 sidebar widget 의 root id. page Row 의 첫 자식으로 참조된다. */
  navSlot: string
  /** 내부 Section 의 id. 라우트가 이 id 의 children 을 merge 로 채운다. */
  contentSlot: string
  /** 선택적 aside widget 의 root id. page Row 의 마지막 자식. */
  asideSlot?: string
  /** content Section 의 가로 상한. 부모가 더 넓으면 자동 가운데 정렬. */
  narrow?: number | string
  /** page Row 의 시각 디버깅용 roledescription. */
  roledescription?: string
}

export const holyGrail = defineLayout<HolyGrailProps>(
  ({ label, navSlot, contentSlot, asideSlot, narrow, roledescription }) => {
    const pageChildren = asideSlot
      ? [navSlot, 'workspace', asideSlot]
      : [navSlot, 'workspace']
    return {
      entities: {
        [ROOT]: { id: ROOT, data: {} },
        page: {
          id: 'page',
          data: { type: 'Row', flow: 'list', roledescription, label },
        },
        workspace: {
          id: 'workspace',
          data: { type: 'Main', flow: 'list', grow: true, place: 'center', label },
        },
        [contentSlot]: {
          id: contentSlot,
          data: { type: 'Section', flow: 'list', grow: true, maxWidth: narrow },
        },
      },
      relationships: {
        [ROOT]: ['page'],
        page: pageChildren,
        workspace: [contentSlot],
        [contentSlot]: [],
      },
    } satisfies NormalizedData
  },
)
