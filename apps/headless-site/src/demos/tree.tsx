import { fromTree } from '@p/headless'
import { useTreePattern } from '@p/headless/patterns'
import { useLocalData } from './_useLocalData'

export const meta = {
  title: 'Tree',
  apg: 'treeview',
  kind: 'collection' as const,
  blurb: 'Hierarchical roving · Arrow expand/collapse · level/posinset/setsize auto-computed.',
}

interface Node {
  id: string
  label: string
  children?: Node[]
}

const tree: Node[] = [
  {
    id: 'src',
    label: 'src',
    children: [
      { id: 'app', label: 'App.tsx' },
      {
        id: 'demos',
        label: 'demos',
        children: [
          { id: 'tabs', label: 'tabs.tsx' },
          { id: 'tree', label: 'tree.tsx' },
        ],
      },
    ],
  },
  { id: 'pkg', label: 'package.json' },
]

export default function Demo() {
  const [data, onEvent] = useLocalData(() =>
    fromTree(tree, {
      getId: (n) => n.id,
      getKids: (n) => n.children,
      toData: (n) => ({ label: n.label }),
      expandedIds: ['src', 'demos'],
    }),
  )
  const { rootProps, itemProps, items } = useTreePattern(data, onEvent)

  return (
    <ul
      {...rootProps}
      aria-label="Files"
      className="w-64 rounded-md border border-stone-200 bg-white p-1 text-sm"
    >
      {items.map((item) => (
        <li
          key={item.id}
          {...itemProps(item.id)}
          style={{ paddingLeft: 8 + item.level * 16 }}
          className="cursor-pointer rounded py-1 pr-2 hover:bg-stone-100 aria-selected:bg-stone-900 aria-selected:text-white"
        >
          <span className="inline-block w-4 text-stone-400">
            {item.hasChildren ? (item.expanded ? '▾' : '▸') : ''}
          </span>
          {item.label}
        </li>
      ))}
    </ul>
  )
}
