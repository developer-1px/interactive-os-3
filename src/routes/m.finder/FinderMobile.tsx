/** Finder — 모바일 전용 라우트 (`/m/finder/$`).
 *  데스크톱 `/finder/$`와 완전 별개. URL이 셸 dispatcher — JS runtime branching 없음.
 *
 *  iOS Files 식 drill-down 한 면:
 *  - path '/' (Home)         → 위치/즐겨찾기/최근 한 면
 *  - smart:*                 → 최근 그룹 항목 리스트
 *  - dir                     → 자식 리스트
 *  - file                    → Preview 한 장 (back 버튼으로 부모 폴더 복귀)
 */
import { useLayoutEffect, useMemo, useRef, useSyncExternalStore } from 'react'
import { useNavigate, useParams } from '@tanstack/react-router'
import {
  Listbox, fromTree, navigateOnActivate, useControlState, type Event,
  Renderer, definePage, ROOT, type NormalizedData,
} from '../../ds'
import {
  getTree, subscribeTree, smartGroupOf, smartItems, walk, isSmartPath,
  formatDate, formatSize,
} from '../finder/data'
import { extToIcon, type FsNode, type SmartGroupItem } from '../finder/types'
import { PreviewBody } from '../finder/Preview'
import { useSidebarNav } from '../finder/useSidebarNav'

/**
 * /m/finder shell — FlatLayout 셸 + FinderMobileBody Ui leaf.
 * 본문(useSyncExternalStore·swipe FSM)은 별도 PR에서 useResource 패턴으로 정련 예정.
 */
export function FinderMobile() {
  const page: NormalizedData = useMemo(() => definePage({
    entities: {
      [ROOT]: { id: ROOT, data: {} },
      body: { id: 'body', data: { type: 'Ui', component: 'FinderMobileBody' } },
    },
    relationships: { [ROOT]: ['body'] },
  }), [])
  return <Renderer page={page} localRegistry={{ FinderMobileBody }} />
}

export function FinderMobileBody() {
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
  const parentNode = chain[chain.length - 2] ?? null
  const parent = smart ? '/' : parentNode?.path ?? null
  const siblings = useMemo(
    () => (isFile && parentNode?.children
      ? parentNode.children.filter((n) => n.type === 'file')
      : []),
    [isFile, parentNode],
  )

  const title = useMemo(() => {
    if (path === '/') return '브라우즈'
    if (smart) return `최근 — ${smart.label}`
    return current?.name ?? '파일'
  }, [path, smart, current])

  return (
    <main data-part="finder-mobile" aria-label="Finder">
      {!isFile && (
        <header>
          {parent !== null && (
            <button type="button" aria-label="뒤로" onClick={() => go(parent!)}>‹</button>
          )}
          <h1>{title}</h1>
        </header>
      )}
      {path === '/'
        ? <Home />
        : smart
          ? <SmartList group={smart} items={smartItems(smart.id)} onNavigate={go} />
          : isFile && current
            ? (
              <FilesSwiper
                files={siblings.length ? siblings : [current]}
                initialPath={current.path}
                onBack={parent !== null ? () => go(parent!) : undefined}
              />
            )
            : current?.type === 'dir'
              ? <DirList node={current} onNavigate={go} />
              : <Empty />}
    </main>
  )
}

function Home() {
  const { recent, fav } = useSidebarNav()
  return (
    <section data-part="finder-home">
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
    <section data-part="finder-dir">
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
    <section data-part="finder-smart">
      <Listbox data={data} onEvent={onEvent} aria-label={group.label} />
    </section>
  )
}

/** TikTok식 세로 스냅 스와이퍼 — 형제 파일을 한 화면씩 풀-블리드로 쌓는다.
 *  스크롤은 CSS scroll-snap이 담당. JS는 진입 시 현재 파일로 1회 점프만 한다(클릭 driven).
 *  IO/scroll로 URL을 동기화하지 않는다 — 덜그덕 방지 (memory: feedback_mobile_js_boundary).
 *  스타일은 panes.ts `[data-part="finder-tiktok|finder-file|finder-tiktok-*"]`. */
function FilesSwiper({
  files, initialPath, onBack,
}: { files: FsNode[]; initialPath: string; onBack?: () => void }) {
  const ref = useRef<HTMLElement>(null)
  useLayoutEffect(() => {
    const root = ref.current
    if (!root) return
    const target = root.querySelector(
      `[data-path="${CSS.escape(initialPath)}"]`,
    ) as HTMLElement | null
    target?.scrollIntoView({ block: 'start' })
  }, [initialPath])
  return (
    <section ref={ref} data-part="finder-tiktok">
      {files.map((f) => (
        <article
          key={f.path}
          data-path={f.path}
          data-part="finder-file"
          aria-label={f.name}
        >
          <figure data-part="preview-fill">
            <PreviewBody node={f} />
          </figure>

          <header data-part="finder-tiktok-top">
            {onBack && (
              <button type="button" data-icon="chevron-left" aria-label="뒤로" onClick={onBack} />
            )}
            <strong title={f.name}>{f.name}</strong>
          </header>

          <aside data-part="finder-tiktok-bottom" aria-label={`${f.name} 정보`}>
            <mark data-tone="info">{(f.ext ?? 'file').toUpperCase()}</mark>
            {f.size != null && <small>{formatSize(f.size)}</small>}
            {f.mtime && <small>{formatDate(f.mtime)}</small>}
            <small title={f.path}>{f.path}</small>
          </aside>
        </article>
      ))}
    </section>
  )
}

function Empty({ note }: { note?: string } = {}) {
  return (
    <section data-part="finder-empty">
      <p>{note ?? '표시할 항목이 없습니다'}</p>
    </section>
  )
}
