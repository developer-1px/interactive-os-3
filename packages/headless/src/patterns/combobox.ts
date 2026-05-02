import { useRef } from 'react'
import { ROOT, getChildren, getLabel, isDisabled, getFocus, type NormalizedData, type UiEvent } from '../types'
import { useActiveDescendant } from '../roving/useActiveDescendant'
import type { BaseItem, ItemProps, RootProps } from './types'

export interface ComboboxOptions {
  /** aria-autocomplete. APG: 'none' | 'list' | 'both'. */
  autocomplete?: 'none' | 'list' | 'both'
  /** aria-haspopup. Spec implicit: 'listbox'. */
  haspopup?: 'listbox' | 'tree' | 'grid' | 'dialog'
  /** APG combobox 기본은 input 에 focus 유지 + aria-activedescendant. */
  activeDescendant?: boolean
  /** aria-expanded — controlled. */
  expanded?: boolean
  onExpandedChange?: (expanded: boolean) => void
  idPrefix?: string
  /** aria-required (form context). */
  required?: boolean
  /** aria-readonly. */
  readOnly?: boolean
  /** aria-invalid. */
  invalid?: boolean
  /** aria-disabled — combobox 전체 비활성. */
  disabled?: boolean
  /** aria-label — combobox 입력 자체의 접근 가능 이름 (ARIA 필수). */
  label?: string
  labelledBy?: string
  /** popup listbox 의 aria-label 또는 aria-labelledby. */
  popupLabel?: string
  popupLabelledBy?: string
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
export function useComboboxPattern(
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
  const {
    autocomplete = 'list', haspopup = 'listbox',
    expanded = false, onExpandedChange, idPrefix = 'cmbx',
    required, readOnly, invalid, disabled, label, labelledBy, popupLabel, popupLabelledBy,
  } = opts

  const inputRef = useRef<HTMLInputElement | null>(null)
  const activeId = getFocus(data) ?? null

  const ids = getChildren(data, ROOT)
  const listId = `${idPrefix}-list`
  const optionDomId = (id: string) => `${idPrefix}-opt-${id}`
  useActiveDescendant(inputRef, expanded && activeId ? optionDomId(activeId) : null)

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

  const requestExpanded = (open: boolean) => {
    onExpandedChange?.(open)
    onEvent?.({ type: 'open', id: ROOT, open })
  }

  const navigateTo = (e: React.KeyboardEvent, id: string | undefined) => {
    if (!id || !onEvent) return
    e.preventDefault()
    if (!expanded) requestExpanded(true)
    onEvent({ type: 'navigate', id })
  }

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      const next = activeId
        ? ids[Math.min(ids.length - 1, ids.indexOf(activeId) + 1)]
        : ids[0]
      navigateTo(e, next)
    } else if (e.key === 'ArrowUp') {
      const prev = activeId
        ? ids[Math.max(0, ids.indexOf(activeId) - 1)]
        : ids[ids.length - 1]
      navigateTo(e, prev)
    } else if (e.key === 'Home' && expanded) {
      navigateTo(e, ids[0])
    } else if (e.key === 'End' && expanded) {
      navigateTo(e, ids[ids.length - 1])
    } else if (e.key === 'Enter' && activeId && onEvent) {
      e.preventDefault()
      onEvent({ type: 'activate', id: activeId })
      requestExpanded(false)
    } else if (e.key === 'Escape') {
      e.preventDefault()
      requestExpanded(false)
    }
  }

  const inputProps: ItemProps = {
    role: 'combobox',
    ref: inputRef as React.Ref<HTMLElement>,
    'aria-autocomplete': autocomplete,
    'aria-expanded': expanded,
    'aria-controls': listId,
    'aria-haspopup': haspopup,
    'aria-required': required || undefined,
    'aria-readonly': readOnly || undefined,
    'aria-invalid': invalid || undefined,
    'aria-disabled': disabled || undefined,
    'aria-label': label,
    'aria-labelledby': labelledBy,
    onKeyDown,
  } as unknown as ItemProps

  const popoverProps: RootProps = {
    role: 'presentation',
    hidden: !expanded,
  } as unknown as RootProps

  const listProps: RootProps = {
    role: 'listbox',
    id: listId,
    'aria-label': popupLabel,
    'aria-labelledby': popupLabelledBy,
  } as unknown as RootProps

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
