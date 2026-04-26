/**
 * /content — prose 시맨틱 태그 전수 검증 페이지.
 *
 * 좌측 sidebar(HTML 카탈로그 + ARIA 카탈로그) + 우측 article.
 * sidebar는 ds/widgets/sidebar (sidebarAdmin) 위에서 Renderer로 렌더한다 —
 * 라우트가 직접 nav fragment를 쌓지 않는다 (canonical sidebar widget 원칙).
 *
 * Sidebar 클릭 → onEvent activate → 본문 anchor 위치로 scrollIntoView.
 * (Tree가 아직 href 모드를 지원하지 않아 옵션 B 사용 — 키보드/스크린리더 호환은
 * Tree 자체의 roving + activate 축으로 처리.)
 */
import { useMemo } from 'react'
import {
  Renderer, definePage, sidebarAdmin, useControlState, navigateOnActivate,
  ROOT, EXPANDED, type Event, type NormalizedData,
} from '../../ds'
import { ProseSample } from './sample'

const HTML_GROUPS: { id: string; label: string }[] = [
  { id: 'html-sectioning',  label: 'Sectioning' },
  { id: 'html-heading',     label: 'Heading' },
  { id: 'html-text',        label: 'Text-level' },
  { id: 'html-list',        label: 'Lists' },
  { id: 'html-block',       label: 'Block' },
  { id: 'html-table',       label: 'Table' },
  { id: 'html-media',       label: 'Embedded & Media' },
  { id: 'html-interactive', label: 'Interactive' },
]

const ARIA_GROUPS: { id: string; label: string }[] = [
  { id: 'aria-landmark',   label: 'Landmark' },
  { id: 'aria-document',   label: 'Document' },
  { id: 'aria-widget',     label: 'Widget' },
  { id: 'aria-live',       label: 'Live region' },
  { id: 'aria-window',     label: 'Window' },
  { id: 'aria-abstract',   label: 'Abstract' },
  { id: 'aria-attributes', label: 'Attributes' },
]

function buildCatalogTree(): NormalizedData {
  const entities: NormalizedData['entities'] = {
    [ROOT]: { id: ROOT, data: {} },
    'g-html': { id: 'g-html', data: { label: 'HTML semantics', kind: 'group', disabled: true } },
    'g-aria': { id: 'g-aria', data: { label: 'ARIA roles', kind: 'group', disabled: true } },
  }
  const relationships: NormalizedData['relationships'] = {
    [ROOT]: ['g-html', 'g-aria'],
    'g-html': HTML_GROUPS.map((g) => g.id),
    'g-aria': ARIA_GROUPS.map((g) => g.id),
  }
  for (const g of [...HTML_GROUPS, ...ARIA_GROUPS]) {
    entities[g.id] = { id: g.id, data: { label: g.label } }
  }
  // 기본은 그룹 펼친 상태(group은 평탄 렌더지만 일관성 있게 시드).
  entities[EXPANDED] = { id: EXPANDED, data: { ids: [] } }
  return { entities, relationships }
}

function scrollToAnchor(id: string) {
  if (typeof document === 'undefined') return
  const el = document.getElementById(id)
  if (!el) return
  el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  // history 업데이트 — 북마크/뒤로가기 호환.
  if (typeof history !== 'undefined') history.replaceState(null, '', `#${id}`)
}

export function Content() {
  const tree0 = useMemo(buildCatalogTree, [])
  const [tree, dispatch] = useControlState(tree0)

  const onEvent = (e: Event) => {
    navigateOnActivate(tree, e).forEach((ev) => {
      dispatch(ev)
      if (ev.type === 'activate') scrollToAnchor(ev.id)
    })
  }

  const sidebarPage = useMemo(() => {
    const frag = sidebarAdmin({
      id: 'content-sidebar',
      label: 'Content catalog',
      tree,
      onEvent,
      width: 260,
    })
    // sidebarAdmin은 root 없는 fragment — ROOT를 wrapping해서 Renderer가 sidebar Nav부터 그릴 수 있게.
    return definePage({
      entities: { [ROOT]: { id: ROOT, data: {} }, ...frag.entities },
      relationships: { [ROOT]: ['content-sidebar'], ...frag.relationships },
    })
  }, [tree])

  return (
    <div data-ds="Row" style={{ minBlockSize: '100dvh', alignItems: 'stretch' }}>
      <Renderer page={sidebarPage} />
      <main data-flow="list" style={{ flex: '1 1 0', minInlineSize: 0, overflow: 'auto' }}>
        <article data-flow="prose">
          <ProseSample />
        </article>
      </main>
    </div>
  )
}
