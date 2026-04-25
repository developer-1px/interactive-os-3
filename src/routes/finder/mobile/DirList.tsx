import { useMemo } from 'react'
import { Listbox, fromTree, navigateOnActivate, useControlState, type Event } from '../../../ds'
import { extToIcon, type FsNode } from '../types'
import { Empty } from './Empty'

export function DirList({ node, onNavigate }: { node: FsNode; onNavigate: (p: string) => void }) {
  const kids = node.children ?? []
  const base = useMemo(
    () => fromTree(kids, {
      getId: (n: FsNode) => n.path,
      toData: (n: FsNode) => ({
        label: n.name,
        icon: n.type === 'dir' ? 'dir' : extToIcon(n.ext),
        badge: n.type === 'dir' ? n.children?.length ?? 0 : undefined,
      }),
    }),
    [kids],
  )
  const [data, dispatch] = useControlState(base)
  const onEvent = (e: Event) =>
    navigateOnActivate(data, e).forEach((ev) => {
      dispatch(ev)
      if (ev.type === 'activate') onNavigate(ev.id)
    })
  if (kids.length === 0) return <Empty note="비어있는 폴더" />
  return (
    <section aria-roledescription="finder-dir">
      <Listbox data={data} onEvent={onEvent} aria-label={node.name} />
    </section>
  )
}
