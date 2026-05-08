import { useRef, useMemo, useId, useEffect } from 'react'
import {
  ROOT, getChildren, getLabel, isDisabled, getFocus, isOpen,
  type NormalizedData, type UiEvent,
} from '../types'
import {
  activate, composeAxes, escape, INTENT_CHORDS, matchAnyChord,
  navigate, openControl,
} from '../axes'
import { bindAxis } from '../state/bind'
import { useControlValue } from '../state/useControlValue'
import { useActiveDescendant } from '../roving/useActiveDescendant'
import { useDialogPattern, type DialogOptions } from './dialog'
import type { BaseItem, ItemProps, RootProps } from './types'

/** combobox chord registry — declarative SSOT. */
const ARROW_DOWN = ['ArrowDown'] as const
const ARROW_UP = ['ArrowUp'] as const
const HOME = ['Home'] as const
const END = ['End'] as const
const FORWARD_OPEN = [...ARROW_DOWN, ...HOME] as const
const BACKWARD_OPEN = [...ARROW_UP, ...END] as const

/** Combobox 가 등록하는 axis — SSOT. (Escape · Alt+Arrow popup control · Arrow/Home/End · Enter) */
export const comboboxAxis = () =>
  composeAxes(escape, openControl, navigate('vertical'), activate)

/** Options for {@link useComboboxPattern}. */
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
  /**
   * focus 시 popup 자동 open. APG `combobox-autocomplete-none` 은 false
   * (Alt+Down 또는 typing 으로만 open). 그 외 default true.
   */
  openOnFocus?: boolean
  /** typing(onChange) 시 popup 자동 open. default true. */
  openOnType?: boolean
  /**
   * blur 시 현재 highlighted option 을 자동 commit.
   * APG `autocomplete='both'` default true, 그 외 false.
   */
  selectOnBlur?: boolean
  /**
   * query 변경 시 첫 visible option 을 자동 highlight (`aria-activedescendant`).
   * APG `autocomplete='both'` default true, 그 외 false.
   */
  autoHighlightFirst?: boolean
  /**
   * editable=false → APG `combobox-select-only`. textbox 가 아니라 button-like
   * `role="combobox"` 로 동작. 표시값은 selected option 의 label, 사용자 typing 없음.
   * default true.
   */
  editable?: boolean
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
/** dialog-popup 변종 반환 shape. APG combobox-datepicker recipe. */
export interface ComboboxDialogReturn {
  /** input/textbox element 에 spread. role="combobox" + aria-* 자동. */
  inputProps: ItemProps
  /** popover container (dialog) 에 spread. useDialogPattern 의 rootProps. */
  popoverProps: RootProps
  /** open icon button 에 spread (선택사항). */
  triggerProps: ItemProps
  open: boolean
  setOpen: (open: boolean) => void
}

/** dialog-popup variant (data 불필요). single-arg signature. */
export function useComboboxPattern(
  opts: Omit<ComboboxOptions, 'haspopup'> & { haspopup: 'dialog' } & Pick<DialogOptions, 'returnFocusRef' | 'initialFocusRef' | 'modal'>,
): ComboboxDialogReturn
/** listbox/tree/grid-popup variant (기존). */
export function useComboboxPattern(
  data: NormalizedData,
  onEvent?: (e: UiEvent) => void,
  opts?: ComboboxOptions,
): {
  comboboxProps: ItemProps
  listboxProps: RootProps
  optionProps: (id: string) => ItemProps
  items: BaseItem[]
  expanded: boolean
}
export function useComboboxPattern(
  arg0: NormalizedData | (Omit<ComboboxOptions, 'haspopup'> & { haspopup: 'dialog' } & Pick<DialogOptions, 'returnFocusRef' | 'initialFocusRef' | 'modal'>),
  onEvent?: (e: UiEvent) => void,
  optsArg: ComboboxOptions = {},
): unknown {
  // dialog-popup 분기 — single-arg form. data 불필요.
  if (!('entities' in (arg0 as object))) {
    return useComboboxDialogVariant(arg0 as Omit<ComboboxOptions, 'haspopup'> & { haspopup: 'dialog' } & Pick<DialogOptions, 'returnFocusRef' | 'initialFocusRef' | 'modal'>)
  }
  return useComboboxListboxVariant(arg0 as NormalizedData, onEvent, optsArg)
}

