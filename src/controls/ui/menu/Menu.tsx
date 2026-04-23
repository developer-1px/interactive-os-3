import { useEffect, useId, useRef, type CSSProperties } from 'react'
import { ROOT, getChildren, getExpanded, getFocus, getLabel, isDisabled, type ControlProps } from '../../core/types'
import { compose, createActivate, createExpand, createNavigate, useTypeahead } from '../../axes'
import { MenuPopover, type MenuCtx } from './MenuPopover'

export function Menu({ data, onEvent }: ControlProps) {
  const popoverId = useId()
  const itemRefs = useRef(new Map<string, HTMLLIElement>())
  const popoverRefs = useRef(new Map<string, HTMLDivElement>())
  const lastOpenState = useRef(new Map<string, boolean>())
  const triggerRef = useRef<HTMLButtonElement>(null)
  const focusId = getFocus(data)
  const expanded = getExpanded(data)

  const onKey = compose(
    createNavigate(data, onEvent, 'vertical'),
    createExpand(data, onEvent),
    createActivate(data, onEvent),
    useTypeahead(data, onEvent),
  )

  useEffect(() => {
    popoverRefs.current.forEach((el, id) => {
      if (id === ROOT) return
      const shouldOpen = expanded.has(id)
      const isOpen = el.matches(':popover-open')
      if (shouldOpen && !isOpen) el.showPopover?.()
      else if (!shouldOpen && isOpen) el.hidePopover?.()
    })
  }, [expanded])

  useEffect(() => {
    if (focusId && focusId !== ROOT) itemRefs.current.get(focusId)?.focus()
  }, [focusId])

  const firstEnabled = (p: string) => getChildren(data, p).find((k) => !isDisabled(data, k))
  const anchorName = (id: string) => `--menu-anchor-${popoverId.replace(/[^a-zA-Z0-9]/g, '')}-${id}`

  const onClick = (id: string) => {
    if (isDisabled(data, id)) return
    const kids = getChildren(data, id)
    if (kids.length) {
      const open = expanded.has(id)
      onEvent({ type: 'expand', id, open: !open })
      if (!open) { const first = firstEnabled(id); if (first) onEvent({ type: 'navigate', id: first }) }
    } else {
      onEvent({ type: 'activate', id })
      popoverRefs.current.get(ROOT)?.hidePopover?.()
    }
  }

  const onToggle = (id: string, open: boolean) => {
    if (id === ROOT) {
      onEvent({ type: 'open', id: ROOT, open })
      if (open) { const first = firstEnabled(ROOT); if (first) onEvent({ type: 'navigate', id: first }) }
    } else if (!open && expanded.has(id)) {
      onEvent({ type: 'expand', id, open: false })
    }
  }

  const ctx: MenuCtx = { data, focusId, expanded, itemRefs, popoverRefs, lastOpenState, anchorName, onToggle, onKey, onClick }

  return (
    <>
      <button ref={triggerRef} type="button" popoverTarget={popoverId} aria-haspopup="menu"
        style={{ anchorName: anchorName(ROOT) } as CSSProperties}>{getLabel(data, ROOT)}</button>
      <MenuPopover ctx={ctx} parentId={ROOT} domId={popoverId} style={{
        positionAnchor: anchorName(ROOT), top: 'anchor(bottom)',
        left: 'anchor(left)', marginBlockStart: 'var(--ds-space)',
      } as CSSProperties} />
    </>
  )
}
