import { Fragment, type CSSProperties, type ComponentPropsWithoutRef, type MouseEvent, type ReactNode } from 'react'
import { ROOT, getChildren, getLabel, isDisabled, type ControlProps } from '../../core/types'
import { composeAxes, activate, treeExpand, treeNavigate, typeahead } from '../../core/axes'
import { useRoving } from '../../core/hooks/useRoving'

type TreeProps = ControlProps & Omit<ComponentPropsWithoutRef<'ul'>, 'role' | 'onKeyDown'>

const axis = composeAxes(treeNavigate, treeExpand, activate, typeahead)

export function Tree({ data, onEvent, ...rest }: TreeProps) {
  const { focusId, expanded, onKey, bindFocus } = useRoving(axis, data, onEvent)

  // 단일 제스처 emit. expand/navigate 도출은 소비자가 expandBranchOnActivate 헬퍼로.
  const onItemClick = (e: MouseEvent, id: string) => {
    e.stopPropagation()
    if (isDisabled(data, id)) return
    onEvent({ type: 'activate', id })
  }
  const onItemKey = (e: React.KeyboardEvent, id: string) => {
    if (onKey(e, id)) e.stopPropagation()
  }

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
            style={{ '--ds-level': level - 1 } as CSSProperties}
            onKeyDown={(e) => onItemKey(e, id)}
            onClick={(e) => onItemClick(e, id)}
          >
            {getLabel(data, id)}
          </li>
          {hasKids && isOpen && render(id, level + 1)}
        </Fragment>
      )
    })

  return <ul role="tree" {...rest}>{render(ROOT, 1)}</ul>
}
