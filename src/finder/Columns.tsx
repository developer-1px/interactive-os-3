import type { CSSProperties } from 'react'
import { Listbox, Option } from '../controls'
import type { FsNode } from './types'

const wrap: CSSProperties = { flex: 1, display: 'flex', overflow: 'auto', minWidth: 0 }
const col: CSSProperties = {
  width: 220, flex: 'none', overflowY: 'auto',
  borderInlineEnd: '1px solid var(--ds-border)', fontSize: 13,
}
const nameStyle: CSSProperties = { overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', minWidth: 0 }

export function Columns({ chain, onNavigate }: {
  chain: FsNode[]
  onNavigate: (path: string) => void
}) {
  // chain[0] = root. 각 단계 부모의 children을 한 열로 표시.
  const columns = chain.filter((n) => n.type === 'dir' && n.children)
  return (
    <div style={wrap}>
      {columns.map((parent, i) => {
        const selectedChild = chain[i + 1]
        return (
          <div key={parent.path + i} style={col}>
            <Listbox aria-label={parent.name}>
              {parent.children!.map((c) => (
                <Option
                  key={c.path}
                  selected={selectedChild?.path === c.path}
                  onClick={() => onNavigate(c.path)}
                >
                  <span aria-hidden>{c.type === 'dir' ? '📁' : icon(c.ext)}</span>
                  <span style={nameStyle}>{c.name}</span>
                  {c.type === 'dir' && <span aria-hidden style={{ marginInlineStart: 'auto', opacity: 0.4 }}>›</span>}
                </Option>
              ))}
            </Listbox>
          </div>
        )
      })}
    </div>
  )
}

function icon(ext?: string): string {
  if (!ext) return '📄'
  if (['ts', 'tsx', 'js', 'jsx', 'mjs', 'cjs'].includes(ext)) return '📜'
  if (['json', 'yaml', 'yml', 'toml'].includes(ext)) return '⚙️'
  if (['md', 'mdx', 'txt'].includes(ext)) return '📝'
  if (['png', 'jpg', 'jpeg', 'gif', 'svg', 'webp'].includes(ext)) return '🖼️'
  if (['css', 'scss', 'sass'].includes(ext)) return '🎨'
  if (['html'].includes(ext)) return '🌐'
  return '📄'
}
