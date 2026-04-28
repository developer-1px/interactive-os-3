import type { ComponentPropsWithoutRef } from 'react'
import {
  ROOT,
  getChildren, getLabel, isDisabled,
  type CollectionProps,
} from '../../headless/types'
import { activate, composeAxes, navigate } from '../../headless/axes'
import { activateOnNavigate } from '../../headless/gesture'
import { useRoving } from '../../headless/roving/useRoving'

type Extra = Omit<ComponentPropsWithoutRef<'div'>, 'role' | 'onKeyDown'> & {
  'aria-label'?: string
}

const axis = composeAxes(navigate('horizontal'), activate)

/**
 * SegmentedControl — iOS HIG / Material SegmentedButton / Polaris SegmentedControl.
 *
 * Tabs 와 의미 분리: SegmentedControl 은 *단일 컨트롤 값* (filter·view-mode),
 * Tabs 는 *콘텐츠 패널 전환*. Apple HIG 가 가장 명확하게 분리해 둠.
 *
 * APG radiogroup pattern: roving + arrow-follows-selection. selection follows focus.
 */
export function SegmentedControl({ data, onEvent, autoFocus, ...rest }: CollectionProps<Extra>) {
  const relay = (e: any) => activateOnNavigate(data, e).forEach((ev) => onEvent?.(ev))
  const { focusId, bindFocus, delegate } = useRoving(axis, data, relay, { autoFocus })
  const kids = getChildren(data, ROOT)

  return (
    <div role="radiogroup" data-part="segmented" onKeyDown={delegate.onKeyDown} {...rest}>
      {kids.map((id) => {
        const d = data.entities[id]?.data ?? {}
        const checked = Boolean(d.selected)
        const disabled = isDisabled(data, id)
        return (
          <button
            key={id}
            type="button"
            role="radio"
            data-id={id}
            data-part="segment"
            ref={bindFocus(id)}
            aria-checked={checked}
            aria-disabled={disabled || undefined}
            disabled={disabled}
            tabIndex={focusId === id ? 0 : -1}
            onClick={() => !disabled && onEvent?.({ type: 'activate', id })}
          >
            {getLabel(data, id)}
          </button>
        )
      })}
    </div>
  )
}
