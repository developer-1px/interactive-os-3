/**
 * FlatLayout renderer — walks `NormalizedData` entities as a tree
 * rooted at `page.entities.__root__` (or the single orphan-free root if none).
 *
 * Each entity's `data.type` selects a renderer. Children come from
 * `relationships[id]` as ordered ids. Leaves (Ui/Text) end recursion.
 *
 * No JSX children API — everything is in the entities map. Consumers that
 * need arbitrary content can use Text (ReactNode `content`) or Ui with
 * `content`/`props.children`.
 */
import { createElement, useEffect, type CSSProperties, type ReactNode } from 'react'
import { ROOT, type NormalizedData } from '../core/types'
import { printTree, printHeadingOutline } from '../debug/printTree'
import {
  placementAttrs,
  type AnyNode, type AsideNode, type ColumnNode, type FooterNode,
  type GridNode, type HeaderNode, type RowNode, type SectionNode,
  type TextNode, type UiNode,
} from './nodes'
import { resolveUi } from './registry'

export interface RendererProps {
  page: NormalizedData
  /** Root id — defaults to ROOT (`__root__`). */
  rootId?: string
}

export function Renderer({ page, rootId = ROOT }: RendererProps) {
  useDebugTree(page)
  if (!page.entities[rootId]) {
    // Accept single-rooted trees that omit the `__root__` meta entity by
    // rendering the relationships root directly if present.
    const rootFromRel = Object.keys(page.relationships)[0]
    if (!rootFromRel) return null
    return <NodeChildren page={page} id={rootFromRel} pageRoot />
  }
  return <NodeChildren page={page} id={rootId} pageRoot />
}

function useDebugTree(page: NormalizedData) {
  useEffect(() => {
    if (typeof window === 'undefined') return
    const params = new URLSearchParams(window.location.search)
    if (params.get('debug') !== 'tree') return
    // eslint-disable-next-line no-console
    console.groupCollapsed('%c[FlatLayout] hierarchy', 'color:#888')
    // eslint-disable-next-line no-console
    console.log(printTree(page))
    // eslint-disable-next-line no-console
    console.log('\n=== HEADING OUTLINE ===\n' + printHeadingOutline(page))
    // eslint-disable-next-line no-console
    console.groupEnd()
  }, [page])
}

function NodeChildren({ page, id, pageRoot }: { page: NormalizedData; id: string; pageRoot?: boolean }) {
  const kids = page.relationships[id] ?? []
  return (
    <>
      {kids.map((childId) => <NodeView key={childId} page={page} id={childId} pageRoot={pageRoot} />)}
    </>
  )
}

function NodeView({ page, id, pageRoot }: { page: NormalizedData; id: string; pageRoot?: boolean }) {
  const e = page.entities[id]
  if (!e) return null
  const d = e.data as AnyNode | undefined
  if (!d?.type) return null

  // page root 마킹 — Row/Column/Grid/Section 등 컨테이너에만 의미. Ui leaf·Text는 무시.
  const pr = pageRoot || undefined
  switch (d.type) {
    case 'Row':     return <RowView page={page} id={id} d={d} pageRoot={pr} />
    case 'Column':  return <ColumnView page={page} id={id} d={d} pageRoot={pr} />
    case 'Grid':    return <GridView page={page} id={id} d={d} pageRoot={pr} />
    case 'Aside':   return <AsideView page={page} id={id} d={d} />
    case 'Section': return <SectionView page={page} id={id} d={d} pageRoot={pr} />
    case 'Header':  return <HeaderView page={page} id={id} d={d} />
    case 'Footer':  return <FooterView page={page} id={id} d={d} />
    case 'Ui':      return <UiLeaf page={page} id={id} d={d} />
    case 'Text':    return <TextLeaf d={d} />
  }
}

// ── containers ─────────────────────────────────────────────────────

function RowView({ page, id, d, pageRoot }: { page: NormalizedData; id: string; d: RowNode; pageRoot?: boolean }) {
  const ph = placementAttrs(d)
  const named = Boolean(d.label || d.labelledBy)
  return (
    <div
      data-ds="Row"
      data-flow={d.flow}
      data-emphasis={d.emphasis}
      data-page-root={pageRoot ? '' : undefined}
      role={named ? 'group' : undefined}
      aria-label={d.label}
      aria-labelledby={d.labelledBy}
      aria-roledescription={d.roledescription}
      hidden={d.hidden || undefined}
      {...ph}
    >
      <NodeChildren page={page} id={id} />
    </div>
  )
}

function ColumnView({ page, id, d, pageRoot }: { page: NormalizedData; id: string; d: ColumnNode; pageRoot?: boolean }) {
  const ph = placementAttrs(d)
  const named = Boolean(d.label || d.labelledBy)
  return (
    <div
      data-ds="Column"
      data-flow={d.flow}
      data-emphasis={d.emphasis}
      data-page-root={pageRoot ? '' : undefined}
      role={named ? 'group' : undefined}
      aria-label={d.label}
      aria-labelledby={d.labelledBy}
      aria-roledescription={d.roledescription}
      hidden={d.hidden || undefined}
      {...ph}
    >
      <NodeChildren page={page} id={id} />
    </div>
  )
}

