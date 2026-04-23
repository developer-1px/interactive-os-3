import { Listbox, Option } from '../controls'
import { extToIcon, type FsNode } from './types'

export function Columns({ chain, onNavigate }: {
  chain: FsNode[]
  onNavigate: (path: string) => void
}) {
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
                  data-icon={c.type === 'dir' ? 'dir' : extToIcon(c.ext)}
                  {...(c.type === 'dir' ? { 'aria-haspopup': 'menu' } : {})}
                >
                  {c.name}
                </Option>
              ))}
            </Listbox>
          </nav>
        )
      })}
    </section>
  )
}
