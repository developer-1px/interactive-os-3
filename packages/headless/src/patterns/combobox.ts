import { useRef, useState, useMemo } from 'react'
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
  /** controlled input value. 생략 시 패턴이 useState 로 자체 보유. */
  value?: string
  defaultValue?: string
  /** filter — query 로 visible 좁힘. default: label.toLowerCase().includes(q.toLowerCase()). */
  filter?: (query: string, label: string, id: string) => boolean
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

const defaultFilter = (q: string, label: string): boolean =>
  label.toLowerCase().includes(q.toLowerCase())

/**
 * combobox — APG `/combobox/` recipe.
 * https://www.w3.org/WAI/ARIA/apg/patterns/combobox/
 *
 * 시그니처: 다른 컬렉션 패턴과 동일한 `(data, onEvent, opts)`.
 *   data — host 가 NormalizedData 한 번 만들어 useControlState 통과
 *   onEvent — 모든 변화 단일 dispatch interface
 *
 * **패턴 내부에서 흡수하는 책임** (host 가 안 다뤄도 됨):
 *   - input value (query) state — uncontrolled default, value 옵션으로 controlled 도 가능
 *   - filter visible ids — default label.includes, filter 옵션으로 override
 *   - lifecycle 이벤트 (focus/blur/change) — 모두 onEvent 로 dispatch
 *   - activate 후속 (popup close + commit) — APG 표준 동작 자동
 *
 * 모든 emit:
 *   typing  → {type:'value', id:ROOT, value}
 *   focus   → {type:'open',  id:ROOT, open:true}
 *   blur    → {type:'open',  id:ROOT, open:false}  (closeOnBlurDelay 후)
 *   nav     → {type:'navigate', id}
 *   activate→ {type:'activate', id} + {type:'open', open:false} + (commitOnActivate) {type:'value', value:label}
 *   escape  → {type:'open', open:false}
 *
 * INVARIANT B11: input 에 focus 유지, popup option 활성은 aria-activedescendant.
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
    value: valueProp, defaultValue = '',
    filter = defaultFilter,
    autocomplete = 'list', haspopup = 'listbox',
    closeOnBlurDelay = 100, commitOnActivate = true,
    idPrefix = 'cmbx',
    required, readOnly, invalid, disabled,
    label, labelledBy, popupLabel, popupLabelledBy,
  } = opts

  // query state — uncontrolled default, value 옵션으로 controlled.
  const [internalValue, setInternalValue] = useState(defaultValue)
  const isControlled = valueProp !== undefined
  const query = isControlled ? valueProp : internalValue
  const setValue = (next: string) => {
    if (!isControlled) setInternalValue(next)
    onEvent?.({ type: 'value', id: ROOT, value: next })
  }

  const inputRef = useRef<HTMLInputElement | null>(null)
  const blurTimerRef = useRef<number | null>(null)

  const expanded = Boolean(data.meta?.open?.includes(ROOT))
  const activeId = getFocus(data) ?? null
  const allIds = getChildren(data, ROOT)
  const listId = `${idPrefix}-list`
  const optionDomId = (id: string) => `${idPrefix}-opt-${id}`
  useActiveDescendant(inputRef, expanded && activeId ? optionDomId(activeId) : null)

  // visible — query 로 좁힘.
  const visibleIds = useMemo(
    () => allIds.filter((id) => filter(query, getLabel(data, id), id)),
    [allIds, query, filter, data],
  )

  const items: BaseItem[] = visibleIds.map((id, i) => {
    const ent = data.entities[id] ?? {}
    return {
      id,
      label: getLabel(data, id),
      selected: Boolean(ent.selected),
      disabled: isDisabled(data, id),
      posinset: i + 1,
      setsize: visibleIds.length,
    }
  })

  const cancelBlurClose = () => {
    if (blurTimerRef.current !== null) {
      clearTimeout(blurTimerRef.current)
      blurTimerRef.current = null
    }
  }

  const intent = (e: UiEvent) => {
    if (e.type === 'navigate' && !expanded) onEvent?.({ type: 'open', id: ROOT, open: true })
    if (e.type === 'activate') {
      onEvent?.(e)
      onEvent?.({ type: 'open', id: ROOT, open: false })
      if (commitOnActivate) {
        const lbl = data.entities[e.id]?.label
        if (typeof lbl === 'string') setValue(lbl)
      }
      return
    }
    onEvent?.(e)
  }

  const axis = comboboxAxis()
  const { onKey: dispatchKey } = bindAxis(axis, data, intent)

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (!activeId) {
      if (e.key === KEYS.ArrowDown || e.key === KEYS.Home) {
        e.preventDefault()
        const target = visibleIds[0]
        if (target) intent({ type: 'navigate', id: target })
        return
      }
      if (e.key === KEYS.ArrowUp || e.key === KEYS.End) {
        e.preventDefault()
        const target = visibleIds[visibleIds.length - 1]
        if (target) intent({ type: 'navigate', id: target })
        return
      }
    }
    if ((e.key === KEYS.Home || e.key === KEYS.End) && !expanded) return
    dispatchKey(e, activeId ?? ROOT)
  }

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value)
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
    value: query,
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
