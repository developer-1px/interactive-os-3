import { useMemo } from 'react'
import {
  fromTree, navigateOnActivate,
  useControlState, useEventBridge,
  type UiEvent, type NormalizedData,
} from '@p/headless'
import { useResource, writeResource } from '@p/headless/store'
import { sidebar, smartGroups, isSmartPath } from '../features/data'
import { pathResource, pinnedRootResource } from '../features/resources'

/** L2 — sidebar 두 listbox 의 wiring.
 *  recent: smart group 항목. activate → path 변경.
 *  fav:    folder 즐겨찾기. activate → path 변경 + pinnedRoot 갱신(부수 효과).
 *
 *  resource ↔ pattern wiring 은 useResource + useControlState + useEventBridge
 *  3 조각 합성으로 인라인. (이전 useFlow 추상화는 1-소비자라 흡수). */

const META_SCOPE: ReadonlyArray<UiEvent['type']> = ['navigate', 'typeahead']

export type SidebarNav = { data: NormalizedData; onEvent: (e: UiEvent) => void }

export function useSidebarNav(): { recent: SidebarNav; fav: SidebarNav } {
  const [path, dispatchPath] = useResource(pathResource)
  const recentBase = useMemo(
    () => fromTree(
      smartGroups.map((g) => ({ id: g.path, label: g.label, icon: g.icon, selected: g.path === path })),
      { focusId: path ?? '/' },
    ),
    [path],
  )
  const [recentData, dispatchRecentMeta] = useControlState(recentBase)
  const recentEvent = useEventBridge({
    data: recentData,
    gestures: navigateOnActivate,
    dispatchMeta: (e) => { if (META_SCOPE.includes(e.type)) dispatchRecentMeta(e) },
    onIntent: (e) => {
      const next = pathResource.onEvent?.(e, { value: path, data: recentData })
      if (next !== undefined) dispatchPath({ type: 'set', value: next })
    },
  })

  const [pinned] = useResource(pinnedRootResource)
  const favBase = useMemo(
    () => fromTree(
      sidebar.map((s) => ({ id: s.path, label: s.label, icon: s.icon, selected: s.path === pinned })),
      { focusId: pinned ?? '/' },
    ),
    [pinned],
  )
  const [favData, dispatchFavMeta] = useControlState(favBase)
  const favBaseEvent = useEventBridge({
    data: favData,
    gestures: navigateOnActivate,
    dispatchMeta: (e) => { if (META_SCOPE.includes(e.type)) dispatchFavMeta(e) },
  })
  // fav 활성화는 pinnedRoot 갱신만. URL 은 그대로 — "그 폴더를 columns 의 root 로 본다"
  // 의미. 사용자가 깊은 path 에 있어도 fav 클릭으로 anchor 를 옮겨가며 columns chain 을
  // 그 anchor 기준으로 보게 한다.
  const favEvent = (e: UiEvent) => {
    favBaseEvent(e)
    if (e.type === 'activate' && !isSmartPath(e.id)) {
      writeResource(pinnedRootResource, e.id)
    }
  }
  return {
    recent: { data: recentData, onEvent: recentEvent },
    fav: { data: favData, onEvent: favEvent },
  }
}
