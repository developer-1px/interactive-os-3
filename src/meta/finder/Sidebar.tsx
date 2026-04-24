import { useMemo } from 'react'
import { Listbox, fromTree, navigateOnActivate, useControlState, type Event } from '../../ds'
import { sidebar } from './data'

export function Sidebar({ current, onPick }: { current: string; onPick: (p: string) => void }) {
  const base = useMemo(
    () =>
      fromTree(sidebar, {
        getId: (s) => s.path,
        toData: (s) => ({ label: s.label, icon: s.icon, selected: s.path === current }),
        focusId: current,
      }),
    [current],
  )
  const [data, dispatch] = useControlState(base)
  const onEvent = (e: Event) =>
    navigateOnActivate(data, e).forEach((ev) => {
      dispatch(ev)
      if (ev.type === 'activate') onPick(ev.id)
    })
  return (
    <nav aria-roledescription="sidebar" aria-label="사이드바">
      <Listbox data={data} onEvent={onEvent} aria-label="즐겨찾기" />
    </nav>
  )
}
