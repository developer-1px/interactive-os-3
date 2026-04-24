import type { ComponentPropsWithoutRef } from 'react'
import {
  ROOT,
  getChildren, getFocus, getLabel, isDisabled,
  type CollectionProps,
} from '../../../core/types'
import { Radio } from './Radio'

type Extra = Omit<ComponentPropsWithoutRef<'div'>, 'role'> & {
  orientation?: 'horizontal' | 'vertical'
}

export function RadioGroup({ data, onEvent, orientation, ...rest }: CollectionProps<Extra>) {
  const kids = getChildren(data, ROOT)
  const selectedId = getFocus(data)

  return (
    <div role="radiogroup" aria-orientation={orientation} {...rest}>
      {kids.map((id) => {
        const disabled = isDisabled(data, id)
        return (
          <Radio
            key={id}
            checked={selectedId === id}
            disabled={disabled}
            onClick={() => !disabled && onEvent?.({ type: 'navigate', id })}
          >
            {getLabel(data, id)}
          </Radio>
        )
      })}
    </div>
  )
}
