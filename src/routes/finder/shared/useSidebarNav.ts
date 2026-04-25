import { useMemo } from 'react'
import {
  fromTree, navigateOnActivate, useControlState,
  type Event, type NormalizedData,
} from '../../../ds'
import { sidebar, smartGroups } from '../data'
import type { SidebarItem, SmartGroupItem } from '../types'

/** L2 — sidebar/recent nav 상태 + 핸들러. desktop Sidebar와 mobile Home 양쪽이 소비.
 *  data 두 벌(recent, fav)을 fromTree로 만들고 각각 useControlState로 dispatch 보관.
 *  onPick은 activate event를 받았을 때만 호출 — 외부 라우팅은 소비자 결정. */

export type SidebarNav = {
  data: NormalizedData
  onEvent: (e: Event) => void
}

export function useSidebarNav(current: string, onPick: (path: string) => void): {
  recent: SidebarNav
  fav: SidebarNav
} {
  const recentBase = useMemo(
    () => fromTree(smartGroups, {
      getId: (g: SmartGroupItem) => g.path,
      toData: (g: SmartGroupItem) => ({ label: g.label, icon: g.icon, selected: g.path === current }),
      focusId: current,
    }),
    [current],
  )
  const favBase = useMemo(
    () => fromTree(sidebar, {
      getId: (s: SidebarItem) => s.path,
      toData: (s: SidebarItem) => ({ label: s.label, icon: s.icon, selected: s.path === current }),
      focusId: current,
    }),
    [current],
  )
  const [recent, dispatchRecent] = useControlState(recentBase)
  const [fav, dispatchFav] = useControlState(favBase)
  const handle = (data: NormalizedData, dispatch: (e: Event) => void) => (e: Event) =>
    navigateOnActivate(data, e).forEach((ev) => {
      dispatch(ev)
      if (ev.type === 'activate') onPick(ev.id)
    })
  return {
    recent: { data: recent, onEvent: handle(recent, dispatchRecent) },
    fav: { data: fav, onEvent: handle(fav, dispatchFav) },
  }
}
