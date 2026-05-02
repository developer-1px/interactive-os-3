import { useCallback } from 'react'
import { ROOT, getChildren, getLabel, isDisabled, type NormalizedData, type UiEvent } from '../types'
import { activate, composeAxes, multiSelect, navigate, typeahead } from '../axes'
import { selectionFollowsFocus as applySelectionFollowsFocus } from '../gesture'
import { useRovingTabIndex } from '../roving/useRovingTabIndex'
import type { BaseItem, ItemProps, RootProps } from './types'

export interface ListboxOptions {
  /** Default: `!multiSelectable` (APG: single sff, multi explicit toggle). */
  selectionFollowsFocus?: boolean
  multiSelectable?: boolean
  autoFocus?: boolean
  /** Container entity for nested listboxes (e.g. inside a Menu); defaults to ROOT. */
  containerId?: string
}

const singleAxis = composeAxes(navigate('vertical'), activate, typeahead)
const multiAxis = composeAxes(navigate('vertical'), multiSelect, activate, typeahead)

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
  const { multiSelectable, autoFocus, containerId = ROOT } = opts
  const sff = opts.selectionFollowsFocus ?? !multiSelectable

  const relay = useCallback(
    (e: UiEvent) => {
      if (!onEvent) return
      const out = sff ? applySelectionFollowsFocus(data, e) : [e]
      out.forEach(onEvent)
    },
    [data, onEvent, sff],
  )

  const axis = multiSelectable ? multiAxis : singleAxis
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

  const rootProps: RootProps = {
    role: 'listbox',
    'aria-multiselectable': multiSelectable || undefined,
    ...delegate,
  } as RootProps

  const optionProps = (id: string): ItemProps => {
    const it = items.find((x) => x.id === id)
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
