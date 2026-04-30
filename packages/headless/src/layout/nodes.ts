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
import type { ReactNode } from 'react'

/**
 * Augmentable slot for the consumer's UI component name set.
 * Consumer (the ui registry) augments via:
 *   declare module '<this-module>' { interface Register { component: 'Button' | ... } }
 * If unaugmented, falls back to `string` so headless stays compilable in isolation.
 */
export interface Register {}

export type UiComponentName = Register extends { component: infer C extends string }
  ? C
  : string

export type Flow = 'list' | 'cluster' | 'form' | 'prose' | 'split'
export type Emphasis = 'flat' | 'raised' | 'sunk' | 'callout'
export type GridCols = 1 | 2 | 3 | 4 | 6 | 12
export type TextVariant = 'h1' | 'h2' | 'h3' | 'h4' | 'body' | 'muted' | 'small' | 'strong'
export type Align = 'start' | 'center' | 'end' | 'stretch'

export type NodeType =
  | 'Row' | 'Column' | 'Grid' | 'Split'
  | 'Main' | 'Nav' | 'Aside' | 'Section' | 'Header' | 'Footer'
  | 'Ui' | 'Text'

export type SplitAxis = 'row' | 'column'

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
  variant?: Emphasis
}
export interface ColumnNode extends CommonNodeData {
  type: 'Column'
  flow?: Flow
  variant?: Emphasis
}
export interface GridNode extends CommonNodeData {
  type: 'Grid'
  cols?: GridCols
  flow?: Flow
  variant?: Emphasis
  /** Card 슬롯 row track owner — 자식 article[data-part="card"]가 subgrid로 상속받는다. */
  cardGrid?: boolean
}
/**
 * N-pane resize container. 자식 사이에 separator(드래그 핸들)를 자동 삽입한다.
 * 항상 full-height. localStorage 영속화 키는 엔티티 id를 그대로 사용한다.
 */
export interface SplitNode extends CommonNodeData {
  type: 'Split'
  axis?: SplitAxis
  /** fr 비율 배열. 자식 수와 길이가 다르면 1로 채움. */
  defaultSizes?: number[]
  /** px 단위 최소 폭. number면 모든 panel에 동일 적용. */
  minSizes?: number | number[]
}

export interface AsideNode extends CommonNodeData {
  type: 'Aside'
  flow?: Flow
  variant?: Emphasis
}
/** Page main landmark. Renders <main role=main>. 페이지당 1개. */
export interface MainNode extends CommonNodeData {
  type: 'Main'
  flow?: Flow
  variant?: Emphasis
}
/** Navigation landmark. Renders <nav role=navigation>. */
export interface NavNode extends CommonNodeData {
  type: 'Nav'
  flow?: Flow
  variant?: Emphasis
}
export interface SectionNode extends CommonNodeData {
  type: 'Section'
  heading?: { variant?: TextVariant; content: string }
  flow?: Flow
  variant?: Emphasis
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
  | RowNode | ColumnNode | GridNode | SplitNode
  | MainNode | NavNode | AsideNode | SectionNode | HeaderNode | FooterNode
  | UiNode | TextNode

/**
 * Entity의 typed variant — Entity는 data?: Record<string,unknown>이지만
 * node 어휘에서는 data가 항상 AnyNode 하위 타입이라 명시한다. Entity 직접
 * intersection은 Record<string,unknown> 제약과 충돌해서 generic 좁힘이 깨진다.
 */
export type TypedEntity<T extends AnyNode = AnyNode> = { id: string; data: T }

/** Build a <Renderer>-compatible page (wraps entities/relationships passthrough). */
export function node<T extends AnyNode>(id: string, data: T): TypedEntity<T> {
  return { id, data }
}
