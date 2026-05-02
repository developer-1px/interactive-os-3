import {
  activate,
  applyGesture,
  expandBranchOnActivate,
  fromTree,
  reduceWithDefaults,
  treeExpand,
  treeNavigate,
} from '@p/headless'
import { dedupe, probe } from '../../../headless-site/keys'
import type { TreeSlotProps, TreeSlots } from './slots'

interface FileItem {
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

export const treeData = fromTree(files, {
  getId: (node) => node.id,
  getKids: (node) => node.children,
  toData: (node) => ({ label: node.label, kind: node.kind, ext: node.ext }),
  expandedIds: ['src', 'demos'],
})

export const treeReducer = applyGesture(expandBranchOnActivate, reduceWithDefaults)

export const treeWrapperKeys = () =>
  dedupe([...probe(treeNavigate), ...probe(treeExpand), ...probe(activate), 'A-Z'])

export const treeSlots: TreeSlots<FileItem> = {
  icon: renderFileKind,
  label: renderFileLabel,
  trailing: renderFileExtension,
}

function renderFileKind({ data }: TreeSlotProps<FileItem>) {
  return data.kind === 'folder' ? 'dir' : 'file'
}

function renderFileLabel({ item }: TreeSlotProps<FileItem>) {
  return <strong className="font-medium">{item.label}</strong>
}

function renderFileExtension({ data }: TreeSlotProps<FileItem>) {
  if (typeof data.ext !== 'string') return null
  return data.ext
}
