import { type ComponentPropsWithoutRef } from 'react'
import {
  ROOT,
  getChildren, getLabel, isDisabled,
  type CollectionProps,
} from '@p/headless/types'
import { activate, composeAxes, navigate } from '@p/headless/axes'
import { useRoving } from '@p/headless/roving/useRoving'
import { Radio } from '../2-input/Radio'

type Extra = Omit<ComponentPropsWithoutRef<'div'>, 'role' | 'onKeyDown'> & {
  orientation?: 'horizontal' | 'vertical'
}

/**
 * APG radiogroup: 양 축 화살표 모두 navigate. orientation 은 시각·aria-orientation 만.
 * 키보드는 vertical+horizontal 모두 — Home/End 는 하나의 navigate 가 처리하면 충분.
 */
export function RadioGroup({ data, onEvent, orientation = 'vertical', autoFocus, ...rest }: CollectionProps<Extra>) {
  const axis = composeAxes(navigate('vertical'), navigate('horizontal'), activate)
  const { focusId, bindFocus, delegate } = useRoving(axis, data, onEvent ?? (() => {}), { autoFocus })
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
