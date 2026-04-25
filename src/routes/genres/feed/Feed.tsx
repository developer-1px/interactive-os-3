/** Social Feed — 타임라인 카드 + 반응. */
import { useMemo, useState } from 'react'
import {
  Renderer, definePage, useControlState, navigateOnActivate,
  type Event, type NormalizedData,
} from '../../../ds'
import { NAV } from './data'
import { buildFeedPage } from './build'

function useFeedNav() {
  const initialActive = NAV.find(([, , , , p]) => p)?.[0] ?? NAV[0][0]
  const [active, setActive] = useState<string>(initialActive)
  const base = useMemo<NormalizedData>(() => {
    const entities: Record<string, { id: string; data: Record<string, unknown> }> = {
      __root__: { id: '__root__', data: {} },
      __focus__: { id: '__focus__', data: { id: active } },
    }
    for (const [id, label, icon, content] of NAV) {
      entities[id] = { id, data: { label: content || label, icon, selected: id === active } }
    }
    return { entities, relationships: { __root__: NAV.map(([id]) => id) } }
  }, [active])
  const [data, dispatch] = useControlState(base)
  const onEvent = (e: Event) =>
    navigateOnActivate(data, e).forEach((ev) => {
      dispatch(ev)
      if (ev.type === 'activate') setActive(ev.id)
    })
  return { data, onEvent }
}

export function Feed() {
  const [liked, setLiked] = useState<Set<string>>(new Set())
  const toggle = (id: string) => setLiked((s) => { const n = new Set(s); if (n.has(id)) n.delete(id); else n.add(id); return n })
  const nav = useFeedNav()
  return <Renderer page={definePage(buildFeedPage({ liked, toggle, nav }))} />
}
