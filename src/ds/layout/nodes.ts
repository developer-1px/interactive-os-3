/**
 * FlatLayout node vocabulary.
 *
 * Design: data-driven page layout — `definePage({ entities, relationships })`
 * is consumed by <Renderer>. Each entity's `data.type` selects a renderer.
 *
 * Containers:  Row | Column | Grid | Aside | Section | Header | Footer
 * Leaves:      Ui  | Text
 *
 * Item-level placement (on node.data):
 *   grow?:  true        → flex:1 minWidth:0 (via [data-ds-grow])
 *   width?: number|string → flex:none + style.inlineSize (explicit, declarative)
 *   align?: 'start'|'center'|'end'|'stretch' → align-self via [data-ds-align]
 *
 * Container attrs mirror ds/css/layout.ts vocabulary:
 *   flow?:     'list'|'cluster'|'form'|'prose'|'split'
 *   emphasis?: 'flat'|'raised'|'sunk'|'callout'
 *   cols?:     1|2|3|4|6|12  (Grid only)
 */
import type { CSSProperties, ReactNode } from 'react'
import type { Entity, NormalizedData } from '../core/types'
import type { UiComponentName } from './registry'

export type Flow = 'list' | 'cluster' | 'form' | 'prose' | 'split'
export type Emphasis = 'flat' | 'raised' | 'sunk' | 'callout'
export type GridCols = 1 | 2 | 3 | 4 | 6 | 12
export type TextVariant = 'h1' | 'h2' | 'h3' | 'h4' | 'body' | 'muted' | 'small' | 'strong'
export type Align = 'start' | 'center' | 'end' | 'stretch'

export type NodeType =
  | 'Row' | 'Column' | 'Grid'
  | 'Main' | 'Nav' | 'Aside' | 'Section' | 'Header' | 'Footer'
  | 'Ui' | 'Text'

export interface ItemPlacement {
  grow?: boolean
  width?: number | string
  /** 가로 상한. 부모 폭이 더 크면 max-inline-size 로 잘리고 자동 가운데 정렬.
   *  레이아웃 책임 — content widget 이 직접 가운데 정렬하지 않게 하기 위한 1차 primitive. */
  maxWidth?: number | string
  align?: Align
  /** 정사각형 등 비율 고정. 'square' = 1/1. width만 주고 high 자동 도출하고 싶을 때. */
  aspect?: 'square' | number
}

export interface CommonNodeData extends ItemPlacement {
  type: NodeType
  label?: string
  labelledBy?: string
  roledescription?: string
  /** Native `hidden` attribute. Keeps node in DOM but removes from render. */
  hidden?: boolean
  /** Container 자식의 정렬 — place-content + place-items 묶음.
   *  flex/grid 컨테이너에서 자식들을 시작/중앙/끝/늘림으로 정렬한다.
   *  콘텐츠가 컨테이너보다 작을 때만 visible — 넘치면 자연 스크롤. */
  place?: Align
}

export interface RowNode extends CommonNodeData {
  type: 'Row'
  flow?: Flow
  emphasis?: Emphasis
}
export interface ColumnNode extends CommonNodeData {
  type: 'Column'
  flow?: Flow
  emphasis?: Emphasis
}
export interface GridNode extends CommonNodeData {
  type: 'Grid'
  cols?: GridCols
  flow?: Flow
  emphasis?: Emphasis
  /** Card 슬롯 row track owner — 자식 article[data-part="card"]가 subgrid로 상속받는다. */
  cardGrid?: boolean
}
export interface AsideNode extends CommonNodeData {
  type: 'Aside'
  flow?: Flow
  emphasis?: Emphasis
}
/** Page main landmark. Renders <main role=main>. 페이지당 1개. */
export interface MainNode extends CommonNodeData {
  type: 'Main'
  flow?: Flow
  emphasis?: Emphasis
}
/** Navigation landmark. Renders <nav role=navigation>. */
export interface NavNode extends CommonNodeData {
  type: 'Nav'
  flow?: Flow
  emphasis?: Emphasis
}
export interface SectionNode extends CommonNodeData {
  type: 'Section'
  heading?: { variant?: TextVariant; content: string }
  flow?: Flow
  emphasis?: Emphasis
}
export interface HeaderNode extends CommonNodeData {
  type: 'Header'
  flow?: Flow
}
export interface FooterNode extends CommonNodeData {
  type: 'Footer'
  flow?: Flow
}
export interface UiNode extends CommonNodeData {
  type: 'Ui'
  /** registry.ts 의 키만 허용 — 미등록/오타는 빌드 에러. */
  component: UiComponentName
  props?: Record<string, unknown>
  /** Optional children rendered as ReactNode passthrough (e.g. Select options). */
  content?: ReactNode
}
export interface TextNode extends CommonNodeData {
  type: 'Text'
  variant?: TextVariant
  content: ReactNode
}

export type AnyNode =
  | RowNode | ColumnNode | GridNode
  | MainNode | NavNode | AsideNode | SectionNode | HeaderNode | FooterNode
  | UiNode | TextNode

export type TypedEntity<T extends AnyNode = AnyNode> = Entity & { data: T }

/** Build a <Renderer>-compatible page (wraps entities/relationships passthrough). */
export function node<T extends AnyNode>(id: string, data: T): TypedEntity<T> {
  return { id, data }
}

