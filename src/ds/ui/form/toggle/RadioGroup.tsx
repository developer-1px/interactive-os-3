import type { ComponentPropsWithoutRef } from 'react'
import {
  ROOT, FOCUS,
  getChildren, getLabel, isDisabled,
  type CollectionProps,
} from '../../../core/types'
import { Radio } from './Radio'

/**
 * RadioGroup — CollectionProps 기반 radio 그룹.
 *
 * data 의 ROOT 자식 각각이 하나의 radio. FOCUS id 가 선택된 값.
 * onEvent: { type:'select', id } 로 선택 변경을 알린다.
 */
type Extra = Omit<ComponentPropsWithoutRef<'div'>, 'role'> & {
  orientation?: 'horizontal' | 'vertical'
}

export function RadioGroup({ data, onEvent, orientation, ...rest }: CollectionProps<Extra>) {
  const kids = getChildren(data, ROOT)
  const selectedId = data.entities[FOCUS]?.data?.id as string | undefined

  return (
    <div role="radiogroup" aria-orientation={orientation} {...rest}>
      {kids.map((id) => {
        const disabled = isDisabled(data, id)
        return (
          <Radio
            key={id}
            checked={selectedId === id}
            disabled={disabled}
            onClick={() => !disabled && onEvent({ type: 'navigate', id })}
          >
            {getLabel(data, id)}
          </Radio>
        )
      })}
    </div>
  )
}
