import {
  activate,
  applyGesture,
  expandBranchOnActivate,
  fromTree,
  reduceWithDefaults,
  treeNavigate,
} from '@p/headless'
import { useTreeGridPattern } from '@p/headless/patterns'
import { useLocalData } from '@p/headless/local'
import { dedupe, probe } from '../keys'

export const meta = {
  title: 'Tree Grid',
  apg: 'treegrid',
  kind: 'collection' as const,
  blurb: 'Tree visible-order navigation · expandable rows · rowheader/gridcell grid semantics.',
  keys: () => dedupe([...probe(treeNavigate), 'ArrowLeft', 'ArrowRight', ...probe(activate)]),
}

interface Row {
  id: string
  label: string
  size: string
  modified: string
  children?: Row[]
}

const rows: Row[] = [
  {
    id: 'src',
    label: 'src',
    size: '—',
    modified: '2026-05-01',
    children: [
      { id: 'app', label: 'App.tsx', size: '4 KB', modified: '2026-05-02' },
      { id: 'main', label: 'main.tsx', size: '0.5 KB', modified: '2026-05-02' },
    ],
  },
  { id: 'pkg', label: 'package.json', size: '1 KB', modified: '2026-05-02' },
]

const COLS = ['Name', 'Size', 'Modified']
const treeGridReducer = applyGesture(expandBranchOnActivate, reduceWithDefaults)

export default function Demo() {
  const [data, onEvent] = useLocalData(() =>
    fromTree(rows, { expanded: ['src'] }),
    treeGridReducer,
  )
  const { rootProps, rowProps, cellProps, items } = useTreeGridPattern(data, onEvent)

  return (
    <div
      {...rootProps}
      aria-label="Files"
      aria-colcount={COLS.length}
      aria-rowcount={items.length + 1}
      className="w-full overflow-hidden rounded-lg border border-stone-200 bg-white text-sm shadow-sm"
    >
      <div
        role="row"
        aria-rowindex={1}
        className="grid grid-cols-[minmax(0,1.5fr)_88px_132px] items-center border-b border-stone-200 bg-stone-50 text-xs font-medium text-stone-600"
      >
        {COLS.map((c, i) => (
          <span key={c} role="columnheader" aria-colindex={i + 1} className="px-3 py-2">
            {c}
          </span>
        ))}
      </div>
      {items.map((item, rowIndex) => {
        const ent = data.entities[item.id] ?? {}
        return (
          <div
            key={item.id}
            {...rowProps(item.id)}
            aria-rowindex={rowIndex + 2}
            className="grid grid-cols-[minmax(0,1.5fr)_88px_132px] items-center border-b border-stone-100 last:border-b-0 hover:bg-stone-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-stone-900 aria-selected:bg-stone-900 aria-selected:text-white"
          >
            <span
              {...cellProps(item.id, 0)}
              style={{ paddingLeft: `${12 + (item.level - 1) * 18}px` }}
              className="flex min-w-0 items-center gap-1 py-2 pr-3"
            >
              <span aria-hidden className="w-4 shrink-0 text-center text-stone-400">
                {item.hasChildren ? (item.expanded ? 'v' : '>') : ''}
              </span>
              <span className="truncate">{item.label}</span>
            </span>
            <span {...cellProps(item.id, 1)} className="px-3 py-2 text-stone-600">
              {String(ent.size ?? '')}
            </span>
            <span {...cellProps(item.id, 2)} className="px-3 py-2 text-stone-600">
              {String(ent.modified ?? '')}
            </span>
          </div>
        )
      })}
    </div>
  )
}
