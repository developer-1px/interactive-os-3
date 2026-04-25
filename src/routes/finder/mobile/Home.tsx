import { Listbox } from '../../../ds'
import { useSidebarNav } from '../shared/useSidebarNav'

export function Home({ current, onNavigate }: { current: string; onNavigate: (p: string) => void }) {
  const { recent, fav } = useSidebarNav(current, onNavigate)
  return (
    <section aria-roledescription="finder-home">
      <section>
        <h2>최근</h2>
        <Listbox data={recent.data} onEvent={recent.onEvent} aria-label="최근" />
      </section>
      <section>
        <h2>위치</h2>
        <Listbox data={fav.data} onEvent={fav.onEvent} aria-label="즐겨찾기" />
      </section>
    </section>
  )
}
