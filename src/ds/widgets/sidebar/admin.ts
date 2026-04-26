/**
 * sidebarAdmin — 관리도구 셸용 사이드바.
 *
 * <nav aria-roledescription="sidebar" aria-label> 단독.
 * 내부는 Tree 1개. brand·footer는 tree entity로 흡수 가능하지만 이 변형은
 * 단순화를 위해 Tree만 둔다. (brand/footer가 필요하면 brainwave 변형 사용)
 */
import { defineWidget } from '../../layout/defineWidget'
import type { SidebarProps } from './types'

export const sidebarAdmin = defineWidget<SidebarProps>(({ id, label, tree, onEvent, width = 240 }) => ({
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
        props: { data: tree, onEvent, 'aria-label': label },
      },
    },
  },
  relationships: {
    [id]: [`${id}.tree`],
  },
}))
