import { useMemo } from 'react'
import {
  Dialog, Listbox, useControlState, navigateOnActivate,
  type Event, type NormalizedData,
} from '../../../ds'
import { useDialog } from './_useDialog'

const ICONS = ['💻', '🔧', '🛡', '🤖', '📘', '🎓', '📊', '🧠', '⚙️', '🌐']

export function IconPick({
  open, onClose, onPick,
}: { open: boolean; onClose: () => void; onPick: (icon: string) => void }) {
  const { data: dialogData, onEvent: onDialogEvent } = useDialog(open, '아이콘 선택', onClose)

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
