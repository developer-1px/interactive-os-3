import { type ComponentPropsWithoutRef } from 'react'
import {
  ROOT,
  getChildren, getLabel, isDisabled,
  type CollectionProps,
} from '../../core/types'
import { activate, composeAxes, navigate } from '../../core/axes'
import { useRoving } from '../../core/hooks/useRoving'
import { Radio } from '../control/Radio'

type Extra = Omit<ComponentPropsWithoutRef<'div'>, 'role' | 'onKeyDown'> & {
  orientation?: 'horizontal' | 'vertical'
}

export function RadioGroup({ data, onEvent, orientation = 'vertical', ...rest }: CollectionProps<Extra>) {
  const axis = composeAxes(navigate(orientation), activate)
  const { focusId, bindFocus, delegate } = useRoving(axis, data, onEvent ?? (() => {}))
  const kids = getChildren(data, ROOT)

  return (
    <div role="radiogroup" aria-orientation={orientation} onKeyDown={delegate.onKeyDown} {...rest}>
      {kids.map((id) => {
        const disabled = isDisabled(data, id)
        const selected = focusId === id
        return (
          <Radio
            key={id}
            data-id={id}
            ref={bindFocus(id)}
            checked={selected}
            disabled={disabled}
            tabIndex={selected ? 0 : -1}
            onClick={() => !disabled && onEvent?.({ type: 'navigate', id })}
          >
            {getLabel(data, id)}
          </Radio>
        )
      })}
    </div>
  )
}
