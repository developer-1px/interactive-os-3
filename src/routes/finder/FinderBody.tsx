import { Columns as ColumnsRole, Listbox, useFeature, type Event } from '../../ds'
import { finderFeature } from './finder.feature'
import { PreviewPane } from './Preview'

/**
 * Finder 본문 — sidebar(recent/fav Listbox) + Columns view + Preview pane.
 * useFeature(finderFeature) 로 상태 일괄 관리. 라우트 로컬 Ui leaf.
 */
export function FinderBody() {
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
    <main data-part="finder" aria-label="Finder" data-view="columns">
      <header>
        <div data-part="window-controls" aria-label="창 컨트롤"><span /><span /><span /></div>
        <h1>{view.titlebar.path}</h1>
      </header>
      <section data-part="body">
        <nav data-part="sidebar" aria-label="사이드바">
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