/** Compute inline style + data attributes for a node (grow/width/align/aspect + container vars). */
export function placementAttrs(d: Partial<CommonNodeData>): {
  style?: CSSProperties
  'data-ds-grow'?: 'true'
  'data-ds-width'?: ''
  'data-ds-narrow'?: ''
  'data-ds-align'?: Align
  'data-ds-place'?: Align
  'data-ds-aspect'?: 'square' | string
} {
  const out: ReturnType<typeof placementAttrs> = {}
  const style: CSSProperties = {}
  if (d.grow) out['data-ds-grow'] = 'true'
  if (d.width !== undefined) {
    out['data-ds-width'] = ''
    style.inlineSize = typeof d.width === 'number' ? `${d.width}px` : d.width
  }
  if (d.maxWidth !== undefined) {
    out['data-ds-narrow'] = ''
    style.maxInlineSize = typeof d.maxWidth === 'number' ? `${d.maxWidth}px` : d.maxWidth
  }
  if (d.align) out['data-ds-align'] = d.align
  if (d.place) out['data-ds-place'] = d.place
  if (d.aspect !== undefined) {
    out['data-ds-aspect'] = d.aspect === 'square' ? 'square' : String(d.aspect)
  }
  if (Object.keys(style).length > 0) out.style = style
  return out
}

/**
 * Fragment kind — defineLayout vs defineWidget 의 시맨틱 경계를 코드로 강제.
 *
 * - `'layout'`: 페이지 시각 골격 + 슬롯. Nav/Aside/Ui 금지 (widget·component 영역).
 *   Main/Header/Footer 는 page-level 구조 landmark 로 허용.
 * - `'widget'`: landmark 1개 이상을 owner 로 가져야 한다 (Nav/Aside/Header/Footer/Main).
 */
export type FragmentKind = 'layout' | 'widget'

const LAYOUT_FORBIDDEN: NodeType[] = ['Nav', 'Aside', 'Ui']
const WIDGET_LANDMARKS: NodeType[] = ['Nav', 'Aside', 'Header', 'Footer', 'Main']

/**
 * Fragment validation — same rules as validatePage but skips the `__root__`
 * reachability check. Used by defineWidget/defineLayout (sub-trees).
 *
 * `kind` 가 주어지면 해당 fragment 의 시맨틱 경계도 함께 검사한다.
 */
export function validateFragment(frag: NormalizedData, kind?: FragmentKind): void {
  if (typeof window === 'undefined') return
  const { entities, relationships } = frag
  const issues: string[] = []
  const types: NodeType[] = []
  for (const [id, e] of Object.entries(entities)) {
    const t = (e?.data as { type?: string } | undefined)?.type
    if (!t) {
      // ROOT 는 type 없음 — fragment 가 페이지 셸일 때 정상.
      if (id !== '__root__') issues.push(`entity "${id}" missing data.type`)
      continue
    }
    const known: NodeType[] = ['Row','Column','Grid','Main','Nav','Aside','Section','Header','Footer','Ui','Text']
    if (!known.includes(t as NodeType)) {
      issues.push(`entity "${id}" unknown type "${t}"`)
      continue
    }
    types.push(t as NodeType)
    if (kind === 'layout' && LAYOUT_FORBIDDEN.includes(t as NodeType)) {
      issues.push(`layout fragment must not contain "${t}" (entity "${id}") — Nav/Aside는 widget이, Ui는 component가 소유한다`)
    }
  }
  if (kind === 'widget' && !types.some((t) => WIDGET_LANDMARKS.includes(t))) {
    issues.push('widget fragment requires at least one landmark (Nav/Aside/Header/Footer/Main)')
  }
  // Cycle 검사만 — fragment 의 missing child 는 슬롯 placeholder 라 정상이다 (merge 로 채워짐).
  const seen = new Set<string>()
  const stack = new Set<string>()
  const walk = (id: string): void => {
    if (stack.has(id)) { issues.push(`cycle at "${id}"`); return }
    if (seen.has(id)) return
    seen.add(id); stack.add(id)
    for (const c of relationships[id] ?? []) {
      if (!entities[c]) continue // 슬롯 — merge 로 채워질 외부 id
      walk(c)
    }
    stack.delete(id)
  }
  for (const id of Object.keys(entities)) walk(id)
  if (issues.length) {
    // eslint-disable-next-line no-console
    console.warn('[FlatLayout fragment]', issues)
  }
}

/** Dev-time validation — orphans, cycles, unknown node types. Warns, never throws. */
export function validatePage(page: NormalizedData): void {
  if (typeof window === 'undefined') return
  const { entities, relationships } = page
  const issues: string[] = []

  // unknown types
  for (const [id, e] of Object.entries(entities)) {
    const t = (e?.data as { type?: string } | undefined)?.type
    if (!t) {
      if (id !== '__root__') issues.push(`entity "${id}" missing data.type`)
      continue
    }
    const known: NodeType[] = ['Row','Column','Grid','Main','Nav','Aside','Section','Header','Footer','Ui','Text']
    if (!known.includes(t as NodeType)) issues.push(`entity "${id}" unknown type "${t}"`)
  }
  // cycle detection
  const seen = new Set<string>()
  const stack = new Set<string>()
  const walk = (id: string): boolean => {
    if (stack.has(id)) { issues.push(`cycle at "${id}"`); return true }
    if (seen.has(id)) return false
    seen.add(id); stack.add(id)
    for (const c of relationships[id] ?? []) {
      if (!entities[c]) { issues.push(`missing child "${c}" (parent "${id}")`); continue }
      walk(c)
    }
    stack.delete(id)
    return false
  }
  for (const id of Object.keys(entities)) walk(id)

  if (issues.length) {
    // eslint-disable-next-line no-console
    console.warn('[FlatLayout] validation', issues)
  }
}
