import { useState } from 'react'
import { ROOT, getChildren, getLabel, isDisabled, type NormalizedData, type UiEvent } from '../types'
import type { BaseItem, ItemProps, RootProps } from './types'

export type CheckboxState = boolean | 'mixed'

/** Options for {@link checkboxPattern}. */
export interface CheckboxOptions {
  checked?: CheckboxState
  defaultChecked?: CheckboxState
  onCheckedChange?: (next: boolean) => void
  disabled?: boolean
  required?: boolean
  invalid?: boolean
  label?: string
  labelledBy?: string
}

/**
 * checkbox — APG `/checkbox/` recipe (single + mixed).
 * https://www.w3.org/WAI/ARIA/apg/patterns/checkbox/
 *
 * Native `<input type="checkbox">` 가 가능하면 그쪽이 우선. 본 recipe 는
 *   1) host element 가 `<button>` / `<div>` 인 케이스
 *   2) tri-state (`aria-checked="mixed"`)
 * 두 변종을 흡수. mixed → click 은 false → true 로 진행 (APG default).
 */
export function checkboxPattern(opts: CheckboxOptions = {}): {
  checkboxProps: ItemProps
  checked: CheckboxState
  setChecked: (next: boolean) => void
} {
  const { checked: cProp, defaultChecked = false, onCheckedChange, disabled, required, invalid, label, labelledBy } = opts
  const [internal, setInternal] = useState<CheckboxState>(defaultChecked)
  const isControlled = cProp !== undefined
  const checked = isControlled ? cProp : internal
  const setChecked = (next: boolean) => {
    if (!isControlled) setInternal(next)
    onCheckedChange?.(next)
  }
  const toggle = () => {
    if (disabled) return
    setChecked(checked === true ? false : true)
  }

  const checkboxProps: ItemProps = {
    role: 'checkbox',
    type: 'button',
    tabIndex: disabled ? -1 : 0,
    'aria-checked': checked === 'mixed' ? 'mixed' : Boolean(checked),
    'aria-disabled': disabled || undefined,
    'aria-required': required || undefined,
    'aria-invalid': invalid || undefined,
    'aria-label': label,
    'aria-labelledby': labelledBy,
    'data-state': checked === 'mixed' ? 'mixed' : checked ? 'checked' : 'unchecked',
    onClick: toggle,
    onKeyDown: (e: React.KeyboardEvent) => {
      if (e.key === ' ') {
        e.preventDefault()
        toggle()
      }
    },
  } as unknown as ItemProps

  return { checkboxProps, checked, setChecked }
}

/** Options for {@link useCheckboxGroupPattern}. */
export interface CheckboxGroupOptions {
  containerId?: string
  label?: string
  labelledBy?: string
}

/**
 * checkbox-group — APG `/checkbox/examples/checkbox-mixed/` 변종.
 * 부모 checkbox 가 자식 checkbox 들의 mixed-state 를 derive.
 *
 * data: ROOT children = child checkbox ids. 각 child entity 의 `selected` 가
 * checked 상태. 부모 state 는 자동 계산:
 *   all true  → parent = true
 *   all false → parent = false
 *   else      → parent = 'mixed'
 *
 * parent click 시 자식 전체를 true (mixed/false 일 때) / false (all true 일 때) 로
 * `selectMany` emit. 자식 click 은 host 가 `select` event 로 dispatch.
 */
export function useCheckboxGroupPattern(
  data: NormalizedData,
  onEvent?: (e: UiEvent) => void,
  opts: CheckboxGroupOptions = {},
): {
  groupProps: RootProps
  parentProps: ItemProps
  childProps: (id: string) => ItemProps
  parentChecked: CheckboxState
  items: BaseItem[]
} {
  const { containerId = ROOT, label, labelledBy } = opts
  const ids = getChildren(data, containerId)
  const items: BaseItem[] = ids.map((id, i) => ({
    id,
    label: getLabel(data, id),
    selected: Boolean(data.entities[id]?.selected),
    disabled: isDisabled(data, id),
    posinset: i + 1,
    setsize: ids.length,
  }))
  const checkedCount = items.filter((it) => it.selected).length
  const parentChecked: CheckboxState =
    checkedCount === 0 ? false : checkedCount === items.length ? true : 'mixed'

  const toggleParent = () => {
    const next = parentChecked !== true
    onEvent?.({ type: 'selectMany', ids, to: next })
  }

  const groupProps: RootProps = {
    role: 'group',
    'aria-label': label,
    'aria-labelledby': labelledBy,
  } as unknown as RootProps

  const parentProps: ItemProps = {
    role: 'checkbox',
    type: 'button',
    tabIndex: 0,
    'aria-checked': parentChecked === 'mixed' ? 'mixed' : Boolean(parentChecked),
    'data-state': parentChecked === 'mixed' ? 'mixed' : parentChecked ? 'checked' : 'unchecked',
    onClick: toggleParent,
    onKeyDown: (e: React.KeyboardEvent) => {
      if (e.key === ' ') {
        e.preventDefault()
        toggleParent()
      }
    },
  } as unknown as ItemProps

  const childProps = (id: string): ItemProps => {
    const it = items.find((x) => x.id === id)
    const disabled = it?.disabled || false
    return {
      role: 'checkbox',
      type: 'button',
      tabIndex: disabled ? -1 : 0,
      'aria-checked': Boolean(it?.selected),
      'aria-disabled': disabled || undefined,
      'data-state': it?.selected ? 'checked' : 'unchecked',
      onClick: () => {
        if (disabled) return
        onEvent?.({ type: 'select', id })
      },
      onKeyDown: (e: React.KeyboardEvent) => {
        if (e.key === ' ' && !disabled) {
          e.preventDefault()
          onEvent?.({ type: 'select', id })
        }
      },
    } as unknown as ItemProps
  }

  return { groupProps, parentProps, childProps, parentChecked, items }
}
