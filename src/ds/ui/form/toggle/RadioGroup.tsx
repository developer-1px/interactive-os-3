import { type ComponentPropsWithoutRef, type KeyboardEvent } from 'react'
import {
  ROOT,
  getChildren, getLabel, isDisabled,
  type CollectionProps,
} from '../../../core/types'
import { activate, composeAxes, navigate } from '../../../core/axes'
import { useRoving } from '../../../core/hooks/useRoving'
import { Radio } from './Radio'

type Extra = Omit<ComponentPropsWithoutRef<'div'>, 'role' | 'onKeyDown'> & {
  orientation?: 'horizontal' | 'vertical'
}

const idFrom = (e: { target: EventTarget }): string | null =>
  (e.target as Element).closest<HTMLElement>('[data-id]')?.dataset.id ?? null

export function RadioGroup({ data, onEvent, orientation = 'vertical', ...rest }: CollectionProps<Extra>) {
  const axis = composeAxes(navigate(orientation), activate)
  const { focusId, onKey, bindFocus } = useRoving(axis, data, onEvent ?? (() => {}))
  const kids = getChildren(data, ROOT)

  const onKeyDown = (e: KeyboardEvent) => {
    const id = idFrom(e)
    if (id) onKey(e, id)
  }

  return (
    <div role="radiogroup" aria-orientation={orientation} onKeyDown={onKeyDown} {...rest}>
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
