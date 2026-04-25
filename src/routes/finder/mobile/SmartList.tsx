import { useMemo } from 'react'
import { Listbox, fromTree, navigateOnActivate, useControlState, type Event } from '../../../ds'
import { extToIcon, type FsNode, type SmartGroupItem } from '../types'
import { Empty } from './Empty'

export function SmartList({
  group, items, onNavigate,
}: { group: SmartGroupItem; items: FsNode[]; onNavigate: (p: string) => void }) {
  const base = useMemo(
    () => fromTree(items, {
      getId: (n: FsNode) => n.path,
      toData: (n: FsNode) => ({ label: n.name, icon: extToIcon(n.ext) }),
    }),
    [items],
  )
  const [data, dispatch] = useControlState(base)
  const onEvent = (e: Event) =>
    navigateOnActivate(data, e).forEach((ev) => {
      dispatch(ev)
      if (ev.type === 'activate') onNavigate(ev.id)
    })
  if (items.length === 0) return <Empty note={`${group.label}에 항목 없음`} />
  return (
    <section aria-roledescription="finder-smart">
      <Listbox data={data} onEvent={onEvent} aria-label={group.label} />
    </section>
  )
}
