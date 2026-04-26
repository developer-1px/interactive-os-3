import {
  Columns as ColumnsRole, Listbox, useFeature,
  type Event,
} from '../../ds'
import { finderFeature } from './finder.feature'
import { PreviewBody } from './Preview'
import { formatDate, formatSize } from './data'
import type { FsNode } from './types'

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
        <h1>{view.titlebar.path}</h1>
      </header>
      <section aria-roledescription="body">
        <nav aria-roledescription="sidebar" aria-label="사이드바">
          <Listbox data={view.sidebar.recent} onEvent={onRecent} aria-label="최근" />
          <Listbox data={view.sidebar.fav}    onEvent={onFav}    aria-label="즐겨찾기" />
        </nav>
        <ColumnsRole data={view.columns} onEvent={onColumns} aria-label="컬럼" />
        <Preview kind={view.preview} />
      </section>
    </main>
  )
}

type PreviewVM =
  | { kind: 'empty' }
  | { kind: 'dir'; node: FsNode }
  | { kind: 'image'; node: FsNode; src: string | null }
  | { kind: 'text'; node: FsNode; text: string | null }

function Preview({ kind }: { kind: PreviewVM }) {
  const show = kind.kind !== 'empty' && kind.kind !== 'dir'
  return (
    <aside aria-roledescription="preview" aria-label="미리보기" aria-hidden={!show}>
      {show && 'node' in kind && (
        <>
          <PreviewBody node={kind.node} />
          <Meta node={kind.node} />
        </>
      )}
    </aside>
  )
}

function Meta({ node }: { node: FsNode }) {
  return (
    <dl>
      <dt>종류</dt><dd>{node.ext || '파일'}</dd>
      <dt>경로</dt><dd title={node.path}>{node.path}</dd>
      {node.size != null && <><dt>크기</dt><dd>{formatSize(node.size)}</dd></>}
      {node.mtime && <><dt>수정일</dt><dd>{formatDate(node.mtime)}</dd></>}
    </dl>
  )
}
