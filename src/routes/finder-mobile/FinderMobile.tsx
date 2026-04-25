/** Finder — 모바일 전용 라우트 (`/m/finder/$`).
 *  데스크톱 `/finder/$`와 완전 별개. URL이 셸 dispatcher — JS runtime branching 없음.
 *
 *  iOS Files 식 drill-down 한 면:
 *  - path '/' (Home)         → 위치/즐겨찾기/최근 한 면
 *  - smart:*                 → 최근 그룹 항목 리스트
 *  - dir                     → 자식 리스트
 *  - file                    → Preview 한 장 (back 버튼으로 부모 폴더 복귀)
 */
import { useMemo, useSyncExternalStore } from 'react'
import { useNavigate, useParams } from '@tanstack/react-router'
import {
  Listbox, fromTree, navigateOnActivate, useControlState, type Event,
} from '../../ds'
import {
  getTree, subscribeTree, smartGroupOf, smartItems, walk, isSmartPath,
} from '../finder/data'
import { extToIcon, type FsNode, type SmartGroupItem } from '../finder/types'
import { Preview } from '../finder/Preview'
import { useSidebarNav } from '../finder/shared/useSidebarNav'

export function FinderMobile() {
  const navigate = useNavigate()
  const { _splat } = useParams({ strict: false }) as { _splat?: string }
  const raw = _splat ?? ''
  const path = isSmartPath(raw) ? raw : '/' + raw
  useSyncExternalStore(subscribeTree, getTree, getTree)

  const go = (p: string) =>
    navigate({ to: '/m/finder/$', params: { _splat: isSmartPath(p) ? p : p.replace(/^\//, '') } })

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
          <button type="button" aria-label="뒤로" onClick={() => go(parent!)}>‹</button>
        )}
        <h1>{title}</h1>
      </header>
      {path === '/'
        ? <Home current={path} onNavigate={go} />
        : smart
          ? <SmartList group={smart} items={smartItems(smart.id)} onNavigate={go} />
          : isFile && current
            ? <FullPreview node={current} />
            : current?.type === 'dir'
              ? <DirList node={current} onNavigate={go} />
              : <Empty />}
    </main>
  )
}

function Home({ current, onNavigate }: { current: string; onNavigate: (p: string) => void }) {
  const { recent, fav } = useSidebarNav(current, onNavigate)
  return (
    <section aria-roledescription="finder-home">
      <section>
        <h2>최근</h2>
        <Listbox data={recent.data} onEvent={recent.onEvent} aria-label="최근" />
      </section>
      <section>
        <h2>위치</h2>
        <Listbox data={fav.data} onEvent={fav.onEvent} aria-label="즐겨찾기" />
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
