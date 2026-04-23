import { formatDate, formatSize } from './data'
import type { FsNode } from './types'

export function Preview({ node }: { node: FsNode | null }) {
  if (!node) return (
    <aside aria-roledescription="preview" aria-label="미리보기">
      <p>항목을 선택하세요</p>
    </aside>
  )
  return (
    <aside aria-roledescription="preview" aria-label="미리보기">
      <figure aria-hidden>{node.type === 'dir' ? '📁' : fileEmoji(node.ext)}</figure>
      <div>
        <h2>{node.name}</h2>
        <p>{node.type === 'dir'
          ? `${node.children?.length ?? 0}개 항목`
          : `${(node.ext ?? 'file').toUpperCase()} — ${formatSize(node.size)}`}</p>
      </div>
      <dl>
        <dt>종류</dt><dd>{node.type === 'dir' ? '폴더' : node.ext || '파일'}</dd>
        <dt>경로</dt><dd title={node.path}>{node.path}</dd>
        {node.size != null && <><dt>크기</dt><dd>{formatSize(node.size)}</dd></>}
        {node.mtime && <><dt>수정일</dt><dd>{formatDate(node.mtime)}</dd></>}
      </dl>
    </aside>
  )
}

function fileEmoji(ext?: string): string {
  if (!ext) return '📄'
  if (['png', 'jpg', 'jpeg', 'gif', 'webp'].includes(ext)) return '🖼️'
  if (['svg'].includes(ext)) return '🎨'
  if (['ts', 'tsx', 'js', 'jsx'].includes(ext)) return '📜'
  if (['json', 'yaml', 'yml'].includes(ext)) return '⚙️'
  if (['md'].includes(ext)) return '📝'
  if (['html'].includes(ext)) return '🌐'
  return '📄'
}
