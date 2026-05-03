import { useCallback } from 'react'
import { ROOT, getChildren, getLabel, isDisabled, type NormalizedData, type UiEvent } from '../types'
import { activate, composeAxes, navigate } from '../axes'
import { selectionFollowsFocus as applySelectionFollowsFocus } from '../gesture'
import { useRovingTabIndex } from '../roving/useRovingTabIndex'
import type { BaseItem, ItemProps, RootProps } from './types'

export interface RadioGroupOptions {
  /** 시각·aria-orientation 만. 키보드는 양 축 모두 항상 활성. */
  orientation?: 'horizontal' | 'vertical'
  autoFocus?: boolean
  /** aria-required (form context). */
  required?: boolean
  /** aria-readonly. */
  readOnly?: boolean
  /** aria-invalid. */
  invalid?: boolean
  /** aria-disabled — radiogroup 전체 비활성. */
  disabled?: boolean
  /** aria-label — ARIA: radiogroup requires accessible name. */
  label?: string
  /** aria-labelledby (외부 label element 연결). */
  labelledBy?: string
}

// APG radiogroup: 양 축 Arrow 모두 navigate.
const axis = composeAxes(navigate('vertical'), navigate('horizontal'), activate)

/**
 * radioGroup — APG `/radio/` recipe.
 * https://www.w3.org/WAI/ARIA/apg/patterns/radio/
 *
 * 항상 selection-follows-focus (APG 강제). single-select.
 */
export function useRadioGroupPattern(
  data: NormalizedData,
  onEvent?: (e: UiEvent) => void,
  opts: RadioGroupOptions = {},
): {
  rootProps: RootProps
  radioProps: (id: string) => ItemProps
  items: BaseItem[]
} {
  const { orientation = 'vertical', autoFocus, required, readOnly, invalid, disabled, label, labelledBy } = opts

  const relay = useCallback(
    (e: UiEvent) => {
      if (!onEvent) return
      applySelectionFollowsFocus(data, e).forEach(onEvent)
    },
    [data, onEvent],
  )

  const { focusId, bindFocus, delegate } = useRovingTabIndex(axis, data, relay, { autoFocus })
  const ids = getChildren(data, ROOT)

  const items: BaseItem[] = ids.map((id, i) => {
    const ent = data.entities[id] ?? {}
    return {
      id,
      label: getLabel(data, id),
      selected: Boolean(ent.selected),
      disabled: isDisabled(data, id),
      posinset: i + 1,
      setsize: ids.length,
    }
  })

  const rootProps: RootProps = {
    role: 'radiogroup',
    'aria-orientation': orientation,
    'aria-required': required || undefined,
    'aria-readonly': readOnly || undefined,
    'aria-invalid': invalid || undefined,
    'aria-disabled': disabled || undefined,
    'aria-label': label,
    'aria-labelledby': labelledBy,
    ...delegate,
  } as RootProps

  const radioProps = (id: string): ItemProps => {
    const it = items.find((x) => x.id === id)
    const isFocus = focusId === id
    return {
      role: 'radio',
      ref: bindFocus(id) as React.Ref<HTMLElement>,
      'data-id': id,
      tabIndex: isFocus ? 0 : -1,
      'aria-checked': it?.selected ?? false,
      'aria-disabled': it?.disabled || undefined,
      'data-selected': it?.selected ? '' : undefined,
      'data-disabled': it?.disabled ? '' : undefined,
    } as unknown as ItemProps
  }

  return { rootProps, radioProps, items }
}