function GridView({ page, id, d, pageRoot }: { page: NormalizedData; id: string; d: GridNode; pageRoot?: boolean }) {
  const ph = placementAttrs(d)
  const named = Boolean(d.label || d.labelledBy)
  return (
    <div
      data-ds="Grid"
      data-cols={d.cols}
      data-flow={d.flow}
      data-emphasis={d.emphasis}
      data-page-root={pageRoot ? '' : undefined}
      role={named ? 'group' : undefined}
      aria-label={d.label}
      aria-labelledby={d.labelledBy}
      aria-roledescription={d.roledescription}
      hidden={d.hidden || undefined}
      {...ph}
    >
      <NodeChildren page={page} id={id} />
    </div>
  )
}

function AsideView({ page, id, d }: { page: NormalizedData; id: string; d: AsideNode }) {
  const ph = placementAttrs(d)
  return (
    <aside
      data-flow={d.flow}
      data-emphasis={d.emphasis}
      aria-label={d.label}
      aria-labelledby={d.labelledBy}
      aria-roledescription={d.roledescription}
      hidden={d.hidden || undefined}
      {...ph}
    >
      <NodeChildren page={page} id={id} />
    </aside>
  )
}

function SectionView({ page, id, d, pageRoot }: { page: NormalizedData; id: string; d: SectionNode; pageRoot?: boolean }) {
  const ph = placementAttrs(d)
  const headingId = d.heading ? `${id}-h` : undefined
  return (
    <section
      data-flow={d.flow}
      data-emphasis={d.emphasis}
      data-page-root={pageRoot ? '' : undefined}
      aria-label={d.label && !headingId ? d.label : undefined}
      aria-labelledby={d.labelledBy ?? headingId}
      aria-roledescription={d.roledescription}
      hidden={d.hidden || undefined}
      {...ph}
    >
      {d.heading && <Heading id={headingId} variant={d.heading.variant ?? 'h2'}>{d.heading.content}</Heading>}
      <NodeChildren page={page} id={id} />
    </section>
  )
}

function HeaderView({ page, id, d }: { page: NormalizedData; id: string; d: HeaderNode }) {
  const ph = placementAttrs(d)
  return (
    <header
      data-flow={d.flow}
      aria-label={d.label}
      aria-labelledby={d.labelledBy}
      aria-roledescription={d.roledescription}
      hidden={d.hidden || undefined}
      {...ph}
    >
      <NodeChildren page={page} id={id} />
    </header>
  )
}

function FooterView({ page, id, d }: { page: NormalizedData; id: string; d: FooterNode }) {
  const ph = placementAttrs(d)
  return (
    <footer
      data-flow={d.flow}
      aria-label={d.label}
      aria-labelledby={d.labelledBy}
      aria-roledescription={d.roledescription}
      hidden={d.hidden || undefined}
      {...ph}
    >
      <NodeChildren page={page} id={id} />
    </footer>
  )
}

// ── leaves ────────────────────────────────────────────────────────

function UiLeaf({ page, id, d }: { page: NormalizedData; id: string; d: UiNode }) {
  const Cmp = resolveUi(d.component)
  if (!Cmp) {
    if (typeof window !== 'undefined') {
      // eslint-disable-next-line no-console
      console.warn('[FlatLayout] unknown ui component', d.component)
    }
    return null
  }
  const ph = placementAttrs(d)
  const { style: phStyle, ...phAttr } = ph
  const userStyle = (d.props?.style as CSSProperties | undefined)
  const style: CSSProperties | undefined =
    phStyle || userStyle ? { ...phStyle, ...userStyle } : undefined
  // 자식 결정 우선순위: relationships(tree children) > d.content > props.children.
  // createElement의 3rd arg에 undefined을 넘기면 props.children이 덮여 빈 element가 되므로
  // 존재할 때만 3rd arg로 전달한다.
  const hasTreeChildren = (page.relationships[id]?.length ?? 0) > 0
  const treeChildren: ReactNode = hasTreeChildren
    ? <NodeChildren page={page} id={id} />
    : undefined
  const contentChildren = d.content as ReactNode
  const finalProps = {
    ...d.props,
    ...phAttr,
    style,
    hidden: d.hidden || (d.props as { hidden?: boolean })?.hidden || undefined,
  }
  if (treeChildren !== undefined) return createElement(Cmp, finalProps, treeChildren)
  if (contentChildren !== undefined) return createElement(Cmp, finalProps, contentChildren)
  return createElement(Cmp, finalProps)
}

function TextLeaf({ d }: { d: TextNode }) {
  const variant = d.variant ?? 'body'
  const ph = placementAttrs(d)
  const common = {
    'data-variant': variant,
    hidden: d.hidden || undefined,
    ...ph,
  } as const
  switch (variant) {
    case 'h1': return <h1 {...common}>{d.content}</h1>
    case 'h2': return <h2 {...common}>{d.content}</h2>
    case 'h3': return <h3 {...common}>{d.content}</h3>
    case 'h4': return <h4 {...common}>{d.content}</h4>
    case 'strong': return <strong {...common}>{d.content}</strong>
    case 'muted':
    case 'small':
      return <small {...common}>{d.content}</small>
    case 'body':
    default:
      return <p {...common}>{d.content}</p>
  }
}

function Heading({
  id, variant, children,
}: { id?: string; variant: NonNullable<TextNode['variant']>; children: ReactNode }) {
  switch (variant) {
    case 'h1': return <h1 id={id}>{children}</h1>
    case 'h3': return <h3 id={id}>{children}</h3>
    case 'h4': return <h4 id={id}>{children}</h4>
    case 'h2':
    default: return <h2 id={id}>{children}</h2>
  }
}

