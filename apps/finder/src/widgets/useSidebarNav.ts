import {
  defineFlow, fromTree, navigateOnActivate, useFlow, writeResource,
  type UiEvent, type NormalizedData,
} from '@p/headless'
import { sidebar, smartGroups, isSmartPath } from '../features/data'
import { pathResource, pinnedRootResource } from '../features/resources'

/** L2 — sidebar 두 listbox 의 flow.
 *  recent: smart group 항목. activate → path 변경.
 *  fav:    folder 즐겨찾기. activate → path 변경 + pinnedRoot 갱신(부수 효과).
 *
 *  Multi-source intent — 한 event 가 두 resource(path/pinnedRoot)에 영향을 줄 때
 *  flow API 확장 대신 useFlow 의 onEvent 를 wrap 하여 부수 효과를 추가한다 (다른
 *  resource 는 write-only side-effect). 향후 패턴이 더 늘어나면 flow.afterIntent
 *  훅을 검토. */

// Flow 정의는 lazy — 모듈 레벨에서 pathResource 를 즉시 캡처하면 routeTree 의
// 순환 import (router → routeTree → routes/finder → Finder → Sidebar → 여기 → resources → router) 에서
// TDZ 발생. lazy getter 로 회피.
const recentFlow = defineFlow<string>({
  get source() { return pathResource },
  base: (path = '/') => fromTree(
    smartGroups.map((g) => ({ id: g.path, label: g.label, icon: g.icon, selected: g.path === path })),
    { focusId: path },
  ),
  gestures: navigateOnActivate,
  metaScope: ['navigate', 'typeahead'],
})

// fav 선택은 pinnedRoot 가 진실 원천 — 현재 path 와 무관한 별개 상태.
// 사용자가 fav 항목을 클릭한 결과만 selected 로 표시.
const favFlow = defineFlow<string>({
  get source() { return pinnedRootResource },
  base: (pinned = '/') => fromTree(
    sidebar.map((s) => ({ id: s.path, label: s.label, icon: s.icon, selected: s.path === pinned })),
    { focusId: pinned },
  ),
  gestures: navigateOnActivate,
  metaScope: ['navigate', 'typeahead'],
})

export type SidebarNav = { data: NormalizedData; onEvent: (e: UiEvent) => void }

export function useSidebarNav(): { recent: SidebarNav; fav: SidebarNav } {
  const [recentData, recentEvent] = useFlow(recentFlow)
  const [favData] = useFlow(favFlow)
  // fav 활성화는 pinnedRoot 갱신만. URL 은 그대로 — "그 폴더를 columns 의 root 로 본다"
  // 의미. 사용자가 깊은 path 에 있어도 fav 클릭으로 anchor 를 옮겨가며 columns chain 을
  // 그 anchor 기준으로 보게 한다.
  const favEvent = (e: UiEvent) => {
    if (e.type === 'activate' && !isSmartPath(e.id)) {
      writeResource(pinnedRootResource, e.id)
    }
  }
  return {
    recent: { data: recentData, onEvent: recentEvent },
    fav: { data: favData, onEvent: favEvent },
  }
}
