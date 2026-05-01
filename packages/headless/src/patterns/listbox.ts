import { useCallback } from 'react'
import { ROOT, getChildren, getLabel, isDisabled, type NormalizedData, type UiEvent } from '../types'
import { activate, composeAxes, navigate, typeahead } from '../axes'
import { selectionFollowsFocus as applySelectionFollowsFocus } from '../gesture'
import { useRovingTabIndex } from '../roving/useRovingTabIndex'
import type { BaseItem, ItemProps, RootProps } from './types'

export interface ListboxOptions {
  /** APG single-select listbox 기본은 selection follows focus (true). */
  selectionFollowsFocus?: boolean
  multiSelectable?: boolean
  autoFocus?: boolean
  /** ROOT 외 다른 entity 를 컨테이너로 쓸 때 (Menu 안의 sub listbox 등). */
  containerId?: string
}

const axis = composeAxes(navigate('vertical'), activate, typeahead)

/**
 * listbox — APG `/listbox/` recipe.
 * https://www.w3.org/WAI/ARIA/apg/patterns/listbox/
 *
 * 키보드: ArrowUp/Down · Home/End · Enter/Space · typeahead.
 * 선택: 기본 selection-follows-focus (Arrow 만으로 선택 이동).
 */
export function listbox(
  data: NormalizedData,
  onEvent?: (e: UiEvent) => void,
  opts: ListboxOptions = {},
): {
  rootProps: RootProps
  optionProps: (id: string) => ItemProps
  items: BaseItem[]
} {
  const { selectionFollowsFocus: sff = true, multiSelectable, autoFocus, containerId = ROOT } = opts

  const relay = useCallback(
    (e: UiEvent) => {
      if (!onEvent) return
      const out = sff ? applySelectionFollowsFocus(data, e) : [e]
      out.forEach(onEvent)
    },
    [data, onEvent, sff],
  )

  const { focusId, bindFocus, delegate } = useRovingTabIndex(axis, data, relay, { autoFocus })
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
