import { useRef } from 'react'
import { ROOT, getChildren, getLabel, isDisabled, getFocus, type NormalizedData, type UiEvent } from '../types'
import { useActiveDescendant } from '../roving/useActiveDescendant'
import type { BaseItem, ItemProps, RootProps } from './types'

export interface ComboboxOptions {
  /** APG: 'none' | 'list' | 'both'. */
  autocomplete?: 'none' | 'list' | 'both'
  /** APG combobox 기본은 input 에 focus 유지 + aria-activedescendant. */
  activeDescendant?: boolean
  expanded?: boolean
  idPrefix?: string
}

/**
 * combobox — APG `/combobox/` recipe.
 * https://www.w3.org/WAI/ARIA/apg/patterns/combobox/
 *
 * INVARIANT B11 ("포커스는 실제 DOM element 에 있다 — `aria-activedescendant` 는
 * Combobox 1곳 예외") 의 코드화. input 에 focus 유지, popup option 활성은 id 참조.
 *
 * 키보드 (input 위에서):
 *   ArrowDown — popup 열고 첫 active descendant
 *   ArrowUp/Down — active descendant 이동
 *   Enter — 활성 option activate
 *   Escape — popup 닫기 (소비자가 expanded false 로)
 */
export function combobox(
  data: NormalizedData,
  onEvent?: (e: UiEvent) => void,
  opts: ComboboxOptions = {},
): {
  inputProps: ItemProps
  popoverProps: RootProps
  listProps: RootProps
  optionProps: (id: string) => ItemProps
  items: BaseItem[]
} {
  const { autocomplete = 'list', expanded = false, idPrefix = 'cmbx' } = opts

  const inputRef = useRef<HTMLInputElement | null>(null)
  const activeId = getFocus(data) ?? null
  useActiveDescendant(inputRef, expanded ? activeId : null)

  const ids = getChildren(data, ROOT)
  const listId = `${idPrefix}-list`
  const optionDomId = (id: string) => `${idPrefix}-opt-${id}`

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

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (!onEvent) return
    if (e.key === 'ArrowDown') {
      const next = activeId
        ? ids[Math.min(ids.length - 1, ids.indexOf(activeId) + 1)]
        : ids[0]
      if (next) { e.preventDefault(); onEvent({ type: 'navigate', id: next }) }
    } else if (e.key === 'ArrowUp') {
      const prev = activeId
        ? ids[Math.max(0, ids.indexOf(activeId) - 1)]
        : ids[ids.length - 1]
      if (prev) { e.preventDefault(); onEvent({ type: 'navigate', id: prev }) }
    } else if (e.key === 'Home' && expanded) {
      e.preventDefault(); onEvent({ type: 'navigate', id: ids[0] })
    } else if (e.key === 'End' && expanded) {
      e.preventDefault(); onEvent({ type: 'navigate', id: ids[ids.length - 1] })
    } else if (e.key === 'Enter' && activeId) {
      e.preventDefault(); onEvent({ type: 'activate', id: activeId })
    } else if (e.key === 'Escape') {
      onEvent({ type: 'expand', id: ROOT, open: false })
    }
  }

  const inputProps: ItemProps = {
    role: 'combobox',
    ref: inputRef as React.Ref<HTMLElement>,
    'aria-autocomplete': autocomplete,
    'aria-expanded': expanded,
    'aria-controls': listId,
    'aria-haspopup': 'listbox',
    onKeyDown,
  } as unknown as ItemProps

  const popoverProps: RootProps = {
    role: 'presentation',
    hidden: !expanded,
  } as unknown as RootProps

  const listProps: RootProps = {
    role: 'listbox',
    id: listId,
  } as RootProps

  const optionProps = (id: string): ItemProps => {
    const it = items.find((x) => x.id === id)
    const isActive = activeId === id
    return {
      role: 'option',
      id: optionDomId(id),
      'data-id': id,
      'aria-selected': it?.selected ?? false,
      'aria-disabled': it?.disabled || undefined,
      'data-active': isActive ? '' : undefined,
      'data-selected': it?.selected ? '' : undefined,
    } as unknown as ItemProps
  }

  return { inputProps, popoverProps, listProps, optionProps, items }
}