function useComboboxListboxVariant(
  data: NormalizedData,
  onEvent: ((e: UiEvent) => void) | undefined,
  opts: ComboboxOptions,
): {
  comboboxProps: ItemProps
  listboxProps: RootProps
  optionProps: (id: string) => ItemProps
  items: BaseItem[]
  expanded: boolean
} {
  const {
    value: valueProp, defaultValue = '',
    filter = defaultFilter,
    autocomplete = 'list', haspopup = 'listbox',
    closeOnBlurDelay = 100, commitOnActivate = true,
    openOnFocus = autocomplete !== 'none',
    openOnType = true,
    selectOnBlur = autocomplete === 'both',
    autoHighlightFirst = autocomplete === 'both',
    editable = true,
    idPrefix = 'cmbx',
    required, readOnly, invalid, disabled,
    label, labelledBy, popupLabel, popupLabelledBy,
  } = opts

  // query state — controlled/uncontrolled hybrid 헬퍼.
  const [query, setValue] = useControlValue<string>(valueProp, defaultValue, onEvent)

  const inputRef = useRef<HTMLInputElement | null>(null)
  const blurTimerRef = useRef<number | null>(null)

  const expanded = isOpen(data, ROOT)
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

  // select-only: 표시 label = currently selected option's label
  const selectedId = allIds.find((id) => data.entities[id]?.selected)
  const selectedLabel = selectedId ? getLabel(data, selectedId) : ''

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
    // escape axis emits { type:'open', id:activeId, open:false } — normalize to ROOT
    // since combobox open-state is tracked at the container level.
    if (e.type === 'open' && !e.open && e.id !== ROOT) {
      onEvent?.({ type: 'open', id: ROOT, open: false })
      return
    }
    onEvent?.(e)
  }

  const axis = comboboxAxis()
  const { onKey: dispatchKey } = bindAxis(axis, data, intent)

  const onKeyDown = (e: React.KeyboardEvent) => {
    // select-only + closed: Enter/Space/Down/Up/Home/End all open popup (APG)
    const ev = e as unknown as KeyboardEvent
    if (!editable && !expanded && (
      matchAnyChord(ev, INTENT_CHORDS.activate.trigger) ||
      matchAnyChord(ev, ARROW_DOWN) || matchAnyChord(ev, ARROW_UP) ||
      matchAnyChord(ev, HOME) || matchAnyChord(ev, END)
    )) {
      e.preventDefault()
      onEvent?.({ type: 'open', id: ROOT, open: true })
      const target = matchAnyChord(ev, BACKWARD_OPEN)
        ? allIds[allIds.length - 1]
        : (selectedId ?? allIds[0])
      if (target) onEvent?.({ type: 'navigate', id: target })
      return
    }
    if (!activeId) {
      if (matchAnyChord(ev, FORWARD_OPEN)) {
        e.preventDefault()
        const target = visibleIds[0]
        if (target) intent({ type: 'navigate', id: target })
        return
      }
      if (matchAnyChord(ev, BACKWARD_OPEN)) {
        e.preventDefault()
        const target = visibleIds[visibleIds.length - 1]
        if (target) intent({ type: 'navigate', id: target })
        return
      }
    }
    if ((matchAnyChord(ev, HOME) || matchAnyChord(ev, END)) && !expanded) return
    dispatchKey(e, activeId ?? ROOT)
  }

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const next = e.target.value
    setValue(next)
    if (openOnType && !expanded) onEvent?.({ type: 'open', id: ROOT, open: true })
    if (autoHighlightFirst) {
      const firstVisible = allIds.find((id) => filter(next, getLabel(data, id), id))
      if (firstVisible) onEvent?.({ type: 'navigate', id: firstVisible })
    }
  }
  const onFocus = () => {
    cancelBlurClose()
    inputRef.current?.select()
    if (openOnFocus && !expanded) onEvent?.({ type: 'open', id: ROOT, open: true })
  }
  const onBlur = () => {
    cancelBlurClose()
    blurTimerRef.current = window.setTimeout(() => {
      if (selectOnBlur && activeId) {
        onEvent?.({ type: 'activate', id: activeId })
        if (commitOnActivate) {
          const lbl = data.entities[activeId]?.label
          if (typeof lbl === 'string') setValue(lbl)
        }
      }
      onEvent?.({ type: 'open', id: ROOT, open: false })
      blurTimerRef.current = null
    }, closeOnBlurDelay)
  }

  const comboboxProps: ItemProps = editable
    ? ({
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
      } as unknown as ItemProps)
    : ({
        role: 'combobox',
        ref: inputRef as React.Ref<HTMLElement>,
        tabIndex: disabled ? -1 : 0,
        'aria-expanded': expanded,
        'aria-controls': listId,
        'aria-haspopup': haspopup,
        'aria-required': required || undefined,
        'aria-invalid': invalid || undefined,
        'aria-disabled': disabled || undefined,
        'aria-label': label,
        'aria-labelledby': labelledBy,
        'data-value': selectedLabel,
        children: selectedLabel,
        onClick: () => {
          if (disabled) return
          onEvent?.({ type: 'open', id: ROOT, open: !expanded })
        },
        onKeyDown,
        onBlur,
      } as unknown as ItemProps)

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

  return { comboboxProps, listboxProps, optionProps, items, expanded }
}

