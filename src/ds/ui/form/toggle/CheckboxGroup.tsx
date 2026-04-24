import type { ComponentPropsWithoutRef } from 'react'
import {
  ROOT,
  getChildren, getExpanded, getLabel, isDisabled,
  type CollectionProps,
} from '../../../core/types'
import { Checkbox } from './Checkbox'

type Extra = Omit<ComponentPropsWithoutRef<'div'>, 'role'> & {
  orientation?: 'horizontal' | 'vertical'
}

export function CheckboxGroup({ data, onEvent, orientation, ...rest }: CollectionProps<Extra>) {
  const kids = getChildren(data, ROOT)
  const checkedIds = getExpanded(data)

  return (
    <div role="group" aria-orientation={orientation} {...rest}>
      {kids.map((id) => {
        const disabled = isDisabled(data, id)
        const checked = checkedIds.has(id)
        return (
          <label key={id} aria-disabled={disabled || undefined}>
            <Checkbox
              checked={checked}
              disabled={disabled}
              onClick={() => !disabled && onEvent?.({ type: 'expand', id, open: !checked })}
            />
            <span>{getLabel(data, id)}</span>
          </label>
        )
      })}
    </div>
  )
}
