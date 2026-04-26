import { Listbox } from '@p/ds'
import { useSidebarNav } from './useSidebarNav'

export function Sidebar() {
  const { recent, fav } = useSidebarNav()
  return (
    <nav data-part="sidebar" aria-label="사이드바">
      <Listbox data={recent.data} onEvent={recent.onEvent} aria-label="최근" />
      <Listbox data={fav.data} onEvent={fav.onEvent} aria-label="즐겨찾기" />
    </nav>
  )
}
