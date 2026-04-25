import { Listbox } from '../../ds'
import { useSidebarNav } from './shared/useSidebarNav'

export function Sidebar({ current, onPick }: { current: string; onPick: (p: string) => void }) {
  const { recent, fav } = useSidebarNav(current, onPick)
  return (
    <nav aria-roledescription="sidebar" aria-label="사이드바">
      <Listbox data={recent.data} onEvent={recent.onEvent} aria-label="최근" />
      <Listbox data={fav.data} onEvent={fav.onEvent} aria-label="즐겨찾기" />
    </nav>
  )
}
