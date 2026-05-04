import { useRef } from 'react'
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
  /** controlled input value. host 가 onEvent 의 'value' 로 갱신. */
  value?: string
  /** aria-autocomplete. APG: 'none' | 'list' | 'both'. */
  autocomplete?: 'none' | 'list' | 'both'
  /** aria-haspopup. Spec implicit: 'listbox'. */
  haspopup?: 'listbox' | 'tree' | 'grid' | 'dialog'
  /** outside click 흡수 — option click 과 race 방지. de facto 100ms. */
  closeOnBlurDelay?: number
  /** activate 시 input value 를 선택된 label 로 갱신 (APG default). */
  commitOnActivate?: boolean
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
 *
 * **모든 이벤트가 onEvent 를 통해 dispatch** (이전 버전의 setExpanded 명령형 호출 제거):
 *   - input typing      → `{type:'value', id: ROOT, value}`
 *   - focus / blur      → `{type:'open',  id: ROOT, open: true|false}`
 *   - Arrow/Home/End    → `{type:'navigate', id}`
 *   - Enter             → `{type:'activate', id}`
 *   - Escape            → `{type:'open',  id: ROOT, open: false}`
 *   - option click      → `{type:'activate', id}`
 *
 * expanded 는 `data.meta.open` 에서 도출 (reduce 가 'open' event 자동 처리).
 * input value 는 host 가 controlled — `value` 옵션 주입 + onEvent 의 'value' 처리.
 *
 * INVARIANT B11: input 에 focus 유지, popup option 활성은 aria-activedescendant.
 *
 * 키보드 (input 위에서):
 *   ArrowDown — popup 열고 첫 active descendant
 *   ArrowUp/Down — active descendant 이동
 *   Enter — 활성 option activate
 *   Escape — popup 닫기
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
} {
  const {
    value,
    autocomplete = 'list', haspopup = 'listbox',
    closeOnBlurDelay = 100, commitOnActivate = true,
    idPrefix = 'cmbx',
    required, readOnly, invalid, disabled,
    label, labelledBy, popupLabel, popupLabelledBy,
  } = opts

  const inputRef = useRef<HTMLInputElement | null>(null)
  const blurTimerRef = useRef<number | null>(null)

  const expanded = Boolean(data.meta?.open?.includes(ROOT))
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

  const cancelBlurClose = () => {
    if (blurTimerRef.current !== null) {
      clearTimeout(blurTimerRef.current)
      blurTimerRef.current = null
    }
  }

  // intent — axis emit + 우리 lifecycle emit 모두 onEvent 로 통일.
  const intent = (e: UiEvent) => {
    if (e.type === 'navigate' && !expanded) onEvent?.({ type: 'open', id: ROOT, open: true })
    if (e.type === 'activate') {
      onEvent?.(e)
      onEvent?.({ type: 'open', id: ROOT, open: false })
      if (commitOnActivate) {
        const lbl = data.entities[e.id]?.label
        if (typeof lbl === 'string') onEvent?.({ type: 'value', id: ROOT, value: lbl })
      }
      return
    }
    onEvent?.(e)
  }

  const axis = comboboxAxis()
  const { onKey: dispatchKey } = bindAxis(axis, data, intent)

  const onKeyDown = (e: React.KeyboardEvent) => {
    // gesture: activeId null 인 첫 ArrowDown/Up/Home/End → axis sibling-relative 라
    // first/last 도출 불가. 명시적 seed 로 흡수.
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
    if ((e.key === KEYS.Home || e.key === KEYS.End) && !expanded) return
    dispatchKey(e, activeId ?? ROOT)
  }

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onEvent?.({ type: 'value', id: ROOT, value: e.target.value })
    if (!expanded) onEvent?.({ type: 'open', id: ROOT, open: true })
  }
  const onFocus = () => {
    cancelBlurClose()
    inputRef.current?.select()
    if (!expanded) onEvent?.({ type: 'open', id: ROOT, open: true })
  }
  const onBlur = () => {
    cancelBlurClose()
    blurTimerRef.current = window.setTimeout(() => {
      onEvent?.({ type: 'open', id: ROOT, open: false })
      blurTimerRef.current = null
    }, closeOnBlurDelay)
  }

  const comboboxProps: ItemProps = {
    role: 'combobox',
    ref: inputRef as React.Ref<HTMLElement>,
    value: value ?? '',
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
    onChange,
    onFocus,
    onBlur,
  } as unknown as ItemProps

  const listboxProps: RootProps = {
    role: 'listbox',
    id: listId,
    hidden: !expanded || undefined,
    'aria-label': popupLabel,
    'aria-labelledby': popupLabelledBy,
    onMouseDown: (e: React.MouseEvent) => {
      // option click 시 input blur → close 방지.
      e.preventDefault()
      cancelBlurClose()
    },
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
      onClick: () => intent({ type: 'activate', id }),
    } as unknown as ItemProps
  }

  return { comboboxProps, listboxProps, optionProps, items }
}
