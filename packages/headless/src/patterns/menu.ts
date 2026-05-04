import { useCallback, useRef, useState } from 'react'
import { ROOT, getChildren, getLabel, isDisabled, type NormalizedData, type UiEvent } from '../types'
import { KEYS } from '../axes/keys'
import { activate, composeAxes, escape, expand, navigate, typeahead } from '../axes'
import { useRovingTabIndex } from '../roving/useRovingTabIndex'
import type { BaseItem, ItemProps, RootProps } from './types'

/** Options for {@link useMenuPattern}. */
export interface MenuOptions {
  /** aria-orientation. Spec implicit value: 'vertical'. */
  orientation?: 'horizontal' | 'vertical'
  closeOnSelect?: boolean
  autoFocus?: boolean
  onEscape?: () => void
  /** aria-label — ARIA: menu requires accessible name. */
  label?: string
  labelledBy?: string
  /** Container entity for nested sub-menus; defaults to ROOT. 자식들이 children 으로 사용된다. */
  containerId?: string
  /** controlled. 생략 시 패턴이 useState 자체 소유 — menu-button trigger 케이스. */
  open?: boolean
  defaultOpen?: boolean
  onOpenChange?: (open: boolean) => void
  /** activate 시 자동 닫힘 (closeOnSelect 와 조합되어 menu-button 표준 동작). */
}

// escape 가 navigate 보다 먼저 — Escape 키가 일반 nav 매핑보다 우선.
// expand 가 activate 보다 먼저 — children 있는 menuitem 의 Enter/Space/ArrowRight 는
// submenu open(+ first child focus)로 흐름. children 없는 leaf 는 expand 가 null →
// activate 로 떨어져 Enter/Space 가 activate 로 emit.
/** Menu 가 등록하는 axis — SSOT. */
export const menuAxis = (opts: { orientation?: 'horizontal' | 'vertical' } = {}) =>
  composeAxes(escape, expand, navigate(opts.orientation ?? 'vertical'), activate, typeahead)
const verticalAxis = menuAxis({ orientation: 'vertical' })
const horizontalAxis = menuAxis({ orientation: 'horizontal' })

/**
 * menu — APG `/menu/` recipe.
 * https://www.w3.org/WAI/ARIA/apg/patterns/menu/
 *
 * 키보드: ArrowUp/Down · Home/End · Enter/Space · typeahead. Escape 닫기는 소비자.
 */
export function useMenuPattern(
  data: NormalizedData,
  onEvent?: (e: UiEvent) => void,
  opts: MenuOptions = {},
): {
  rootProps: RootProps
  menuitemProps: (id: string) => ItemProps
  buttonProps: ItemProps
  items: BaseItem[]
  open: boolean
  /** 면제 사유: host-level menu-button 제어 (Escape 외부 닫기·외부 click 닫기 등). UI=activate 단발 (INVARIANTS #16) 의 host-control 예외. */
  setOpen: (open: boolean) => void
} {
  const {
    autoFocus, onEscape, orientation = 'vertical', label, labelledBy, containerId = ROOT,
    open: openProp, defaultOpen = false, onOpenChange, closeOnSelect = true,
  } = opts
  const [internalOpen, setInternalOpen] = useState(defaultOpen)
  const isControlled = openProp !== undefined
  const open = isControlled ? openProp : internalOpen
  const triggerRef = useRef<HTMLElement | null>(null)
  const setOpen = useCallback((next: boolean) => {
    if (!isControlled) setInternalOpen(next)
    onOpenChange?.(next)
    if (!next) requestAnimationFrame(() => triggerRef.current?.focus())
  }, [isControlled, onOpenChange])
  const axis = orientation === 'horizontal' ? horizontalAxis : verticalAxis
  // gesture/intent split: escape axis 가 emit 한 'open false' 를 close + onEscape 로 변환.
  const relay = useCallback((e: UiEvent) => {
    if (e.type === 'open' && e.open === false) { setOpen(false); onEscape?.(); return }
    if (e.type === 'activate' && closeOnSelect) {
      onEvent?.(e)
      setOpen(false)
      return
    }
    onEvent?.(e)
  }, [onEvent, onEscape, setOpen, closeOnSelect])
  const { focusId, bindFocus, delegate } = useRovingTabIndex(
    axis, data, relay, { autoFocus: autoFocus ?? open, containerId },
  )
  const ids = getChildren(data, containerId)

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

  const rootProps: RootProps = {
    role: 'menu',
    'aria-orientation': orientation,
    'aria-label': label,
    'aria-labelledby': labelledBy,
    ...delegate,
  } as RootProps

  const menuitemProps = (id: string): ItemProps => {
    const it = items.find((x) => x.id === id)
    const isFocus = focusId === id
    const ent = data.entities[id] ?? {}
    const kind = (ent.kind as 'menuitem' | 'menuitemcheckbox' | 'menuitemradio' | undefined) ?? 'menuitem'
    const rawChecked = ent.checked ?? ent.selected
    const checked: boolean | 'mixed' | undefined =
      kind === 'menuitem' ? undefined
        : rawChecked === 'mixed' ? 'mixed'
        : Boolean(rawChecked)
    const hasSub = getChildren(data, id).length > 0
    return {
      role: kind,
      ref: bindFocus(id) as React.Ref<HTMLElement>,
      'data-id': id,
      tabIndex: isFocus ? 0 : -1,
      'aria-disabled': it?.disabled || undefined,
      'aria-checked': checked,
      'aria-haspopup': hasSub ? 'menu' : undefined,
      'data-disabled': it?.disabled ? '' : undefined,
      'data-checked': checked === true ? '' : checked === 'mixed' ? 'mixed' : undefined,
      'data-has-sub': hasSub ? '' : undefined,
    } as unknown as ItemProps
  }

  const buttonProps: ItemProps = {
    type: 'button',
    ref: ((el: HTMLElement | null) => { triggerRef.current = el }) as React.Ref<HTMLElement>,
    'aria-haspopup': 'menu',
    'aria-expanded': open,
    onClick: () => setOpen(!open),
    onKeyDown: (e: React.KeyboardEvent) => {
      if (e.key === KEYS.ArrowDown && !open) {
        e.preventDefault()
        setOpen(true)
      }
    },
  } as unknown as ItemProps

  return { rootProps, menuitemProps, buttonProps, items, open, setOpen }
}
