/**
 * sidebarBrainwave — 위 brand, 가운데 Tree, 아래 footer slot 형태.
 * brand/footer 슬롯은 사용처가 widget 인스턴스를 합성으로 채운다.
 */
import { defineWidget } from '../../layout/defineWidget'
import type { SidebarProps } from './types'

export interface SidebarBrainwaveProps extends SidebarProps {
  /** brand 텍스트 (없으면 brand 영역 생략). */
  brand?: string
  /** footer slot id — page에서 같은 id로 widget을 merge. */
  footerSlotId?: string
}

export const sidebarBrainwave = defineWidget<SidebarBrainwaveProps>(({
  id, label, tree, onEvent, width = 240, brand, footerSlotId,
}) => {
  const navId = id
  const headerId = `${id}.header`
  const treeId = `${id}.tree`
  const footerId = footerSlotId ?? `${id}.footer`

  const entities: Record<string, { id: string; data: Record<string, unknown> }> = {
    [navId]: {
      id: navId,
      data: { type: 'Nav', roledescription: 'sidebar', label, width, flow: 'list' },
    },
    [treeId]: {
      id: treeId,
      data: {
        type: 'Ui', component: 'Tree',
        props: { data: tree, onEvent, 'aria-label': label }, grow: true,
      },
    },
  }

  const kids: string[] = []
  if (brand) {
    entities[headerId] = {
      id: headerId,
      data: { type: 'Header', flow: 'cluster' },
    }
    entities[`${headerId}.brand`] = {
      id: `${headerId}.brand`,
      data: { type: 'Text', variant: 'strong', content: brand },
    }
    kids.push(headerId)
  }
  kids.push(treeId)
  // footer slot — placeholder. page가 같은 id로 widget을 merge하면 치환됨.
  if (footerSlotId === undefined) {
    // 기본: 빈 footer placeholder를 생성하지 않는다(merge 대상이 없으면 생략).
  } else {
    kids.push(footerId)
  }

  return {
    entities,
    relationships: {
      [navId]: kids,
      ...(brand ? { [headerId]: [`${headerId}.brand`] } : {}),
    },
  }
})
