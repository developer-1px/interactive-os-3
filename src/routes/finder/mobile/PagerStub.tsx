import { extToIcon, type FsNode } from '../types'

/** Pager 윈도우 밖 형제 — Preview 마운트 비용 없이 자리만 유지. */
export function PagerStub({ node }: { node: FsNode }) {
  return (
    <aside aria-roledescription="preview" aria-hidden="true">
      <header>
        <figure data-icon={extToIcon(node.ext)} aria-hidden />
        <div>
          <h2>{node.name}</h2>
          <p>{(node.ext ?? 'file').toUpperCase()}</p>
        </div>
      </header>
    </aside>
  )
}
