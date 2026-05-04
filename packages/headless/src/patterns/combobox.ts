import { useRef, useState } from 'react'
import {
  ROOT, getChildren, getLabel, isDisabled, getFocus,
  type NormalizedData, type UiEvent,
} from '../types'
import {
  activate as activateAxis, composeAxes, escape as escapeAxis, KEYS,
  navigate as navigateAxis,
} from '../axes'
import { bindAxis } from '../state/bind'
import { useActiveDescendant } from '../roving/useActiveDescendant'
import type { BaseItem, ItemProps, RootProps } from './types'

/** Combobox 가 등록하는 axis — SSOT. (Escape · Arrow/Home/End · Enter) */
export const comboboxAxis = () =>
  composeAxes(escapeAxis, navigateAxis('vertical'), activateAxis)

export interface ComboboxOptions {
  /** aria-autocomplete. APG: 'none' | 'list' | 'both'. */
  autocomplete?: 'none' | 'list' | 'both'
  /** aria-haspopup. Spec implicit: 'listbox'. */
  haspopup?: 'listbox' | 'tree' | 'grid' | 'dialog'
  /** aria-expanded — controlled. 생략 시 패턴이 useState 로 자체 보유. */
  expanded?: boolean
  defaultExpanded?: boolean
  onExpandedChange?: (expanded: boolean) => void
  idPrefix?: string
  required?: boolean
  readOnly?: boolean
  invalid?: boolean
  disabled?: boolean
  /** aria-label — combobox 입력의 accessible name (label 또는 labelledBy 필수). */
  label?: string
  labelledBy?: string
  /** popup listbox 의 aria-label / aria-labelledby. */
  popupLabel?: string
  popupLabelledBy?: string
}

/**
 * combobox — APG `/combobox/` recipe.
 * https://www.w3.org/WAI/ARIA/apg/patterns/combobox/
 *
 * 시그니처: 다른 컬렉션 패턴과 동일한 `(data, onEvent, opts)` —
 * memory `feedback_single_data_interface` · `feedback_data_driven_rendering` 정합.
 * query/filter 는 host 가 base data 변환으로 처리 (useMemo + fromList + useControlState).
 *
 * INVARIANT B11 ("포커스는 실제 DOM element 에 있다 — `aria-activedescendant` 는
 * Combobox 1곳 예외") 의 코드화. input 에 focus 유지, popup option 활성은 id 참조.
 *
 * INVARIANT B-16 면제: input editable context 의 onFocus/onBlur/onChange 는 axis
 * Trigger 모델(key|click) 밖이므로 host 가 직접 핸들링.
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
  comboboxProps: ItemProps
  listboxProps: RootProps
  optionProps: (id: string) => ItemProps
  items: BaseItem[]
  expanded: boolean
  setExpanded: (expanded: boolean) => void
} {
  const {
    autocomplete = 'list', haspopup = 'listbox',
    expanded: expandedProp, defaultExpanded = false, onExpandedChange, idPrefix = 'cmbx',
    required, readOnly, invalid, disabled, label, labelledBy, popupLabel, popupLabelledBy,
  } = opts
  const [internalExpanded, setInternalExpanded] = useState(defaultExpanded)
  const isControlled = expandedProp !== undefined
  const expanded = isControlled ? expandedProp : internalExpanded
  const setExpanded = (next: boolean) => {
    if (!isControlled) setInternalExpanded(next)
    onExpandedChange?.(next)
  }

  const inputRef = useRef<HTMLInputElement | null>(null)
  const activeId = getFocus(data) ?? null

  const ids = getChildren(data, ROOT)
  const listId = `${idPrefix}-list`
  const optionDomId = (id: string) => `${idPrefix}-opt-${id}`
  useActiveDescendant(inputRef, expanded && activeId ? optionDomId(activeId) : null)

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

  const requestExpanded = (open: boolean) => {
    setExpanded(open)
    onEvent?.({ type: 'open', id: ROOT, open })
  }

  // 키 매핑은 axis 합성으로 박제: Escape → open false, Arrow/Home/End → navigate, Enter → activate.
  const axis = comboboxAxis()
  const intent = (e: UiEvent) => {
    if (e.type === 'open' && e.open === false) { requestExpanded(false); return }
    if (e.type === 'activate') { onEvent?.(e); requestExpanded(false); return }
    if (e.type === 'navigate' && !expanded) requestExpanded(true)
    onEvent?.(e)
  }
  const { onKey: dispatchKey } = bindAxis(axis, data, intent)

  const onKeyDown = (e: React.KeyboardEvent) => {
    // gesture: activeId null 인 첫 ArrowDown/Up/Home/End → axis 가 sibling-relative 라
    // first/last 도출 불가 — 명시적 seed 로 흡수.
    if (!activeId) {
      if (e.key === KEYS.ArrowDown || e.key === KEYS.Home) {
        e.preventDefault()
        const target = ids[0]
        if (target) intent({ type: 'navigate', id: target })
        return
      }
      if (e.key === KEYS.ArrowUp || e.key === KEYS.End) {
        e.preventDefault()
        const target = ids[ids.length - 1]
        if (target) intent({ type: 'navigate', id: target })
        return
      }
    }
    // Home/End 는 expanded 일 때만 (APG)
    if ((e.key === KEYS.Home || e.key === KEYS.End) && !expanded) return
    dispatchKey(e, activeId ?? ROOT)
  }

  const comboboxProps: ItemProps = {
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

  const listboxProps: RootProps = {
    role: 'listbox',
    id: listId,
    hidden: !expanded || undefined,
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

  return { comboboxProps, listboxProps, optionProps, items, expanded, setExpanded }
}
