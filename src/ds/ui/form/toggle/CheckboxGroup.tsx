import { type ComponentPropsWithoutRef, type KeyboardEvent } from 'react'
import {
  ROOT,
  getChildren, getExpanded, getLabel, isDisabled,
  type CollectionProps, type Event,
} from '../../../core/types'
import { activate, composeAxes, navigate } from '../../../core/axes'
import { useRoving } from '../../../core/hooks/useRoving'
import { Checkbox } from './Checkbox'

type Extra = Omit<ComponentPropsWithoutRef<'div'>, 'role' | 'onKeyDown'> & {
  orientation?: 'horizontal' | 'vertical'
}

const idFrom = (e: { target: EventTarget }): string | null =>
  (e.target as Element).closest<HTMLElement>('[data-id]')?.dataset.id ?? null

export function CheckboxGroup({ data, onEvent, orientation = 'vertical', ...rest }: CollectionProps<Extra>) {
  const axis = composeAxes(navigate(orientation), activate)
  const checkedIds = getExpanded(data)
  const toggle = (id: string): Event => ({ type: 'expand', id, open: !checkedIds.has(id) })
  const relay = (e: Event) => onEvent?.(e.type === 'activate' ? toggle(e.id) : e)
  const { focusId, onKey, bindFocus } = useRoving(axis, data, relay)
  const kids = getChildren(data, ROOT)

  const onKeyDown = (e: KeyboardEvent) => {
    const id = idFrom(e)
    if (id) onKey(e, id)
  }

  return (
    <div role="group" aria-orientation={orientation} onKeyDown={onKeyDown} {...rest}>
      {kids.map((id) => {
        const disabled = isDisabled(data, id)
        const checked = checkedIds.has(id)
        const focused = focusId === id
        return (
          <label key={id} data-id={id} aria-disabled={disabled || undefined}>
            <Checkbox
              ref={bindFocus(id)}
              checked={checked}
              disabled={disabled}
              tabIndex={focused ? 0 : -1}
              onClick={() => !disabled && onEvent?.(toggle(id))}
            />
            <span>{getLabel(data, id)}</span>
          </label>
        )
      })}
    </div>
  )
}
