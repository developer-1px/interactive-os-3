/* eslint-disable react-refresh/only-export-components */
import { applyGesture, expandBranchOnActivate, fromTree, reduceWithDefaults } from '@p/headless'
import { useLocalData } from '@p/headless/local'
import { Tree, type TreeSlotProps, type TreeSlots, treeWrapperKeys } from './_treeWrapper'

// 데이터는 예제에서 직접 보이도록 inline. wrapper(Tree) 는 _treeWrapper 안.
//
// 트리 구조 (Node 형태로 작성 → fromTree 가 NormalizedData 로 변환):
//   src/                       (folder, expanded)
//     ├─ App.tsx               (file, ext=tsx)
//     └─ demos/                (folder, expanded)
//          ├─ tabs.tsx
//          └─ tree.tsx
//   package.json               (file, ext=json)

interface FileItem extends Record<string, unknown> {
  label: string
  kind: 'folder' | 'file'
  ext?: string
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

const initialData = fromTree(files, {
  getId: (node) => node.id,
  getKids: (node) => node.children,
  toData: (node) => ({ label: node.label, kind: node.kind, ext: node.ext }),
  expandedIds: ['src', 'demos'],
})

// gesture: branch activate → expand toggle (leaf activate → activate emit 그대로).
const reducer = applyGesture(expandBranchOnActivate, reduceWithDefaults)

const slots: TreeSlots<FileItem> = {
  icon: ({ data }: TreeSlotProps<FileItem>) =>
    data.kind === 'folder' ? 'dir' : 'file',
  label: ({ item }: TreeSlotProps<FileItem>) =>
    <strong className="font-medium">{item.label}</strong>,
  trailing: ({ data }: TreeSlotProps<FileItem>) =>
    typeof data.ext === 'string' ? data.ext : null,
}

export const meta = {
  title: 'Tree Wrapper',
  apg: 'treeview',
  kind: 'collection' as const,
  blurb: 'Wrapper surface: normalized data · onEvent, with item data typed through slots.',
  keys: treeWrapperKeys,
}

export default function Demo() {
  const [data, onEvent] = useLocalData(() => initialData, reducer)

  return (
    <Tree
      aria-label="Files"
      data={data}
      onEvent={onEvent}
      slots={slots as TreeSlots}
    />
  )
}
