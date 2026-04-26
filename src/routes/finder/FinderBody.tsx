import {
  Columns as ColumnsRole,
  Listbox,
  SearchBox,
  Toolbar,
  useFeature,
  type Event,
} from '../../ds'
import { Split } from '../../ds/ui/8-layout/Split'
import { finderFeature } from './finder.feature'
import { PreviewPane } from './Preview'
import type { ViewMode } from './types'

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
  const onView = (e: Event) => {
    if (e.type === 'activate') dispatch({ type: 'setMode', mode: e.id as ViewMode })
  }

  return (
    <main data-part="finder" aria-label={`Finder — ${view.titlebar.path}`} data-view={view.titlebar.mode}>
      <Split
        data-part="body"
        id="finder-sidebar"
        axis="row"
        defaultSizes={[1, 5]}
        minSizes={[180, 480]}
      >
        <section data-part="pane" data-pane="sidebar">
          <header data-part="pane-toolbar">
            <button type="button" aria-label="사이드바 접기" data-icon="sidebar" />
          </header>
          <nav data-part="sidebar" aria-label="사이드바">
            <section aria-labelledby="sidebar-recent">
              <h3 id="sidebar-recent">최근 항목</h3>
              <Listbox data={view.sidebar.recent} onEvent={onRecent} aria-labelledby="sidebar-recent" />
            </section>
            <section aria-labelledby="sidebar-fav">
              <h3 id="sidebar-fav">즐겨찾기</h3>
              <Listbox data={view.sidebar.fav} onEvent={onFav} aria-labelledby="sidebar-fav" />
            </section>
            <section aria-labelledby="sidebar-tags">
              <h3 id="sidebar-tags">태그</h3>
              <Listbox data={view.sidebar.tags} onEvent={onRecent} aria-labelledby="sidebar-tags" />
            </section>
          </nav>
        </section>
        <div data-part="finder-main">
          <section data-part="pane" data-pane="columns">
            <header data-part="pane-toolbar">
              <Toolbar data={view.toolbar} onEvent={onView} aria-label="보기 모드" />
            </header>
            <ColumnsRole data={view.columns} onEvent={onColumns} aria-label="컬럼" />
          </section>
          <section data-part="pane" data-pane="preview">
            <header data-part="pane-toolbar">
              <SearchBox
                aria-label="검색"
                placeholder="검색"
                value={view.titlebar.query}
                onChange={(e) => dispatch({ type: 'setQuery', q: e.currentTarget.value })}
              />
            </header>
            <PreviewPane vm={view.preview} />
          </section>
        </div>
      </Split>
    </main>
  )
}
