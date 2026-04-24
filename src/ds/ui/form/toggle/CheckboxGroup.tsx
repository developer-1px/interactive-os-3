import type { ComponentPropsWithoutRef } from 'react'
import {
  ROOT, EXPANDED,
  getChildren, getLabel, isDisabled,
  type CollectionProps,
} from '../../../core/types'
import { Checkbox } from './Checkbox'

/**
 * CheckboxGroup — CollectionProps 기반 체크박스 집합.
 *
 * data 의 ROOT 자식 각각이 하나의 checkbox. EXPANDED.ids 가 체크된 id 들.
 * onEvent: { type:'expand', id, open } 로 토글 emit.
 */
type Extra = Omit<ComponentPropsWithoutRef<'div'>, 'role'> & {
  orientation?: 'horizontal' | 'vertical'
}

export function CheckboxGroup({ data, onEvent, orientation, ...rest }: CollectionProps<Extra>) {
  const kids = getChildren(data, ROOT)
  const checkedIds = new Set((data.entities[EXPANDED]?.data?.ids as string[] | undefined) ?? [])

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
