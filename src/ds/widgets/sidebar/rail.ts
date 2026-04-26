/**
 * sidebarRail — 56px 폭 레일. 시각만 다르고 ARIA/DOM은 admin과 동일.
 * 라벨 숨김은 CSS가 nav[data-state="rail"] 기준으로 처리.
 */
import { defineWidget } from '../../layout/defineWidget'
import type { SidebarProps } from './types'

export const sidebarRail = defineWidget<SidebarProps>(({ id, label, tree, onEvent, width = 56 }) => ({
  entities: {
    [id]: {
      id,
      data: {
        type: 'Nav',
        roledescription: 'sidebar',
        label,
        width,
      },
    },
    [`${id}.tree`]: {
      id: `${id}.tree`,
      data: {
        type: 'Ui',
        component: 'Tree',
        props: { data: tree, onEvent, 'aria-label': label, 'data-state': 'rail' },
      },
    },
  },
  relationships: {
    [id]: [`${id}.tree`],
  },
}))
