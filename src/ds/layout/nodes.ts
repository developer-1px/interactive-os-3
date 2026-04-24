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

export type Flow = 'list' | 'cluster' | 'form' | 'prose' | 'split'
export type Emphasis = 'flat' | 'raised' | 'sunk' | 'callout'
export type GridCols = 1 | 2 | 3 | 4 | 6 | 12
export type TextVariant = 'h1' | 'h2' | 'h3' | 'h4' | 'body' | 'muted' | 'small' | 'strong'
export type Align = 'start' | 'center' | 'end' | 'stretch'

export type NodeType =
  | 'Row' | 'Column' | 'Grid'
  | 'Aside' | 'Section' | 'Header' | 'Footer'
  | 'Ui' | 'Text'

export interface ItemPlacement {
  grow?: boolean
  width?: number | string
  align?: Align
}

export interface CommonNodeData extends ItemPlacement {
  type: NodeType
  label?: string
  labelledBy?: string
  roledescription?: string
  /** Native `hidden` attribute. Keeps node in DOM but removes from render. */
  hidden?: boolean
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
}
export interface AsideNode extends CommonNodeData {
  type: 'Aside'
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
  component: string
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
  | AsideNode | SectionNode | HeaderNode | FooterNode
  | UiNode | TextNode

export type TypedEntity<T extends AnyNode = AnyNode> = Entity & { data: T }

/** Build a <Renderer>-compatible page (wraps entities/relationships passthrough). */
export function node<T extends AnyNode>(id: string, data: T): TypedEntity<T> {
  return { id, data }
}

/** Compute inline style + data attributes for a node (grow/width/align + container vars). */
export function placementAttrs(d: Partial<CommonNodeData>): {
  style?: CSSProperties
  'data-ds-grow'?: 'true'
  'data-ds-width'?: ''
  'data-ds-align'?: Align
} {
  const out: ReturnType<typeof placementAttrs> = {}
  if (d.grow) out['data-ds-grow'] = 'true'
  if (d.width !== undefined) {
    out['data-ds-width'] = ''
    out.style = { inlineSize: typeof d.width === 'number' ? `${d.width}px` : d.width }
  }
  if (d.align) out['data-ds-align'] = d.align
  return out
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
    const known: NodeType[] = ['Row','Column','Grid','Aside','Section','Header','Footer','Ui','Text']
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
