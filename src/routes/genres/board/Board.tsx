import { useMemo, useState } from 'react'
import {
  Renderer, definePage, useControlState, navigateOnActivate,
  SidebarAdminFloating,
  type Event, type NormalizedData,
} from '@p/ds'
import { channels } from './data'
import { buildBoardPage } from './build'

function useChannelNav(active: string, setActive: (id: string) => void) {
  const base = useMemo<NormalizedData>(() => {
    const entities: Record<string, { id: string; data: Record<string, unknown> }> = {
      __root__: { id: '__root__', data: {} },
      __focus__: { id: '__focus__', data: { id: active } },
    }
    for (const c of channels) {
      entities[c.id] = {
        id: c.id,
        data: {
          label: `${c.type === 'private' ? '🔒' : '#'} ${c.name}`,
          badge: c.unread,
          selected: c.id === active,
        },
      }
    }
    return { entities, relationships: { __root__: channels.map((c) => c.id) } }
  }, [active])
  const [data, dispatch] = useControlState(base)
  const onEvent = (e: Event) =>
    navigateOnActivate(data, e).forEach((ev) => {
      dispatch(ev)
      if (ev.type === 'activate') setActive(ev.id)
    })
  return { data, onEvent }
}

export function Board() {
  const [active, setActive] = useState<string>('ds')
  const channelNav = useChannelNav(active, setActive)
  return (
    <>
      <Renderer page={definePage(buildBoardPage({ active, setActive, channelNav }))} />
      <SidebarAdminFloating
        id="board-channels-mobile"
        label="채널"
        tree={channelNav.data}
        onEvent={channelNav.onEvent}
        collection="listbox"
      />
    </>
  )
}
