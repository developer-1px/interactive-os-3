import type { CSSProperties, KeyboardEvent } from 'react'
import { ROOT, getChildren, getLabel, isDisabled, type NormalizedData } from '../../core/types'

type Ctx = {
  data: NormalizedData
  focusId: string | null
  expanded: Set<string>
  anchorName: (id: string) => string
  onToggle: (id: string, open: boolean) => void
  onKey: (e: KeyboardEvent, id: string) => boolean
  onClick: (id: string) => void
  bindFocus: (id: string) => (el: HTMLElement | null) => void
}

const syncPopover = (el: HTMLDivElement | null, wantOpen: boolean) => {
  if (!el || el.popover !== 'auto') return
  const open = el.matches(':popover-open')
  wantOpen && !open && el.showPopover()
  !wantOpen && open && el.hidePopover()
}

export function MenuPopover({
  ctx, parentId, style, domId,
}: { ctx: Ctx; parentId: string; style: CSSProperties; domId?: string }) {
  const { data, focusId, expanded, anchorName, onToggle, onKey, onClick, bindFocus } = ctx
  const kids = getChildren(data, parentId)
  const branches = kids.filter((id) => getChildren(data, id).length > 0)
  const wantOpen = parentId === ROOT ? undefined : expanded.has(parentId)
  return (
    <div id={domId} popover="auto" role="presentation" style={style}
      ref={(el) => { wantOpen !== undefined && syncPopover(el, wantOpen) }}
      onToggle={(e) => {
        const open = (e.nativeEvent as ToggleEvent).newState === 'open'
        onToggle(parentId, open)
      }}
    >
      <ul role="menu">
        {kids.map((id, i) => {
          const branch = getChildren(data, id).length > 0
          const disabled = isDisabled(data, id)
          const focused = focusId === id
          return (
            <li key={id} role="menuitem" tabIndex={focused ? 0 : -1}
              ref={bindFocus(id)}
              aria-disabled={disabled || undefined}
              aria-haspopup={branch ? 'menu' : undefined}
              aria-expanded={branch ? expanded.has(id) : undefined}
              aria-posinset={i + 1} aria-setsize={kids.length}
              style={branch ? ({ anchorName: anchorName(id) } as CSSProperties) : undefined}
              onKeyDown={(e) => { onKey(e, id) && e.stopPropagation() }}
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
