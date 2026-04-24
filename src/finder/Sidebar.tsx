import { useMemo } from 'react'
import { Listbox, fromTree, useControlState, type Event } from '../controls'
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
  const onEvent = (e: Event) => {
    dispatch(e)
    if (e.type === 'activate') onPick(e.id)
  }
  return (
    <nav aria-roledescription="sidebar" aria-label="사이드바">
      <Listbox data={data} onEvent={onEvent} aria-label="즐겨찾기" />
    </nav>
  )
}
