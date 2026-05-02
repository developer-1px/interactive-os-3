import {
  activate,
  applyGesture,
  expandBranchOnActivate,
  fromTree,
  multiSelect,
  reduceWithMultiSelect,
  treeExpand,
  treeNavigate,
} from '@p/headless'
import { useTreePattern } from '@p/headless/patterns'
import { useLocalData } from '@p/headless/local'
import { dedupe, probe } from '../keys'

export const meta = {
  title: 'Tree · Multi',
  apg: 'treeview',
  kind: 'collection' as const,
  blurb: 'aria-multiselectable · Click/Space 토글 · Shift+Arrow 범위 · Ctrl/Meta+A 전체.',
  keys: () =>
    dedupe([
      ...probe(treeNavigate),
      ...probe(treeExpand),
      ...probe(activate),
      ...probe(multiSelect),
      'Shift+↑↓',
      'Ctrl/Meta+A',
      'A–Z',
    ]),
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

const treeReducer = applyGesture(expandBranchOnActivate, reduceWithMultiSelect)

export default function Demo() {
  const [data, onEvent] = useLocalData(
    () =>
      fromTree(tree, {
        getId: (n) => n.id,
        getKids: (n) => n.children,
        toData: (n) => ({ label: n.label }),
        expandedIds: ['src', 'demos'],
      }),
    treeReducer,
  )
  const { rootProps, itemProps, items } = useTreePattern(data, onEvent, {
    multiSelectable: true,
  })

  return (
    <ul
      {...rootProps}
      aria-label="Files (multi-select)"
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
