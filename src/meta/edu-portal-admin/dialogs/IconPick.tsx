import { useMemo } from 'react'
import {
  Dialog, Listbox, useControlState, navigateOnActivate,
  ROOT, type Event, type NormalizedData,
} from '../../../ds'

const ICONS = ['💻', '🔧', '🛡', '🤖', '📘', '🎓', '📊', '🧠', '⚙️', '🌐']

export function IconPick({
  open, onClose, onPick,
}: { open: boolean; onClose: () => void; onPick: (icon: string) => void }) {
  const dialogData = useMemo(
    () => ({
      entities: { [ROOT]: { id: ROOT, data: { open, label: '아이콘 선택' } } },
      relationships: {},
    }),
    [open],
  )
  const onDialogEvent = (e: Event) => {
    if (e.type === 'open' && !e.open) onClose()
  }

  const base = useMemo<NormalizedData>(
    () => ({
      entities: {
        __root__: { id: '__root__', data: {} },
        ...Object.fromEntries(ICONS.map((ic) => [ic, { id: ic, data: { label: ic } }])),
      },
      relationships: { __root__: ICONS },
    }),
    [],
  )
  const [data, dispatch] = useControlState(base)
  const onListEvent = (e: Event) =>
    navigateOnActivate(data, e).forEach((ev) => {
      dispatch(ev)
      if (ev.type === 'activate') onPick(ev.id)
    })

  return (
    <Dialog data={dialogData} onEvent={onDialogEvent}>
      <article>
        <header><h2>아이콘 선택</h2></header>
        <Listbox data={data} onEvent={onListEvent} aria-label="아이콘" />
      </article>
    </Dialog>
  )
}
