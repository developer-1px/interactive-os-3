import { Fragment, type ComponentPropsWithoutRef, type ReactNode } from 'react'
import { ROOT, getChildren, getExpanded, getFocus, getLabel, isDisabled, type ControlProps, type Event } from '../../core/types'
import { composeAxes, activate, treeExpand, treeNavigate, typeahead } from '../../axes'
import { bindAxis } from '../../core/bind'
import { useFocusBridge } from '../../core/focus'

type TreeProps = ControlProps & Omit<ComponentPropsWithoutRef<'ul'>, 'role' | 'onKeyDown'>

const axis = composeAxes(treeNavigate, treeExpand, activate, typeahead)

export function Tree({ data, onEvent, ...rest }: TreeProps) {
  const focusId = getFocus(data)
  const expanded = getExpanded(data)
  const onKey = bindAxis(axis, data, onEvent)
  const bindFocus = useFocusBridge(focusId)

  const clickEvents = (id: string, hasKids: boolean, isOpen: boolean, disabled: boolean): Event[] =>
    disabled
      ? []
      : [
          { type: 'navigate', id },
          hasKids
            ? { type: 'expand', id, open: !isOpen }
            : { type: 'activate', id },
        ]

  const render = (parent: string, level: number): ReactNode =>
    getChildren(data, parent).map((id, i, kids) => {
      const hasKids = getChildren(data, id).length > 0
      const isOpen = expanded.has(id)
      const disabled = isDisabled(data, id)
      const focused = focusId === id
      return (
        <Fragment key={id}>
          <li
            role="treeitem"
            ref={bindFocus(id)}
            aria-level={level}
            aria-posinset={i + 1}
            aria-setsize={kids.length}
            aria-expanded={hasKids ? isOpen : undefined}
            aria-disabled={disabled || undefined}
            tabIndex={focused ? 0 : -1}
            style={{ paddingInlineStart: `calc(var(--ds-space) * 4 * ${level - 1} + var(--ds-space) * 2)` }}
            onKeyDown={(e) => { onKey(e, id) && e.stopPropagation() }}
            onClick={(e) => {
              e.stopPropagation()
              clickEvents(id, hasKids, isOpen, disabled).forEach(onEvent)
            }}
          >
            {getLabel(data, id)}
          </li>
          {hasKids && isOpen && render(id, level + 1)}
        </Fragment>
      )
    })

  return <ul role="tree" {...rest}>{render(ROOT, 1)}</ul>
}
