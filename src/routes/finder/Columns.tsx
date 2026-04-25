import { useMemo, useSyncExternalStore } from 'react'
import {
  Columns as ColumnsRole,
  expandBranchOnActivate,
  fromTree,
  pathAncestors,
  parentOf,
  useControlState,
  ROOT,
  type Event,
} from '../../ds'
import { getTree, subscribeTree, walk } from './data'
import { extToIcon, type FsNode } from './types'

export function Columns({
  chain,
  rootPath = '/',
  onNavigate,
}: {
  chain: FsNode[]
  rootPath?: string
  onNavigate: (path: string) => void
}) {
  const currentPath = chain[chain.length - 1]?.path ?? '/'
  const tree = useSyncExternalStore(subscribeTree, getTree, getTree)
  const rootNode = useMemo(() => {
    if (rootPath === '/') return tree
    const c = walk(rootPath)
    return c[c.length - 1] ?? tree
  }, [rootPath, tree])
  const base = useMemo(
    () =>
      fromTree(rootNode.children ?? [], {
        getId: (n) => n.path,
        getKids: (n) => n.children,
        toData: (n) => ({
          label: n.name,
          icon: n.type === 'dir' ? 'dir' : extToIcon(n.ext),
          selected: n.path === currentPath,
        }),
        focusId: currentPath,
        expandedIds: pathAncestors(currentPath),
      }),
    [currentPath, rootNode],
  )
  const [data, dispatch] = useControlState(base)
  const onEvent = (raw: Event) =>
    expandBranchOnActivate(data, raw).forEach((e) => {
      if (e.type === 'typeahead') dispatch(e)
      else if (e.type === 'navigate' || e.type === 'activate') onNavigate(e.id)
      else if (e.type === 'expand') {
        const parent = parentOf(data, e.id)
        onNavigate(e.open ? e.id : !parent || parent === ROOT ? rootPath : parent)
      }
    })
  return <ColumnsRole data={data} onEvent={onEvent} aria-label="컬럼" />
}
