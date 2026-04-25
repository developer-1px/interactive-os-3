import { useMemo } from 'react'
import { Listbox, fromTree, navigateOnActivate, useControlState, type Event } from '../../ds'
import { sidebar, smartGroups } from './data'

export function Sidebar({ current, onPick }: { current: string; onPick: (p: string) => void }) {
  const recentBase = useMemo(
    () =>
      fromTree(smartGroups, {
        getId: (g) => g.path,
        toData: (g) => ({ label: g.label, icon: g.icon, selected: g.path === current }),
        focusId: current,
      }),
    [current],
  )
  const favBase = useMemo(
    () =>
      fromTree(sidebar, {
        getId: (s) => s.path,
        toData: (s) => ({ label: s.label, icon: s.icon, selected: s.path === current }),
        focusId: current,
      }),
    [current],
  )
  const [recent, dispatchRecent] = useControlState(recentBase)
  const [fav, dispatchFav] = useControlState(favBase)
  const handle = (data: typeof recent, dispatch: typeof dispatchRecent) => (e: Event) =>
    navigateOnActivate(data, e).forEach((ev) => {
      dispatch(ev)
      if (ev.type === 'activate') onPick(ev.id)
    })
  return (
    <nav aria-roledescription="sidebar" aria-label="사이드바">
      <Listbox data={recent} onEvent={handle(recent, dispatchRecent)} aria-label="최근" />
      <Listbox data={fav} onEvent={handle(fav, dispatchFav)} aria-label="즐겨찾기" />
    </nav>
  )
}
