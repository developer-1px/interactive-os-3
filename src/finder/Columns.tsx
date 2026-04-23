import { Listbox, Option } from '../controls'
import type { FsNode } from './types'

export function Columns({ chain, onNavigate }: {
  chain: FsNode[]
  onNavigate: (path: string) => void
}) {
  // chain[0] = root. 각 단계 부모의 children을 한 열로 표시.
  const columns = chain.filter((n) => n.type === 'dir' && n.children)
  return (
    <section aria-roledescription="columns" aria-label="컬럼">
      {columns.map((parent, i) => {
        const selectedChild = chain[i + 1]
        return (
          <nav key={parent.path + i} aria-roledescription="column" aria-label={parent.name}>
            <Listbox aria-label={parent.name}>
              {parent.children!.map((c) => (
                <Option
                  key={c.path}
                  selected={selectedChild?.path === c.path}
                  onClick={() => onNavigate(c.path)}
                  {...(c.type === 'dir' ? { 'aria-haspopup': 'menu' } : {})}
                >
                  <span aria-hidden>{c.type === 'dir' ? '📁' : icon(c.ext)}</span>
                  <span>{c.name}</span>
                </Option>
              ))}
            </Listbox>
          </nav>
        )
      })}
    </section>
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
