import {
  Columns as ColumnsRole,
  defineFlow,
  expandBranchOnActivate,
  fromTree,
  pathAncestors,
  readResource,
  useFlow,
} from '../../ds'
import { walk } from './data'
import { pathResource, pinnedRootResource, treeResource } from './resources'
import { extToIcon } from './types'

/** Finder columns flow — URL이 진실 원천. EXPANDED 는 base seed(pathAncestors) 가 owner.
 *  pinnedRoot 는 base 내부 readResource 로 흡수 — module-level 단일 정의. */
const columnsFlow = defineFlow<string>({
  source: pathResource,
  base: (path = '/') => {
    const tree = readResource(treeResource)
    if (!tree) return { entities: {}, relationships: {} }
    const pinned = readResource(pinnedRootResource) ?? '/'
    const rootNode = pinned === '/' ? tree : (walk(pinned).at(-1) ?? tree)
    const c = walk(path)
    const cwd = c[c.length - 1]?.type === 'dir' ? c[c.length - 1] : c[c.length - 2] ?? tree
    return fromTree(rootNode.children ?? [], {
      getId: (n) => n.path,
      getKids: (n) => n.children,
      toData: (n) => ({
        label: n.name,
        icon: n.type === 'dir' ? 'dir' : extToIcon(n.ext),
        selected: n.path === path,
      }),
      focusId: cwd?.path ?? path,
      expandedIds: pathAncestors(path),
    })
  },
  gestures: expandBranchOnActivate,
  metaScope: ['navigate', 'typeahead'],
})

export function Columns() {
  const [data, onEvent] = useFlow(columnsFlow)
  return <ColumnsRole data={data} onEvent={onEvent} aria-label="컬럼" />
}
