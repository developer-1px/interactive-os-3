import { formatDate, formatSize } from './data'
import { extToIcon, type FsNode } from './types'

export function Preview({ node }: { node: FsNode | null }) {
  const show = node?.type === 'file'
  return (
    <aside aria-roledescription="preview" aria-label="미리보기" aria-hidden={!show}>
      {show && node && (
        <>
          <figure data-icon={extToIcon(node.ext)} aria-hidden />
          <div>
            <h2>{node.name}</h2>
            <p>{(node.ext ?? 'file').toUpperCase()} — {formatSize(node.size)}</p>
          </div>
          <dl>
            <dt>종류</dt><dd>{node.ext || '파일'}</dd>
            <dt>경로</dt><dd title={node.path}>{node.path}</dd>
            {node.size != null && <><dt>크기</dt><dd>{formatSize(node.size)}</dd></>}
            {node.mtime && <><dt>수정일</dt><dd>{formatDate(node.mtime)}</dd></>}
          </dl>
        </>
      )}
    </aside>
  )
}
