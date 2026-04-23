import { Fragment, useEffect, useRef, type ComponentPropsWithoutRef, type ReactNode } from 'react'
import { ROOT, getChildren, getExpanded, getFocus, getLabel, isDisabled, type ControlProps } from '../../core/types'
import { compose, createActivate, createTreeExpand, createTreeNavigate, useTypeahead } from '../../axes'

type TreeProps = ControlProps & Omit<ComponentPropsWithoutRef<'ul'>, 'role' | 'onKeyDown'>

export function Tree({ data, onEvent, ...rest }: TreeProps) {
  const itemRefs = useRef(new Map<string, HTMLLIElement>())
  const focusId = getFocus(data)
  const expanded = getExpanded(data)

  const onKey = compose(
    createTreeNavigate(data, onEvent),
    createTreeExpand(data, onEvent),
    createActivate(data, onEvent),
    useTypeahead(data, onEvent),
  )

  useEffect(() => {
    if (focusId && focusId !== ROOT) itemRefs.current.get(focusId)?.focus()
  }, [focusId])

  const render = (parent: string, level: number): ReactNode => {
    const kids = getChildren(data, parent)
    return kids.map((id, i) => {
      const hasKids = getChildren(data, id).length > 0
      const isOpen = expanded.has(id)
      const disabled = isDisabled(data, id)
      return (
        <Fragment key={id}>
          <li
            role="treeitem"
            ref={(el) => { el ? itemRefs.current.set(id, el) : itemRefs.current.delete(id) }}
            aria-level={level}
            aria-posinset={i + 1}
            aria-setsize={kids.length}
            aria-expanded={hasKids ? isOpen : undefined}
            aria-disabled={disabled || undefined}
            tabIndex={focusId === id ? 0 : -1}
            style={{ paddingInlineStart: `calc(var(--ds-space) * 4 * ${level - 1} + var(--ds-space) * 2)` }}
            onKeyDown={(e) => { if (onKey(e, id)) e.stopPropagation() }}
            onClick={(e) => {
              e.stopPropagation()
              if (disabled) return
              onEvent({ type: 'navigate', id })
              if (hasKids) onEvent({ type: 'expand', id, open: !isOpen })
              else onEvent({ type: 'activate', id })
            }}
          >
            {getLabel(data, id)}
          </li>
          {hasKids && isOpen && render(id, level + 1)}
        </Fragment>
      )
    })
  }

  return <ul role="tree" {...rest}>{render(ROOT, 1)}</ul>
}
