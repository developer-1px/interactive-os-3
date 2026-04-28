import type { ComponentPropsWithoutRef } from 'react'
import {
  ROOT,
  getChildren, getLabel, isDisabled,
  type CollectionProps,
} from '../../headless/types'
import { activate, composeAxes, navigate } from '../../headless/axes'
import { useRoving } from '../../headless/roving/useRoving'
import { ToggleButton } from '../2-input/ToggleButton'

type Extra = Omit<ComponentPropsWithoutRef<'div'>, 'role' | 'onKeyDown'> & {
  orientation?: 'horizontal' | 'vertical'
  'aria-label'?: string
}

/**
 * ToggleGroup — Radix ToggleGroup / Ariakit ToggleProvider / RAC ToggleButtonGroup.
 *
 * 선택 상태는 entity.data.selected: boolean. type="single|multiple" 의 라우팅은
 * 소비자(reducer) 책임 — emit 만 단발 'activate'. data-driven 단일 인터페이스.
 *
 * ARIA: role="group" (Radix 와 동일). single-select toolbar 의도면 Toolbar 사용.
 */
export function ToggleGroup({ data, onEvent, orientation = 'horizontal', autoFocus, ...rest }: CollectionProps<Extra>) {
  const axis = composeAxes(navigate(orientation), activate)
  const { focusId, bindFocus, delegate } = useRoving(axis, data, onEvent ?? (() => {}), { autoFocus })
  const kids = getChildren(data, ROOT)

  return (
    <div role="group" data-part="toggle-group" data-orientation={orientation} onKeyDown={delegate.onKeyDown} {...rest}>
      {kids.map((id) => {
        const d = data.entities[id]?.data ?? {}
        const pressed = Boolean(d.selected)
        const disabled = isDisabled(data, id)
        return (
          <ToggleButton
            key={id}
            data-id={id}
            ref={bindFocus(id)}
            pressed={pressed}
            disabled={disabled}
            tabIndex={focusId === id ? 0 : -1}
            onClick={() => !disabled && onEvent?.({ type: 'activate', id })}
          >
            {getLabel(data, id)}
          </ToggleButton>
        )
      })}
    </div>
  )
}
