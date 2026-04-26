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
  ROOT,
  type NormalizedData,
  type QuerySpec,
} from '@p/ds'
import {
  getTree, loadText, getImageUrl, sidebar as favItems, smartGroups, walk,
  tagGroups, tagItems, isTagPath,
} from './data'
import { tagFromPath } from '@p/fs'
import type { FsNode, SmartGroupItem, SidebarItem, TagGroupItem, ViewMode } from '../entities/types'
import { extToIcon } from '../entities/types'

import type { FinderState, FinderCmd, PreviewVM } from '../entities/schema'
import type { FinderCmdType, FinderViewKey } from '../entities/spec'
export type { PreviewVM }

/** on 핸들러 타입 — spec.cmds 키 1:1 강제. 추가/삭제 시 양쪽 동시 변경 강제. */
type CmdReducers = {
  [K in FinderCmdType]: (s: FinderState, p: Extract<FinderCmd, { type: K }>) => FinderState
}

const todayPath = smartGroups[0]?.path ?? '/'
const initial: FinderState = { url: todayPath, pinned: todayPath, mode: 'columns', query: '' }

// ── 헬퍼 ─────────────────────────────────────────────────────────────────
const parentPath = (p: string): string => {
  const i = p.lastIndexOf('/')
  return i <= 0 ? '/' : p.slice(0, i)
}

const isImagePath = (p: string): boolean =>
  /\.(png|jpe?g|gif|webp|avif|svg)$/i.test(p)

const isFilePath = (p: string): boolean => p !== '/' && !p.endsWith('/')

const buildColumns = (tree: FsNode | undefined, url: string, pinned: string) => {
  // Tag 가상 폴더 — pinned가 tag path면 frontmatter 인덱스 기반 flat file list.
  if (isTagPath(pinned)) {
    const tag = tagFromPath(pinned)
    const files = tag ? tagItems(tag) : []
    return fromTree(files, {
      getId: (n: FsNode) => n.path,
      toData: (n: FsNode) => ({
        label: n.name,
        icon: extToIcon(n.ext),
        selected: n.path === url,
      }),
      focusId: url === pinned ? (files[0]?.path ?? url) : url,
    })
  }
  if (!tree) return { entities: {}, relationships: {} }
  const rootNode = pinned === '/' ? tree : (walk(pinned).at(-1) ?? tree)
  return fromTree(rootNode.children ?? [], {
    getId: (n: FsNode) => n.path,
    getKids: (n: FsNode) => n.children,
    toData: (n: FsNode) => ({
      label: n.name,
      icon: n.type === 'dir' ? 'dir' : extToIcon(n.ext),
      selected: n.path === url,
    }),
    focusId: url,
    expandedIds: pathAncestors(url),
  })
}

const buildTags = (pinned: string) => {
  const tags = tagGroups()
  return fromTree(tags, {
    getId: (g: TagGroupItem) => g.path,
    toData: (g: TagGroupItem) => ({
      label: `${g.label} (${g.count})`,
      icon: g.icon,
      selected: g.path === pinned,
    }),
    focusId: matchOrFirst(tags, pinned, (g) => g.path),
  })
}

// Listbox tabIndex={focusId===id?0:-1} — focusId가 어떤 항목과도 매칭 안 되면
// Tab 진입 자체가 막혀 키보드 nav 가 죽는다. 매칭되지 않을 땐 첫 항목으로 fallback.
const matchOrFirst = <T,>(items: T[], pinned: string, getId: (x: T) => string): string | undefined => {
  const hit = items.find((x) => getId(x) === pinned)
  return hit ? getId(hit) : (items[0] ? getId(items[0]) : undefined)
}

const buildRecent = (pinned: string) =>
  fromTree(smartGroups, {
    getId: (g: SmartGroupItem) => g.path,
    toData: (g: SmartGroupItem) => ({ label: g.label, icon: g.icon, selected: g.path === pinned }),
    focusId: matchOrFirst(smartGroups, pinned, (g) => g.path),
  })

const buildFav = (pinned: string) =>
  fromTree(favItems, {
    getId: (s: SidebarItem) => s.path,
    toData: (s: SidebarItem) => ({ label: s.label, icon: s.icon, selected: s.path === pinned }),
    focusId: matchOrFirst(favItems, pinned, (s) => s.path),
  })

const VIEW_MODES: { id: ViewMode; label: string; icon: string }[] = [
  { id: 'icons',   label: '아이콘',  icon: 'grid' },
  { id: 'list',    label: '리스트',  icon: 'list' },
  { id: 'columns', label: '컬럼',    icon: 'columns' },
  { id: 'gallery', label: '갤러리',  icon: 'image' },
]

const buildToolbar = (mode: ViewMode): NormalizedData => ({
  entities: {
    [ROOT]: { id: ROOT, data: {} },
    ...Object.fromEntries(VIEW_MODES.map((m) => [m.id, {
      id: m.id,
      data: { label: m.label, icon: m.icon, pressed: mode === m.id },
    }])),
  },
  relationships: { [ROOT]: VIEW_MODES.map((m) => m.id) },
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
export const finderFeature = defineFeature<FinderState, FinderCmd, {
  tree:  QuerySpec<FsNode>
  text:  QuerySpec<string | null>
  image: QuerySpec<string | null>
}, ReturnType<typeof viewFn>>({
  state: initial,

  on: {
    goto:        (s, { to })   => ({ ...s, url: to }),
    pinFav:      (s, { id })   => ({ ...s, pinned: id, url: id }),
    setMode:     (s, { mode }) => ({ ...s, mode }),
    setQuery:    (s, { q })    => ({ ...s, query: q }),
    activateCol: (s, { id })   => ({ ...s, url: id }),
    activateRec: (s, { id })   => ({ ...s, pinned: id, url: id }),
    expandCol:   (s, { id, open }) => ({ ...s, url: open ? id : parentPath(id) }),
    back:        (s) => {
      const chain = walk(s.url)
      const prev = chain[chain.length - 2]?.path ?? '/'
      return { ...s, url: prev }
    },
  } satisfies CmdReducers,

  query: (s) => ({
    tree:  { key: ['finder', 'tree'],          fn: getTree },
    text:  { key: ['finder', 'text', s.url],   fn: () => loadText(s.url),         enabled: isFilePath(s.url) && !isImagePath(s.url) },
    image: { key: ['finder', 'image', s.url],  fn: () => getImageUrl(s.url) ?? null, enabled: isFilePath(s.url) && isImagePath(s.url) },
  }),

  view: viewFn,
})

/** view 반환 키는 FinderViewSpec 키와 1:1. 누락/잉여 시 타입 에러. */
type ViewOut = Record<FinderViewKey, unknown>

function viewFn(s: FinderState, q: {
  tree: { data: FsNode | undefined; isLoading: boolean; error: unknown }
  text: { data: string | null | undefined; isLoading: boolean; error: unknown }
  image: { data: string | null | undefined; isLoading: boolean; error: unknown }
}): ViewOut {
  return {
    titlebar: { path: s.url, mode: s.mode, query: s.query, busy: q.text.isLoading || q.image.isLoading },
    toolbar: buildToolbar(s.mode),
    sidebar: {
      recent: buildRecent(s.pinned),
      fav:    buildFav(s.pinned),
      tags:   buildTags(s.pinned),
    },
    columns: buildColumns(q.tree.data, s.url, s.pinned),
    preview: buildPreview(s.url, q.tree.data, q.text.data, q.image.data),
  }
}

