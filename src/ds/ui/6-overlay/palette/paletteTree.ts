import { fromTree, pathAncestors } from '../../../core/state/fromTree'
import type { NormalizedData } from '../../../core/types'
import type { PaletteEntry } from './usePaletteEntries'

type Node = {
  id: string
  label: string
  to?: string
  params?: Record<string, string>
  children: Node[]
}

/** PaletteEntry[] → URL path 세그먼트 트리. id = 누적 경로(/seg/seg).
 *  group 노드는 segment 문자열을 라벨로, leaf 노드는 entry.label로 덮어씀. */
function buildTree(entries: PaletteEntry[]): { roots: Node[]; leafByPath: Map<string, PaletteEntry> } {
  const map = new Map<string, Node>()
  const leafByPath = new Map<string, PaletteEntry>()
  const roots: Node[] = []

  const ensure = (path: string, segLabel: string): Node => {
    let n = map.get(path)
    if (!n) {
      n = { id: path, label: segLabel, children: [] }
      map.set(path, n)
    }
    return n
  }

  for (const e of entries) {
    const segs = e.to.split('/').filter(Boolean)
    if (segs.length === 0) continue
    let acc = ''
    let parent: Node | null = null
    segs.forEach((seg, i) => {
      acc += '/' + seg
      const node = ensure(acc, seg)
      if (i === segs.length - 1) {
        node.label = e.label
        node.to = e.to
        node.params = e.params
        leafByPath.set(acc, e)
      }
      if (parent) {
        if (!parent.children.includes(node)) parent.children.push(node)
      } else if (!roots.includes(node)) roots.push(node)
      parent = node
    })
  }

  return { roots, leafByPath }
}

export type PaletteTree = ReturnType<typeof buildTree>

export function makePaletteTree(entries: PaletteEntry[]): PaletteTree {
  return buildTree(entries)
}

export function toColumnsData(tree: PaletteTree, focusId: string): NormalizedData {
  const expanded = focusId ? pathAncestors(focusId) : []
  return fromTree(tree.roots, {
    getId: (n) => n.id,
    getKids: (n) => (n.children.length > 0 ? n.children : undefined),
    toData: (n) => ({
      label: n.label,
      icon: n.children.length > 0 ? 'dir' : undefined,
      selected: n.id === focusId,
    }),
    focusId: focusId || null,
    expandedIds: expanded,
  })
}
