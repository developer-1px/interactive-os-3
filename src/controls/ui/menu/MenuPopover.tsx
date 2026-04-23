import type { CSSProperties, KeyboardEvent, RefObject } from 'react'
import { ROOT, getChildren, getLabel, isDisabled, type NormalizedData } from '../../core/types'

type Ctx = {
  data: NormalizedData
  focusId: string | null
  expanded: Set<string>
  itemRefs: RefObject<Map<string, HTMLLIElement>>
  popoverRefs: RefObject<Map<string, HTMLDivElement>>
  lastOpenState: RefObject<Map<string, boolean>>
  anchorName: (id: string) => string
  onToggle: (id: string, open: boolean) => void
  onKey: (e: KeyboardEvent, id: string) => boolean
  onClick: (id: string) => void
}

export function MenuPopover({
  ctx, parentId, style, domId,
}: { ctx: Ctx; parentId: string; style: CSSProperties; domId?: string }) {
  const { data, focusId, expanded, itemRefs, popoverRefs, lastOpenState,
    anchorName, onToggle, onKey, onClick } = ctx
  const kids = getChildren(data, parentId)
  const branches = kids.filter((id) => getChildren(data, id).length > 0)
  return (
    <div id={domId} popover="auto" role="presentation" style={style}
      ref={(el) => { el ? popoverRefs.current.set(parentId, el) : popoverRefs.current.delete(parentId) }}
      onToggle={(e) => {
        const open = (e.nativeEvent as ToggleEvent).newState === 'open'
        if (lastOpenState.current.get(parentId) === open) return
        lastOpenState.current.set(parentId, open)
        onToggle(parentId, open)
      }}
    >
      <ul role="menu">
        {kids.map((id, i) => {
          const branch = getChildren(data, id).length > 0
          const disabled = isDisabled(data, id)
          return (
            <li key={id} role="menuitem" tabIndex={focusId === id ? 0 : -1}
              ref={(el) => { el ? itemRefs.current.set(id, el) : itemRefs.current.delete(id) }}
              aria-disabled={disabled || undefined}
              aria-haspopup={branch ? 'menu' : undefined}
              aria-expanded={branch ? expanded.has(id) : undefined}
              aria-posinset={i + 1} aria-setsize={kids.length}
              style={branch ? ({ anchorName: anchorName(id) } as CSSProperties) : undefined}
              onKeyDown={(e) => { if (onKey(e, id)) e.stopPropagation() }}
              onClick={(e) => { e.stopPropagation(); onClick(id) }}
            >{getLabel(data, id)}</li>
          )
        })}
      </ul>
      {branches.map((bid) => (
        <MenuPopover key={bid} ctx={ctx} parentId={bid} style={{
          positionAnchor: anchorName(bid), top: 'anchor(top)',
          left: 'anchor(right)', marginInlineStart: 'var(--ds-space)',
        } as CSSProperties} />
      ))}
    </div>
  )
}

export type { Ctx as MenuCtx }
export { ROOT }
