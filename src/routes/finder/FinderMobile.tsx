/** Finder — 모바일 전용 셸.
 *  데스크톱의 sidebar | columns | preview 3열 메타포를 버리고
 *  iOS Files 식 drill-down 한 면(Locations → Folder → File)으로 재구성.
 *
 *  - path '/' (Home)         → 위치/즐겨찾기/최근 한 면
 *  - smart:*                 → 최근 그룹 항목 리스트
 *  - dir                     → 자식 리스트
 *  - file                    → 풀스크린 Preview
 */
import { useMemo } from 'react'
import { Listbox, fromTree, navigateOnActivate, useControlState, type Event } from '../../ds'
import {
  sidebar, smartGroups, smartGroupOf, smartItems, walk,
} from './data'
import { extToIcon, type FsNode, type SidebarItem, type SmartGroupItem } from './types'
import { Preview } from './Preview'

export function FinderMobile({ path, onNavigate }: { path: string; onNavigate: (p: string) => void }) {
  const smart = smartGroupOf(path)
  const chain = smart ? [] : walk(path)
  const current = smart ? null : chain[chain.length - 1] ?? null
  const isFile = current?.type === 'file'
  const parent = smart ? '/' : chain[chain.length - 2]?.path ?? null

  const title = useMemo(() => {
    if (path === '/') return '브라우즈'
    if (smart) return `최근 — ${smart.label}`
    return current?.name ?? '파일'
  }, [path, smart, current])

  return (
    <main aria-roledescription="finder-mobile" aria-label="Finder">
      <header>
        {parent !== null && (
          <button type="button" aria-label="뒤로" onClick={() => onNavigate(parent!)}>‹</button>
        )}
        <h1>{title}</h1>
      </header>
      {path === '/'
        ? <Home onNavigate={onNavigate} current={path} />
        : smart
          ? <SmartList group={smart} items={smartItems(smart.id)} onNavigate={onNavigate} />
          : isFile && current
            ? <FullPreview node={current} />
            : current?.type === 'dir'
              ? <DirList node={current} onNavigate={onNavigate} />
              : <Empty />}
    </main>
  )
}

function Home({ current, onNavigate }: { current: string; onNavigate: (p: string) => void }) {
  const recentBase = useMemo(
    () => fromTree(smartGroups, {
      getId: (g: SmartGroupItem) => g.path,
      toData: (g: SmartGroupItem) => ({ label: g.label, icon: g.icon, selected: g.path === current }),
      focusId: current,
    }),
    [current],
  )
  const favBase = useMemo(
    () => fromTree(sidebar, {
      getId: (s: SidebarItem) => s.path,
      toData: (s: SidebarItem) => ({ label: s.label, icon: s.icon, selected: s.path === current }),
      focusId: current,
    }),
    [current],
  )
  const [recent, dispatchRecent] = useControlState(recentBase)
  const [fav, dispatchFav] = useControlState(favBase)
  const handle = (data: typeof recent, dispatch: typeof dispatchRecent) => (e: Event) =>
    navigateOnActivate(data, e).forEach((ev) => {
      dispatch(ev)
      if (ev.type === 'activate') onNavigate(ev.id)
    })
  return (
    <section aria-roledescription="finder-home">
      <section>
        <h2>최근</h2>
        <Listbox data={recent} onEvent={handle(recent, dispatchRecent)} aria-label="최근" />
      </section>
      <section>
        <h2>위치</h2>
        <Listbox data={fav} onEvent={handle(fav, dispatchFav)} aria-label="즐겨찾기" />
      </section>
    </section>
  )
}

function DirList({ node, onNavigate }: { node: FsNode; onNavigate: (p: string) => void }) {
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

function SmartList({
  group, items, onNavigate,
}: { group: SmartGroupItem; items: FsNode[]; onNavigate: (p: string) => void }) {
  const base = useMemo(
    () => fromTree(items, {
      getId: (n: FsNode) => n.path,
      toData: (n: FsNode) => ({
        label: n.name,
        icon: extToIcon(n.ext),
      }),
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

function FullPreview({ node }: { node: FsNode }) {
  return (
    <section aria-roledescription="finder-file">
      <Preview node={node} />
    </section>
  )
}

function Empty({ note }: { note?: string } = {}) {
  return (
    <section aria-roledescription="finder-empty">
      <p>{note ?? '표시할 항목이 없습니다'}</p>
    </section>
  )
}

