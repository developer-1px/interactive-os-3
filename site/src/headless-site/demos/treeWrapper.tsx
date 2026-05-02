import {
  activate,
  applyGesture,
  expandBranchOnActivate,
  fromTree,
  reduceWithDefaults,
  treeExpand,
  treeNavigate,
  type NormalizedData,
  type UiEvent,
} from '@p/headless'
import { useLocalData } from '@p/headless/local'
import { useTreePattern, type TreeItem } from '@p/headless/patterns'
import type { ReactNode } from 'react'
import { dedupe, probe } from '../keys'

export const meta = {
  title: 'Tree Wrapper',
  apg: 'treeview',
  kind: 'collection' as const,
  blurb: 'Wrapper surface: store · value · onEvent, with named content slots for item customization.',
  keys: () =>
    dedupe([...probe(treeNavigate), ...probe(treeExpand), ...probe(activate), 'A-Z']),
}

interface Node {
  id: string
  label: string
  kind: 'folder' | 'file'
  ext?: string
  children?: Node[]
}

const files: Node[] = [
  {
    id: 'src',
    label: 'src',
    kind: 'folder',
    children: [
      { id: 'app', label: 'App.tsx', kind: 'file', ext: 'tsx' },
      {
        id: 'demos',
        label: 'demos',
        kind: 'folder',
        children: [
          { id: 'tabs', label: 'tabs.tsx', kind: 'file', ext: 'tsx' },
          { id: 'tree', label: 'tree.tsx', kind: 'file', ext: 'tsx' },
        ],
      },
    ],
  },
  { id: 'pkg', label: 'package.json', kind: 'file', ext: 'json' },
]

const treeStore = fromTree(files, {
  getId: (node) => node.id,
  getKids: (node) => node.children,
  toData: (node) => ({ label: node.label, kind: node.kind, ext: node.ext }),
  expandedIds: ['src', 'demos'],
})

const treeReducer = applyGesture(expandBranchOnActivate, reduceWithDefaults)

export default function Demo() {
  const [value, onEvent] = useLocalData(() => treeStore, treeReducer)

  return (
    <Tree
      aria-label="Files"
      store={treeStore}
      value={value}
      onEvent={onEvent}
      slots={{
        indicator: BranchIndicator,
        icon: FileKind,
        label: FileLabel,
        trailing: FileExtension,
      }}
    />
  )
}

interface TreeProps {
  store: NormalizedData
  value: NormalizedData
  onEvent: (event: UiEvent) => void
  'aria-label': string
  slots?: TreeSlots
}

interface TreeSlots {
  indicator?: TreeSlot
  icon?: TreeSlot
  label?: TreeSlot
  trailing?: TreeSlot
}

type TreeSlot = (props: TreeSlotProps) => ReactNode

interface TreeSlotProps {
  item: TreeItem
  data: Record<string, unknown>
}

function Tree({ store, value, onEvent, slots = {}, 'aria-label': ariaLabel }: TreeProps) {
  const data = {
    entities: { ...store.entities, ...value.entities },
    relationships: store.relationships,
  }
  const { rootProps, itemProps, items } = useTreePattern(data, onEvent)

  return (
    <ul
      {...rootProps}
      aria-label={ariaLabel}
      className="w-72 rounded-md border border-stone-200 bg-white p-1 text-sm"
    >
      {items.map((item) => {
        const itemData = data.entities[item.id]?.data ?? {}
        return (
          <li
            key={item.id}
            {...itemProps(item.id)}
            style={{ paddingLeft: 8 + item.level * 16 }}
            className="grid cursor-pointer grid-cols-[1rem_2rem_1fr_auto] items-center gap-1 rounded py-1 pr-2 hover:bg-stone-100 aria-selected:bg-stone-900 aria-selected:text-white"
          >
            <span data-slot="indicator" className="text-center text-stone-400">
              {renderSlot(slots.indicator, BranchIndicator, item, itemData)}
            </span>
            <span data-slot="icon" className="font-mono text-[10px] uppercase text-stone-500">
              {renderSlot(slots.icon, FileKind, item, itemData)}
            </span>
            <span data-slot="label" className="truncate">
              {renderSlot(slots.label, DefaultLabel, item, itemData)}
            </span>
            <span data-slot="trailing" className="font-mono text-[10px] uppercase text-stone-400">
              {renderSlot(slots.trailing, EmptySlot, item, itemData)}
            </span>
          </li>
        )
      })}
    </ul>
  )
}

function renderSlot(
  slot: TreeSlot | undefined,
  fallback: TreeSlot,
  item: TreeItem,
  data: Record<string, unknown>,
) {
  const Slot = slot ?? fallback
  return <Slot item={item} data={data} />
}

function BranchIndicator({ item }: TreeSlotProps) {
  if (!item.hasChildren) return null
  return item.expanded ? '-' : '+'
}

function FileKind({ data }: TreeSlotProps) {
  return data.kind === 'folder' ? 'dir' : 'file'
}

function FileLabel({ item }: TreeSlotProps) {
  return <strong className="font-medium">{item.label}</strong>
}

function FileExtension({ data }: TreeSlotProps) {
  if (typeof data.ext !== 'string') return null
  return data.ext
}

function DefaultLabel({ item }: TreeSlotProps) {
  return item.label
}

function EmptySlot() {
  return null
}
