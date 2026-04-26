import { Columns as ColumnsRole, Listbox, useFeature, type Event } from '../../ds'
import { finderFeature } from './finder.feature'
import { PreviewPane } from './Preview'

export function Finder() {
  const [view, dispatch] = useFeature(finderFeature)

  const onColumns = (e: Event) => {
    if (e.type === 'activate' || e.type === 'navigate') dispatch({ type: 'activateCol', id: e.id })
    else if (e.type === 'expand') dispatch({ type: 'expandCol', id: e.id, open: e.open })
  }
  const onRecent = (e: Event) => {
    if (e.type === 'activate') dispatch({ type: 'activateRec', id: e.id })
  }
  const onFav = (e: Event) => {
    if (e.type === 'activate') dispatch({ type: 'pinFav', id: e.id })
  }

  return (
    <main aria-roledescription="finder" aria-label="Finder" data-view="columns">
      <header>
        <div aria-roledescription="window-controls" aria-label="창 컨트롤"><span /><span /><span /></div>
        <h1>{view.titlebar.path}</h1>
      </header>
      <section aria-roledescription="body">
        <nav aria-roledescription="sidebar" aria-label="사이드바">
          <section aria-labelledby="sidebar-recent">
            <h3 id="sidebar-recent">최근 항목</h3>
            <Listbox data={view.sidebar.recent} onEvent={onRecent} aria-labelledby="sidebar-recent" />
          </section>
          <section aria-labelledby="sidebar-fav">
            <h3 id="sidebar-fav">즐겨찾기</h3>
            <Listbox data={view.sidebar.fav} onEvent={onFav} aria-labelledby="sidebar-fav" />
          </section>
        </nav>
        <ColumnsRole data={view.columns} onEvent={onColumns} aria-label="컬럼" />
        <PreviewPane vm={view.preview} />
      </section>
    </main>
  )
}
