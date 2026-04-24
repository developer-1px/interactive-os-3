import { useMemo } from 'react'
import {
  Columns as ColumnsRole,
  fromTree,
  pathAncestors,
  parentOf,
  useControlState,
  ROOT,
  type Event,
} from '../controls'
import { tree } from './data'
import { extToIcon, type FsNode } from './types'

export function Columns({
  chain,
  onNavigate,
}: {
  chain: FsNode[]
  onNavigate: (path: string) => void
}) {
  const currentPath = chain[chain.length - 1]?.path ?? '/'
  const base = useMemo(
    () =>
      fromTree(tree.children ?? [], {
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
    [currentPath],
  )
  const [data, dispatch] = useControlState(base)
  const onEvent = (e: Event) => {
    if (e.type === 'typeahead') dispatch(e)
    else if (e.type === 'navigate' || e.type === 'activate') onNavigate(e.id)
    else if (e.type === 'expand') {
      const parent = parentOf(data, e.id)
      onNavigate(e.open ? e.id : !parent || parent === ROOT ? '/' : parent)
    }
  }
  return <ColumnsRole data={data} onEvent={onEvent} aria-label="컬럼" />
}
