/** 정적 파일 보기 — 단일 Preview + 이전/다음 버튼.
 *  IntersectionObserver·스크롤 동기·윈도잉 모두 제거(덜그덕 원인). 한 번에 한 파일만. */
import { extToIcon, type FsNode } from '../types'
import { Preview } from '../Preview'
import { Empty } from './Empty'

export function FilePager({
  siblings, currentPath, onNavigate,
}: { siblings: FsNode[]; currentPath: string; onNavigate: (p: string) => void }) {
  if (siblings.length === 0) return <Empty note="형제 파일 없음" />
  const idx = siblings.findIndex((n) => n.path === currentPath)
  const node = siblings[idx]
  if (!node) return <Empty note="파일 없음" />
  const prev = siblings[idx - 1]
  const next = siblings[idx + 1]

  return (
    <section aria-roledescription="finder-file">
      <header>
        <figure data-icon={extToIcon(node.ext)} aria-hidden />
        <h2>{node.name}</h2>
        <small>{idx + 1} / {siblings.length}</small>
      </header>
      <Preview node={node} />
      <footer aria-roledescription="pager-controls">
        <button type="button" disabled={!prev} aria-label="이전 파일" onClick={() => prev && onNavigate(prev.path)}>‹ 이전</button>
        <button type="button" disabled={!next} aria-label="다음 파일" onClick={() => next && onNavigate(next.path)}>다음 ›</button>
      </footer>
    </section>
  )
}