/**
 * combobox dialog-popup variant — APG `combobox-datepicker` recipe.
 * https://www.w3.org/WAI/ARIA/apg/patterns/combobox/examples/combobox-datepicker/
 *
 * data 없음 — popup 내용은 호스트가 임의 dialog 콘텐츠로 채움 (calendar grid 등).
 * 자유 텍스트 입력 충돌 방지: openOnType / openOnFocus default false.
 *
 * 키 흡수: ArrowDown / Alt+ArrowDown → open. Escape / outside click → close (useDialogPattern).
 * focus trap / returnFocus / Escape 모두 useDialogPattern 합성.
 */
function useComboboxDialogVariant(
  opts: Omit<ComboboxOptions, 'haspopup'> & { haspopup: 'dialog' } & Pick<DialogOptions, 'returnFocusRef' | 'initialFocusRef' | 'modal'>,
): ComboboxDialogReturn {
  const {
    label, labelledBy, required, readOnly, invalid, disabled,
    returnFocusRef, initialFocusRef, modal = false,
  } = opts
  const dialogId = useId()
  const inputRef = useRef<HTMLElement | null>(null)
  const dialog = useDialogPattern({
    modal,
    returnFocusRef: returnFocusRef ?? (inputRef as React.RefObject<HTMLElement | null>),
    initialFocusRef,
    label: label ?? 'Combobox popup',
    labelledBy,
  })
  const { open, setOpen, rootProps: dialogRootProps, rootRef: dialogRootRef } = dialog

  // outside click — input + dialog 외부 mousedown 시 close.
  useEffect(() => {
    if (!open) return
    const onDocDown = (e: MouseEvent) => {
      const t = e.target as Node | null
      if (!t) return
      if (dialogRootRef.current?.contains(t)) return
      if (inputRef.current?.contains(t)) return
      setOpen(false)
    }
    document.addEventListener('mousedown', onDocDown)
    return () => document.removeEventListener('mousedown', onDocDown)
  }, [open, dialogRootRef, setOpen])

  const onKeyDown = (e: React.KeyboardEvent) => {
    const ev = e as unknown as KeyboardEvent
    // Alt+ArrowDown / ArrowDown → open. APG combobox-datepicker.
    if (matchAnyChord(ev, ['ArrowDown', 'Alt+ArrowDown'])) {
      if (!open) {
        e.preventDefault()
        setOpen(true)
      }
      return
    }
    // Escape close — useDialogPattern 의 global Escape 가 처리.
  }

  const inputProps: ItemProps = {
    role: 'combobox',
    ref: inputRef as React.Ref<HTMLElement>,
    'aria-haspopup': 'dialog',
    'aria-expanded': open,
    'aria-controls': dialogId,
    'aria-required': required || undefined,
    'aria-readonly': readOnly || undefined,
    'aria-invalid': invalid || undefined,
    'aria-disabled': disabled || undefined,
    'aria-label': label,
    'aria-labelledby': labelledBy,
    onKeyDown,
  } as unknown as ItemProps

  const popoverProps: RootProps = {
    ...dialogRootProps,
    id: dialogId,
  } as unknown as RootProps

  const triggerProps: ItemProps = {
    type: 'button',
    tabIndex: -1,
    'aria-label': label ? `Open ${label}` : 'Open',
    onClick: () => setOpen(!open),
  } as unknown as ItemProps

  return { inputProps, popoverProps, triggerProps, open, setOpen }
}
