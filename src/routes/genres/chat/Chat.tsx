/** Chat — Slack 3열 (채널 · 스트림+composer · 멤버). */
import { useMemo, useState } from 'react'
import {
  Renderer, definePage, useControlState, navigateOnActivate,
  SidebarAdminFloating,
  type Event, type NormalizedData,
} from '../../../ds'
import { ROOT } from '../../../ds'
import { ACTS, INITIAL, channels, now, type Channel, type Msg } from './data'
import { buildChatPage } from './build'

const mainActionsBase = (): NormalizedData => ({
  entities: {
    __root__: { id: '__root__', data: {} },
    __focus__: { id: '__focus__', data: { id: 'aPin' } },
    ...Object.fromEntries(ACTS.map(([id, label, icon]) => [id, { id, data: { label, icon } }])),
  },
  relationships: { [ROOT]: ACTS.map(([id]) => id) as string[] },
})

const iconOf = (t: Channel['type']) => (t === 'dm' ? 'user' : t === 'private' ? 'lock' : 'hash')

function useChannelList(items: Channel[], active: string, setActive: (id: string) => void) {
  const base = useMemo<NormalizedData>(() => {
    const entities: Record<string, { id: string; data: Record<string, unknown> }> = {
      __root__: { id: '__root__', data: {} },
      __focus__: { id: '__focus__', data: { id: active } },
    }
    for (const c of items) {
      entities[c.id] = {
        id: c.id,
        data: { label: c.name, icon: iconOf(c.type), badge: c.unread, selected: c.id === active },
      }
    }
    return { entities, relationships: { __root__: items.map((c) => c.id) } }
  }, [active, items])

  const [data, dispatch] = useControlState(base)
  const onEvent = (e: Event) =>
    navigateOnActivate(data, e).forEach((ev) => {
      dispatch(ev)
      if (ev.type === 'activate') setActive(ev.id)
    })
  return { data, onEvent }
}

export function Chat() {
  const [active, setActive] = useState('ds')
  const [draft, setDraft] = useState('')
  const [stream, setStream] = useState<Record<string, Msg[]>>(INITIAL)
  const send = () => {
    const v = draft.trim(); if (!v) return
    setStream((s) => ({ ...s, [active]: [...(s[active] ?? []), { id: `m-${Date.now()}`, who: '나', time: now(), text: v, me: true }] }))
    setDraft('')
  }
  const pubs = useMemo(() => channels.filter((c) => c.type !== 'dm'), [])
  const dms = useMemo(() => channels.filter((c) => c.type === 'dm'), [])
  const pubNav = useChannelList(pubs, active, setActive)
  const dmNav = useChannelList(dms, active, setActive)
  const [mainActionsData, mainActionsDispatch] = useControlState(useMemo(mainActionsBase, []))
  const mainActions = { data: mainActionsData, onEvent: mainActionsDispatch }
  return (
    <>
      <Renderer
        page={definePage(
          buildChatPage({ active, draft, stream, setActive, setDraft, send, pubNav, dmNav, mainActions }),
        )}
      />
      <SidebarAdminFloating
        id="chat-channels-mobile"
        label="채널"
        tree={pubNav.data}
        onEvent={pubNav.onEvent}
        collection="listbox"
      />
    </>
  )
}
