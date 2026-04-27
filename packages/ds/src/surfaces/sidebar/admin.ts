/**
 * sidebarAdmin — canonical sidebar widget. nav landmark + Tree.
 *
 * 옵션:
 *   - brand: brand text를 nav 위 <header>에 노출 (없으면 header 생략)
 *   - footerSlotId: footer slot id. page가 같은 id로 widget을 merge하면 footer로 치환됨
 *   - rail: 56px 폭 + Tree에 data-state="rail" 부여 (CSS가 라벨 숨김 처리)
 *   - width: 명시 시 rail 무시. 기본 240 (rail 모드면 56)
 */
import { defineWidget } from '../../headless/layout/defineWidget'
import type { SidebarProps } from './types'

export interface SidebarAdminProps extends SidebarProps {
  /** brand 텍스트 (없으면 brand header 생략). */
  brand?: string
  /** footer slot id — page가 같은 id로 widget을 merge하면 치환. */
  footerSlotId?: string
  /** rail 모드 (56px + 라벨 숨김). width 미지정 시에만 적용. */
  rail?: boolean
}

export const sidebarAdmin = defineWidget<SidebarAdminProps>(({
  id, label, tree, onEvent, width, brand, footerSlotId, rail = false,
}) => {
  const navWidth = width ?? (rail ? 56 : 240)
  const navId = id
  const headerId = `${id}.header`
  const treeId = `${id}.tree`

  const treeProps: Record<string, unknown> = { data: tree, onEvent, 'aria-label': label }
  if (rail) treeProps['data-state'] = 'rail'

  const entities: Record<string, { id: string; data: Record<string, unknown> }> = {
    [navId]: {
      id: navId,
      data: { type: 'Nav', roledescription: 'sidebar', label, width: navWidth, ...(brand || footerSlotId ? { flow: 'list' } : {}) },
    },
    [treeId]: {
      id: treeId,
      data: { type: 'Ui', component: 'Tree', props: treeProps, ...(brand || footerSlotId ? { grow: true } : {}) },
    },
  }

  const kids: string[] = []
  if (brand) {
    entities[headerId] = { id: headerId, data: { type: 'Header', flow: 'cluster' } }
    entities[`${headerId}.brand`] = { id: `${headerId}.brand`, data: { type: 'Text', variant: 'strong', content: brand } }
    kids.push(headerId)
  }
  kids.push(treeId)
  if (footerSlotId !== undefined) kids.push(footerSlotId)

  return {
    entities,
    relationships: {
      [navId]: kids,
      ...(brand ? { [headerId]: [`${headerId}.brand`] } : {}),
    },
  }
})
