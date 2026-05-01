import { type ComponentPropsWithoutRef } from 'react'
import {
  ROOT,
  getChildren, getExpanded, getLabel, isDisabled,
  type CollectionProps, type UiEvent,
} from '@p/headless/types'
import { activate, composeAxes, navigate } from '@p/headless/axes'
import { useRovingTabIndex } from '@p/headless/roving/useRovingTabIndex'
import { Checkbox } from '../2-input/Checkbox'

type Extra = Omit<ComponentPropsWithoutRef<'div'>, 'role' | 'onKeyDown'> & {
  orientation?: 'horizontal' | 'vertical'
}

export function CheckboxGroup({ data, onEvent, orientation = 'vertical', autoFocus, ...rest }: CollectionProps<Extra>) {
  const axis = composeAxes(navigate(orientation), activate)
  const checkedIds = getExpanded(data)
  const toggle = (id: string): UiEvent => ({ type: 'expand', id, open: !checkedIds.has(id) })
  const relay = (e: UiEvent) => onEvent?.(e.type === 'activate' ? toggle(e.id) : e)
  const { focusId, bindFocus, delegate } = useRovingTabIndex(axis, data, relay, { autoFocus })
  const kids = getChildren(data, ROOT)

  return (
    <div role="group" aria-orientation={orientation} onKeyDown={delegate.onKeyDown} {...rest}>
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
