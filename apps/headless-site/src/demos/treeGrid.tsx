import { fromTree } from '@p/headless'
import { useTreeGridPattern } from '@p/headless/patterns'
import { useLocalData } from './_useLocalData'

export const meta = {
  title: 'Tree Grid',
  apg: 'treegrid',
  kind: 'collection' as const,
  blurb: '2-axis (row × cell) navigation · expandable rows · combines tree + grid keyboard model.',
}

interface Row {
  id: string
  name: string
  size: string
  modified: string
  children?: Row[]
}

const rows: Row[] = [
  {
    id: 'src',
    name: 'src',
    size: '—',
    modified: '2026-05-01',
    children: [
      { id: 'app', name: 'App.tsx', size: '4 KB', modified: '2026-05-02' },
      { id: 'main', name: 'main.tsx', size: '0.5 KB', modified: '2026-05-02' },
    ],
  },
  { id: 'pkg', name: 'package.json', size: '1 KB', modified: '2026-05-02' },
]

const COLS = ['Name', 'Size', 'Modified']

export default function Demo() {
  const [data, onEvent] = useLocalData(() =>
    fromTree(rows, {
      getId: (n) => n.id,
      getKids: (n) => n.children,
      toData: (n) => ({ label: n.name, size: n.size, modified: n.modified }),
      expandedIds: ['src'],
    }),
  )
  const { rootProps, rowProps, cellProps, items } = useTreeGridPattern(data, onEvent)

  return (
    <div
      {...rootProps}
      aria-label="Files"
      className="w-full overflow-hidden rounded-md border border-stone-200 bg-white text-sm"
    >
      <div role="row" className="grid grid-cols-[1fr,80px,120px] border-b bg-stone-50 px-2 py-1 text-xs font-medium text-stone-600">
        {COLS.map((c) => (
          <span key={c} role="columnheader">
            {c}
          </span>
        ))}
      </div>
      {items.map((item) => {
        const ent = data.entities[item.id]?.data ?? {}
        return (
          <div
            key={item.id}
            {...rowProps(item.id)}
            className="grid grid-cols-[1fr,80px,120px] px-2 py-1 hover:bg-stone-50 aria-selected:bg-stone-900 aria-selected:text-white"
          >
            <span {...cellProps(item.id, 0)} style={{ paddingLeft: item.level * 16 }}>
              <span className="inline-block w-4 text-stone-400">
                {item.hasChildren ? (item.expanded ? '▾' : '▸') : ''}
              </span>
              {item.label}
            </span>
            <span {...cellProps(item.id, 1)}>{String(ent.size ?? '')}</span>
            <span {...cellProps(item.id, 2)}>{String(ent.modified ?? '')}</span>
          </div>
        )
      })}
    </div>
  )
}
