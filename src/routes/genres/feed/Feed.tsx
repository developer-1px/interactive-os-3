/** Social Feed — 타임라인 카드 + 반응. */
import { useMemo, useState } from 'react'
import {
  Renderer, definePage, useControlState, navigateOnActivate, ROOT,
  SidebarAdminFloating,
  type Event, type NormalizedData,
} from '../../../ds'
import { NAV, POSTS } from './data'
import { buildFeedPage } from './build'

const feedTabsBase = (): NormalizedData => ({
  entities: {
    [ROOT]: { id: ROOT, data: {} },
    __focus__: { id: '__focus__', data: { id: 'tabAll' } },
    tabAll: { id: 'tabAll', data: { label: '전체', content: '전체', pressed: true } },
    tabFol: { id: 'tabFol', data: { label: '팔로잉', content: '팔로잉' } },
    tabFav: { id: 'tabFav', data: { label: '인기', content: '인기' } },
  },
  relationships: { [ROOT]: ['tabAll', 'tabFol', 'tabFav'] },
})

const rxnBase = (postId: string, likes: number, comments: number, shared: number, liked: boolean): NormalizedData => ({
  entities: {
    [ROOT]: { id: ROOT, data: {} },
    __focus__: { id: '__focus__', data: { id: `rxLike-${postId}` } },
    [`rxLike-${postId}`]:  { id: `rxLike-${postId}`,  data: { label: '좋아요', icon: 'heart', pressed: liked, content: String(likes + (liked ? 1 : 0)) } },
    [`rxCom-${postId}`]:   { id: `rxCom-${postId}`,   data: { label: '댓글', icon: 'message-circle', content: String(comments) } },
    [`rxShare-${postId}`]: { id: `rxShare-${postId}`, data: { label: '공유', icon: 'share', content: String(shared) } },
  },
  relationships: { [ROOT]: [`rxLike-${postId}`, `rxCom-${postId}`, `rxShare-${postId}`] },
})

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

function useRxn(postId: string, likes: number, comments: number, shared: number, liked: boolean, onToggle: () => void) {
  const base = useMemo(() => rxnBase(postId, likes, comments, shared, liked), [postId, likes, comments, shared, liked])
  const [data, dispatch] = useControlState(base)
  const onEvent = (e: Event) => {
    dispatch(e)
    if (e.type === 'activate' && e.id === `rxLike-${postId}`) onToggle()
  }
  return { data, onEvent }
}

export function Feed() {
  const [liked, setLiked] = useState<Set<string>>(new Set())
  const toggle = (id: string) => setLiked((s) => { const n = new Set(s); if (n.has(id)) n.delete(id); else n.add(id); return n })
  const nav = useFeedNav()
  const [feedTabsData, feedTabsDispatch] = useControlState(useMemo(feedTabsBase, []))
  const feedTabs = { data: feedTabsData, onEvent: feedTabsDispatch }
  const rxn: Record<string, { data: NormalizedData; onEvent: (e: Event) => void }> = {}
  for (const p of POSTS) {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    rxn[p.id] = useRxn(p.id, p.likes, p.comments, p.shared, liked.has(p.id), () => toggle(p.id))
  }
  return (
    <>
      <Renderer page={definePage(buildFeedPage({ liked, toggle, nav, feedTabs, rxn }))} />
      <SidebarAdminFloating
        id="feed-nav-mobile"
        label="피드 내비게이션"
        tree={nav.data}
        onEvent={nav.onEvent}
        collection="listbox"
      />
    </>
  )
}
