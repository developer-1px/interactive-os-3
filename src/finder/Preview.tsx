import type { CSSProperties } from 'react'
import { formatDate, formatSize } from './data'
import type { FsNode } from './types'

const wrap: CSSProperties = {
  width: 320, flex: 'none', overflowY: 'auto',
  padding: 24, fontSize: 13,
  display: 'flex', flexDirection: 'column', gap: 16,
}
const thumb: CSSProperties = {
  width: '100%', aspectRatio: '4 / 3', borderRadius: 8,
  background: 'color-mix(in oklch, Canvas 92%, CanvasText 8%)',
  display: 'grid', placeItems: 'center',
  fontSize: 72, border: '1px solid var(--ds-border)',
}
const meta: CSSProperties = { display: 'grid', gridTemplateColumns: 'auto 1fr', rowGap: 6, columnGap: 12 }
const label: CSSProperties = { opacity: 0.55 }
const val: CSSProperties = { textAlign: 'right', fontVariantNumeric: 'tabular-nums' }

export function Preview({ node }: { node: FsNode | null }) {
  if (!node) return <aside style={wrap}><div style={{ opacity: 0.5 }}>항목을 선택하세요</div></aside>
  return (
    <aside style={wrap} aria-label="미리보기">
      <div style={thumb} aria-hidden>
        {node.type === 'dir' ? '📁' : fileEmoji(node.ext)}
      </div>
      <div>
        <div style={{ fontSize: 15, fontWeight: 600, wordBreak: 'break-all' }}>{node.name}</div>
        <div style={{ opacity: 0.6, marginTop: 2 }}>
          {node.type === 'dir' ? `${node.children?.length ?? 0}개 항목` : `${(node.ext ?? 'file').toUpperCase()} — ${formatSize(node.size)}`}
        </div>
      </div>
      <div>
        <div style={{ fontWeight: 600, marginBottom: 6 }}>정보</div>
        <div style={meta}>
          <span style={label}>종류</span><span style={val}>{node.type === 'dir' ? '폴더' : node.ext || '파일'}</span>
          <span style={label}>경로</span><span style={val} title={node.path}>{node.path}</span>
          {node.size != null && <><span style={label}>크기</span><span style={val}>{formatSize(node.size)}</span></>}
          {node.mtime && <><span style={label}>수정일</span><span style={val}>{formatDate(node.mtime)}</span></>}
        </div>
      </div>
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
