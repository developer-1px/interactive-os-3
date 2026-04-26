/**
 * sidebarAdminFloating — mobile surface of `sidebar/admin` intent.
 *
 * 같은 intent(`sidebar/admin`), 다른 surface. desktop은 sidebarAdmin (Nav landmark
 * + Tree, Renderer로 합성). mobile은 좌하단 floating button + native popover로 동일
 * Tree를 full-height overlay surface에 띄운다. data contract(SidebarProps)는 공유.
 *
 * widget이 아니라 React 컴포넌트인 이유: floating은 layout flow 밖 (top-layer/fixed).
 * page entity tree에 합치면 부모 Row/Column flow를 오염시킨다.
 *
 * 책임 경계:
 *   - 트리거 = button[popovertarget]. 토글은 native popover API 소유.
 *   - 오버레이 = nav[popover][aria-roledescription="sidebar"] — 기존 sidebar surface
 *     CSS 그대로 재사용 (data-state="floating"으로 폭/위치만 override).
 *   - viewport 분기는 CSS만 (feedback_mobile_js_boundary).
 */
import { Tree } from '../../../ui/4-collection/Tree'
import type { SidebarProps } from './types'

export interface SidebarAdminFloatingProps extends SidebarProps {
  brand?: string
}

export function SidebarAdminFloating({ id, label, tree, onEvent, brand }: SidebarAdminFloatingProps) {
  const popId = `${id}.pop`
  return (
    <>
      <button
        type="button"
        // @ts-expect-error — popovertarget is HTML, not yet in React types
        popovertarget={popId}
        aria-label={label}
        data-icon="list"
        data-ds-floating-nav-trigger
      />
      <nav
        id={popId}
        // @ts-expect-error — popover is HTML, not yet in React types
        popover="auto"
        aria-label={label}
        aria-roledescription="sidebar"
        data-state="floating"
      >
        {brand && (
          <header>
            <strong>{brand}</strong>
          </header>
        )}
        <Tree data={tree} onEvent={onEvent} aria-label={label} />
      </nav>
    </>
  )
}
