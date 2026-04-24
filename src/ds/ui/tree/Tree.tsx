import { Fragment, type CSSProperties, type ComponentPropsWithoutRef, type KeyboardEvent, type MouseEvent, type ReactNode } from 'react'
import { ROOT, getChildren, getLabel, isDisabled, type ControlProps } from '../../core/types'
import { composeAxes, activate, treeExpand, treeNavigate, typeahead } from '../../core/axes'
import { useRoving } from '../../core/hooks/useRoving'

type TreeProps = ControlProps & Omit<ComponentPropsWithoutRef<'ul'>, 'role' | 'onKeyDown'>

const axis = composeAxes(treeNavigate, treeExpand, activate, typeahead)

const idFrom = (e: { target: EventTarget }): string | null =>
  (e.target as Element).closest<HTMLElement>('[data-id]')?.dataset.id ?? null

export function Tree({ data, onEvent, ...rest }: TreeProps) {
  const { focusId, expanded, onKey, bindFocus } = useRoving(axis, data, onEvent)

  // 위임: 컨테이너 ul에서 한 번 처리. 단일 제스처 emit.
  const onClick = (e: MouseEvent) => {
    const id = idFrom(e)
    if (!id || isDisabled(data, id)) return
    onEvent({ type: 'activate', id })
  }
  const onKeyDown = (e: KeyboardEvent) => {
    const id = idFrom(e)
    if (id) onKey(e, id)
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
            data-id={id}
            ref={bindFocus(id)}
            aria-level={level}
            aria-posinset={i + 1}
            aria-setsize={kids.length}
            aria-expanded={hasKids ? isOpen : undefined}
            aria-disabled={disabled || undefined}
            tabIndex={focused ? 0 : -1}
            style={{ '--ds-level': level - 1 } as CSSProperties}
          >
            {getLabel(data, id)}
          </li>
          {hasKids && isOpen && render(id, level + 1)}
        </Fragment>
      )
    })

  return <ul role="tree" onClick={onClick} onKeyDown={onKeyDown} {...rest}>{render(ROOT, 1)}</ul>
}
