/** finder.feature — 단일 spec 으로 finder 화면 전체 정의.
 *
 *  state    사용자 의도 (URL = url, fav 클릭 결과 = pinned, 보기 모드 = mode)
 *  on       (s, cmd) → s'  pure
 *  query    외부 데이터 = state 의 함수 (tree / 파일 텍스트 / 이미지)
 *  view     state + query → ViewModel { titlebar, sidebar, columns, preview }
 *  effect   외부 동기화 = state 의 함수 (URL navigate, focus)
 *
 *  proof: 아직 라우트에 wiring 되지 않음. /devtools/finder-feature 에서 단독 검증. */

import {
  defineFeature,
  fromTree,
  pathAncestors,
  type Effect,
  type QuerySpec,
} from '../../ds'
import {
  getTree, loadText, getImageUrl, sidebar as favItems, smartGroups, walk,
} from './data'
import type { FsNode, SmartGroupItem, SidebarItem, ViewMode } from './types'
import { extToIcon } from './types'

// ── Commands ────────────────────────────────────────────────────────────
type Cmd =
  | { type: 'goto';        to: string }
  | { type: 'pinFav';      id: string }
  | { type: 'setMode';     mode: ViewMode }
  | { type: 'activateCol'; id: string }
  | { type: 'expandCol';   id: string; open: boolean }
  | { type: 'activateRec'; id: string }
  | { type: 'back' }

// ── State ───────────────────────────────────────────────────────────────
interface FinderState {
  url: string
  pinned: string
  mode: ViewMode
}

const initial: FinderState = { url: '/', pinned: '/', mode: 'columns' }

// ── 헬퍼 ─────────────────────────────────────────────────────────────────
const parentPath = (p: string): string => {
  const i = p.lastIndexOf('/')
  return i <= 0 ? '/' : p.slice(0, i)
}

const isImagePath = (p: string): boolean =>
  /\.(png|jpe?g|gif|webp|avif|svg)$/i.test(p)

const isFilePath = (p: string): boolean => p !== '/' && !p.endsWith('/')

const buildColumns = (tree: FsNode | undefined, url: string, pinned: string) => {
  if (!tree) return { entities: {}, relationships: {} }
  const rootNode = pinned === '/' ? tree : (walk(pinned).at(-1) ?? tree)
  const c = walk(url)
  const cwd = c[c.length - 1]?.type === 'dir' ? c[c.length - 1] : c[c.length - 2] ?? tree
  return fromTree(rootNode.children ?? [], {
    getId: (n: FsNode) => n.path,
    getKids: (n: FsNode) => n.children,
    toData: (n: FsNode) => ({
      label: n.name,
      icon: n.type === 'dir' ? 'dir' : extToIcon(n.ext),
      selected: n.path === url,
    }),
    focusId: cwd?.path ?? url,
    expandedIds: pathAncestors(url),
  })
}

const buildRecent = (url: string) =>
  fromTree(smartGroups, {
    getId: (g: SmartGroupItem) => g.path,
    toData: (g: SmartGroupItem) => ({ label: g.label, icon: g.icon, selected: g.path === url }),
    focusId: url,
  })

const buildFav = (pinned: string) =>
  fromTree(favItems, {
    getId: (s: SidebarItem) => s.path,
    toData: (s: SidebarItem) => ({ label: s.label, icon: s.icon, selected: s.path === pinned }),
    focusId: pinned,
  })

const buildPreview = (
  url: string,
  tree: FsNode | undefined,
  text: string | null | undefined,
  image: string | null | undefined,
) => {
  if (!tree) return { kind: 'empty' as const }
  const node = walk(url).at(-1)
  if (!node) return { kind: 'empty' as const }
  if (node.type === 'dir') return { kind: 'dir' as const, node }
  if (isImagePath(url)) return { kind: 'image' as const, node, src: image ?? null }
  return { kind: 'text' as const, node, text: text ?? null }
}

// ── Feature ─────────────────────────────────────────────────────────────
export const finderFeature = defineFeature<FinderState, Cmd, {
  tree:  QuerySpec<FsNode>
  text:  QuerySpec<string | null>
  image: QuerySpec<string | null>
}, ReturnType<typeof viewFn>>({
  state: initial,

  on: {
    goto:        (s, { to })   => ({ ...s, url: to }),
    pinFav:      (s, { id })   => ({ ...s, pinned: id }),
    setMode:     (s, { mode }) => ({ ...s, mode }),
    activateCol: (s, { id })   => ({ ...s, url: id }),
    activateRec: (s, { id })   => ({ ...s, url: id }),
    expandCol:   (s, { id, open }) => ({ ...s, url: open ? id : parentPath(id) }),
    back:        (s) => {
      const chain = walk(s.url)
      const prev = chain[chain.length - 2]?.path ?? '/'
      return { ...s, url: prev }
    },
  },

  query: (s) => ({
    tree:  { key: ['finder', 'tree'],          fn: getTree },
    text:  { key: ['finder', 'text', s.url],   fn: () => loadText(s.url),         enabled: isFilePath(s.url) && !isImagePath(s.url) },
    image: { key: ['finder', 'image', s.url],  fn: () => getImageUrl(s.url) ?? null, enabled: isFilePath(s.url) && isImagePath(s.url) },
  }),

  view: viewFn,

  effect: (s): Effect[] => [
    { kind: 'title', text: `Finder · ${s.url}` },
    // URL 동기화는 라우트 레벨에서 처리 — TanStack router 경유.
    // (effect runtime 의 'navigate' 는 history.pushState 사용. router 와 충돌하므로 spec 에서는 제외.)
  ],
})

function viewFn(s: FinderState, q: {
  tree: { data: FsNode | undefined; isLoading: boolean; error: unknown }
  text: { data: string | null | undefined; isLoading: boolean; error: unknown }
  image: { data: string | null | undefined; isLoading: boolean; error: unknown }
}) {
  return {
    titlebar: { path: s.url, mode: s.mode, busy: q.text.isLoading || q.image.isLoading },
    sidebar: {
      recent: buildRecent(s.url),
      fav:    buildFav(s.pinned),
    },
    columns: buildColumns(q.tree.data, s.url, s.pinned),
    preview: buildPreview(s.url, q.tree.data, q.text.data, q.image.data),
  }
}

