/** Finder — 모바일 전용 셸.
 *  데스크톱의 sidebar | columns | preview 3열 메타포를 버리고
 *  iOS Files 식 drill-down 한 면(Locations → Folder → File)으로 재구성.
 *
 *  - path '/' (Home)         → 위치/즐겨찾기/최근 한 면
 *  - smart:*                 → 최근 그룹 항목 리스트
 *  - dir                     → 자식 리스트
 *  - file                    → 형제 파일 vertical scroll-snap pager
 *                              (iOS Photos 식 — 진입 후 위/아래 스와이프로 이웃 이동)
 */
import { useEffect, useMemo, useRef } from 'react'
import { Listbox, fromTree, navigateOnActivate, useControlState, type Event } from '../../ds'
import { smartGroupOf, smartItems, walk } from './data'
import { extToIcon, type FsNode, type SmartGroupItem } from './types'
import { Preview } from './Preview'
import { useSidebarNav } from './shared/useSidebarNav'

export function FinderMobile({ path, onNavigate }: { path: string; onNavigate: (p: string) => void }) {
  const smart = smartGroupOf(path)
  const chain = smart ? [] : walk(path)
  const current = smart ? null : chain[chain.length - 1] ?? null
  const isFile = current?.type === 'file'
  const parentNode = smart ? null : chain[chain.length - 2] ?? null
  const parent = smart ? '/' : parentNode?.path ?? null
  const fileSiblings = useMemo(
    () => parentNode?.children?.filter((n) => n.type === 'file') ?? [],
    [parentNode],
  )

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
        ? <Home current={path} onNavigate={onNavigate} />
        : smart
          ? <SmartList group={smart} items={smartItems(smart.id)} onNavigate={onNavigate} />
          : isFile && current
            ? <FilePager siblings={fileSiblings} currentPath={current.path} onNavigate={onNavigate} />
            : current?.type === 'dir'
              ? <DirList node={current} onNavigate={onNavigate} />
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

/** FilePager — 같은 폴더의 파일 형제들을 vertical scroll-snap으로 쌓고
 *  진입 파일 위치로 자동 스크롤. 사용자 스냅 시 URL 동기화 (IntersectionObserver).
 *  외부 path 변경 시(헤더 뒤로 갔다 다시 들어옴 등)에만 scrollIntoView 재실행.
 *  윈도잉 — 현재 위치 ± WINDOW만 실제 Preview, 나머지는 스켈레톤(snap 유지). */
const PAGER_WINDOW = 3

function FilePager({
  siblings, currentPath, onNavigate,
}: { siblings: FsNode[]; currentPath: string; onNavigate: (p: string) => void }) {
  const rootRef = useRef<HTMLElement | null>(null)
  const lastEmittedRef = useRef<string | null>(null)
  const currentIndex = useMemo(
    () => siblings.findIndex((n) => n.path === currentPath),
    [siblings, currentPath],
  )

  useEffect(() => {
    if (lastEmittedRef.current === currentPath) return
    const root = rootRef.current
    if (!root) return
    const el = root.querySelector<HTMLElement>(`[data-path="${CSS.escape(currentPath)}"]`)
    el?.scrollIntoView({ block: 'start', behavior: 'auto' })
  }, [currentPath])

  useEffect(() => {
    const root = rootRef.current
    if (!root) return
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue
          const p = (e.target as HTMLElement).dataset.path
          if (p && p !== currentPath) {
            lastEmittedRef.current = p
            onNavigate(p)
          }
        }
      },
      { root, rootMargin: '0px 0px -80% 0px', threshold: 0 },
    )
    root.querySelectorAll<HTMLElement>('[data-path]').forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [siblings, currentPath, onNavigate])

  if (siblings.length === 0) return <Empty note="형제 파일 없음" />
  return (
    <section aria-roledescription="finder-pager" ref={rootRef as never}>
      {siblings.map((n, i) => {
        const within = currentIndex >= 0 && Math.abs(i - currentIndex) <= PAGER_WINDOW
        return (
          <article
            key={n.path}
            data-path={n.path}
            aria-current={n.path === currentPath ? 'page' : undefined}
          >
            {within
              ? <Preview node={n} />
              : <PagerStub node={n} />}
          </article>
        )
      })}
    </section>
  )
}

/** Pager skeleton — 윈도우 밖 형제. Preview 마운트 비용 없이 snap target만 유지. */
function PagerStub({ node }: { node: FsNode }) {
  return (
    <aside aria-roledescription="preview" aria-hidden="true">
      <header>
        <figure data-icon={extToIcon(node.ext)} aria-hidden />
        <div>
          <h2>{node.name}</h2>
          <p>{(node.ext ?? 'file').toUpperCase()}</p>
        </div>
      </header>
    </aside>
  )
}

function Empty({ note }: { note?: string } = {}) {
  return (
    <section aria-roledescription="finder-empty">
      <p>{note ?? '표시할 항목이 없습니다'}</p>
    </section>
  )
}
