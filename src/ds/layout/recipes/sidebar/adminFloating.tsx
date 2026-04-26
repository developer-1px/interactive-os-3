/**
 * SidebarAdminFloating — mobile surface of `sidebar/admin` intent.
 *
 * 같은 intent(`sidebar/admin`), 다른 surface. desktop은 sidebarAdmin (페이지-로컬 Tree).
 * mobile은 좌하단 floating button + native popover로 **router-wide nav** (전체 라우트
 * 카탈로그)을 full-height overlay surface에 띄운다 — 모바일에는 cmd+K 같은 외부
 * 라우터 진입점이 없으므로 FAB이 글로벌 router 역할 겸함.
 *
 * data 출처: usePaletteEntries() → router.routesById에서 staticData.palette만 추출.
 * URL path 세그먼트로 자동 그룹핑(makePaletteTree와 같은 패턴).
 *
 * widget이 아니라 React 컴포넌트인 이유: floating은 layout flow 밖 (top-layer/fixed)
 * + router subscription이 필요. page entity tree에 합치면 부모 flow를 오염시킨다.
 *
 * 책임 경계:
 *   - 트리거 = button[popovertarget]. 토글은 native popover API 소유.
 *   - 오버레이 = nav[popover][aria-roledescription="sidebar"][data-state="floating"]
 *     — 기존 sidebar surface CSS 그대로 재사용, 폭/위치만 override.
 *   - viewport 분기는 CSS만 (feedback_mobile_js_boundary).
 */
import { useMemo } from 'react'
import { useRouter } from '@tanstack/react-router'
import { Tree } from '../../../ui/4-collection/Tree'
import { useControlState } from '../../../core/hooks/useControlState'
import { navigateOnActivate } from '../../../core/gesture'
import { ROOT, EXPANDED, type Event as DsEvent, type NormalizedData } from '../../../core/types'
import { usePaletteEntries, type PaletteEntry } from '../../../ui/6-overlay/command/usePaletteEntries'

export interface SidebarAdminFloatingProps {
  /** 트리거 aria-label. 기본 "Navigation". */
  label?: string
  /** brand 텍스트 (없으면 header 생략). */
  brand?: string
}

/** PaletteEntry[] → URL path 세그먼트 트리 (NormalizedData).
 *  같은 prefix의 leaf끼리 묶이고, 중간 segment는 그룹 라벨이 된다. */
function buildRouterTree(entries: PaletteEntry[]): NormalizedData {
  const entities: NormalizedData['entities'] = { [ROOT]: { id: ROOT, data: {} } }
  const relationships: NormalizedData['relationships'] = {}
  const expanded: string[] = []

  const ensure = (path: string, segLabel: string, parentId: string) => {
    if (!entities[path]) {
      entities[path] = { id: path, data: { label: segLabel } }
      relationships[parentId] = [...(relationships[parentId] ?? []), path]
    }
  }

  for (const e of entries) {
    const segs = e.to.split('/').filter(Boolean)
    if (segs.length === 0) continue
    let acc = ''
    let parent: string = ROOT
    segs.forEach((seg, i) => {
      acc += '/' + seg
      ensure(acc, seg, parent)
      if (i === segs.length - 1) {
        // leaf — 라벨을 entry.label로 덮고 href 의도 표시.
        entities[acc] = { id: acc, data: { label: e.label, href: e.to } }
      } else {
        // 중간 그룹은 펼쳐 둠.
        if (!expanded.includes(acc)) expanded.push(acc)
      }
      parent = acc
    })
  }

  entities[EXPANDED] = { id: EXPANDED, data: { ids: expanded } }
  return { entities, relationships }
}

export function SidebarAdminFloating({ label = 'Navigation', brand }: SidebarAdminFloatingProps = {}) {
  const router = useRouter()
  const entries = usePaletteEntries()
  const tree0 = useMemo(() => buildRouterTree(entries), [entries])
  const [tree, dispatch] = useControlState(tree0)

  const onEvent = (e: DsEvent) => {
    navigateOnActivate(tree, e).forEach((ev) => {
      dispatch(ev)
      if (ev.type === 'activate') {
        const entry = entries.find((x) => x.to === ev.id)
        if (entry) router.navigate({ to: entry.to, params: entry.params })
      }
    })
  }

  const popId = 'ds-floating-nav'
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
