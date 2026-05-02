import { useCallback } from 'react'
import { ROOT, getChildren, getLabel, isDisabled, type NormalizedData, type UiEvent } from '../types'
import { activate, composeAxes, multiSelect, navigate, typeahead } from '../axes'
import { selectionFollowsFocus as applySelectionFollowsFocus } from '../gesture'
import { useRovingTabIndex } from '../roving/useRovingTabIndex'
import type { BaseItem, ItemProps, RootProps } from './types'

export interface ListboxOptions {
  /** aria-orientation. Spec implicit value: 'vertical'. */
  orientation?: 'horizontal' | 'vertical'
  /** Default: `!multiSelectable` (APG: single sff, multi explicit toggle). */
  selectionFollowsFocus?: boolean
  /** aria-multiselectable. */
  multiSelectable?: boolean
  autoFocus?: boolean
  /** Container entity for nested listboxes (e.g. inside a Menu); defaults to ROOT. */
  containerId?: string
  /** aria-required (form context). */
  required?: boolean
  /** aria-readonly (form context). */
  readOnly?: boolean
  /** aria-invalid (form context). */
  invalid?: boolean
  /** aria-disabled (whole-listbox disabled). */
  disabled?: boolean
  /** aria-label — ARIA: listbox requires accessible name. */
  label?: string
  labelledBy?: string
}

// multiSelect must precede navigate — otherwise navigate matches Shift+Arrow first and the range branch never runs.
const axisFor = (orientation: 'horizontal' | 'vertical', multi: boolean) =>
  multi
    ? composeAxes(multiSelect, navigate(orientation), activate, typeahead)
    : composeAxes(navigate(orientation), activate, typeahead)

/**
 * listbox — APG `/listbox/` recipe.
 * https://www.w3.org/WAI/ARIA/apg/patterns/listbox/
 */
export function useListboxPattern(
  data: NormalizedData,
  onEvent?: (e: UiEvent) => void,
  opts: ListboxOptions = {},
): {
  rootProps: RootProps
  optionProps: (id: string) => ItemProps
  items: BaseItem[]
} {
  const {
    multiSelectable, autoFocus, containerId = ROOT, orientation = 'vertical',
    required, readOnly, invalid, disabled, label, labelledBy,
  } = opts
  const sff = opts.selectionFollowsFocus ?? !multiSelectable

  const relay = useCallback(
    (e: UiEvent) => {
      if (!onEvent) return
      const out = sff ? applySelectionFollowsFocus(data, e) : [e]
      out.forEach(onEvent)
    },
    [data, onEvent, sff],
  )

  const axis = axisFor(orientation, !!multiSelectable)
  const { focusId, bindFocus, delegate } = useRovingTabIndex(axis, data, relay, {
    autoFocus,
    containerId,
  })
  const ids = getChildren(data, containerId)

  const items: BaseItem[] = ids.map((id, i) => {
    const ent = data.entities[id]?.data ?? {}
    return {
      id,
      label: getLabel(data, id),
      selected: Boolean(ent.selected),
      disabled: isDisabled(data, id),
      posinset: i + 1,
      setsize: ids.length,
    }
  })
  const itemMap = new Map(items.map((it) => [it.id, it]))

  const rootProps: RootProps = {
    role: 'listbox',
    'aria-multiselectable': multiSelectable || undefined,
    'aria-orientation': orientation,
    'aria-required': required || undefined,
    'aria-readonly': readOnly || undefined,
    'aria-invalid': invalid || undefined,
    'aria-disabled': disabled || undefined,
    'aria-label': label,
    'aria-labelledby': labelledBy,
    ...delegate,
  } as RootProps

  const optionProps = (id: string): ItemProps => {
    const it = itemMap.get(id)
    const isFocus = focusId === id
    return {
      role: 'option',
      ref: bindFocus(id) as React.Ref<HTMLElement>,
      'data-id': id,
      tabIndex: isFocus ? 0 : -1,
      'aria-selected': it?.selected ?? false,
      'aria-disabled': it?.disabled || undefined,
      'aria-posinset': it?.posinset,
      'aria-setsize': it?.setsize,
      'data-selected': it?.selected ? '' : undefined,
      'data-disabled': it?.disabled ? '' : undefined,
      'data-focus-visible': isFocus ? '' : undefined,
    } as unknown as ItemProps
  }

  return { rootProps, optionProps, items }
}
