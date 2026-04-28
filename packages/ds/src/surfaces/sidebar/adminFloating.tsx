/**
 * SidebarAdminFloating — mobile surface of `sidebar/admin` intent.
 *
 * 같은 intent(`sidebar/admin`), 다른 surface. desktop은 sidebarAdmin (Nav landmark
 * + Tree, Renderer로 합성). mobile은 좌하단 floating button + native popover로 동일
 * collection을 full-height overlay surface에 띄운다. data contract 공유 — 페이지-로컬
 * sidebar 어떤 것도 동일 인터페이스로 mobile surface 획득.
 *
 * widget이 아니라 React 컴포넌트인 이유: floating은 layout flow 밖 (top-layer/fixed).
 * page entity tree에 합치면 부모 Row/Column flow를 오염시킨다.
 *
 * 책임 경계:
 *   - 트리거 = button[popovertarget]. 토글은 native popover API 소유.
 *   - 오버레이 = nav[popover][data-part="sidebar"][data-state="floating"]
 *     — 기존 sidebar surface CSS 그대로 재사용, 폭/위치만 override.
 *   - viewport 분기는 CSS만 (feedback_mobile_js_boundary).
 *
 * collection 종류는 prop으로 분기 (Tree | Listbox). default Tree.
 */
import { Tree } from '../../ui/3-composite/Tree'
import { Listbox } from '../../ui/3-composite/Listbox'
import type { SidebarProps } from './types'

export interface SidebarAdminFloatingProps extends SidebarProps {
  brand?: string
  /** collection 종류. tree(default) | listbox. desktop sidebarAdmin은 항상 Tree. */
  collection?: 'tree' | 'listbox'
}

export function SidebarAdminFloating({
  id, label, tree, onEvent, brand, collection = 'tree',
}: SidebarAdminFloatingProps) {
  const popId = `${id}.pop`
  const Collection = collection === 'listbox' ? Listbox : Tree
  return (
    <>
      <button
        type="button"
        popoverTarget={popId}
        aria-label={label}
        data-icon="list"
        data-ds-floating-nav-trigger
      />
      <nav
        id={popId}
        popover="auto"
        aria-label={label}
        data-part="sidebar"
        data-state="floating"
      >
        <header>
          <button
            type="button"
            popoverTarget={popId}
            popoverTargetAction="hide"
            aria-label="뒤로"
            data-icon="chevron-left"
            data-ds-floating-nav-back
          />
          {brand && <strong>{brand}</strong>}
        </header>
        <Collection data={tree} onEvent={onEvent} aria-label={label} />
      </nav>
    </>
  )
}
