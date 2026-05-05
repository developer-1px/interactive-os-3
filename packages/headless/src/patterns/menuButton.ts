import { useEffect, useRef, useState } from 'react'
import {
  ROOT, getChildren, getLabel, isDisabled,
  type NormalizedData, type UiEvent,
} from '../types'
import { KEYS, INTENTS, matchChord } from '../axes'
import type { BaseItem, ItemProps, RootProps } from './types'

/** Options for {@link useMenuButtonPattern}. */
export interface MenuButtonOptions {
  /** controlled open. 생략 시 패턴이 useState 자체 보유. */
  open?: boolean
  defaultOpen?: boolean
  onOpenChange?: (open: boolean) => void
  /**
   * APG `menu-button-actions` (roving) vs `menu-button-actions-active-descendant`.
   * default `'roving'`.
   */
  focusMode?: 'roving' | 'activeDescendant'
  /**
   * APG 분기. `'action'` (default) — menuitem 이 `<button>`/`<div role=menuitem>`.
   * `'navigation'` — menuitem 이 `<a>`. 차이는 markup 만 (host 책임).
   */
  variant?: 'action' | 'navigation'
  containerId?: string
  label?: string
  labelledBy?: string
  idPrefix?: string
}

/**
 * menu-button — APG `/menu-button/` recipe.
 * https://www.w3.org/WAI/ARIA/apg/patterns/menu-button/
 *
 * Trigger button + popup menu glue. Trigger 키:
 *   ArrowDown / Enter / Space → open + first item focus
 *   ArrowUp                   → open + last item focus
 * Menu 키:
 *   Escape → close + return focus to trigger
 *   ArrowDown/Up → 다음/이전 menuitem
 *   Home/End → 첫/마지막
 *   Enter/Space → activate + close + return focus
 *   click outside → close
 *
 * `focusMode='activeDescendant'` 일 때 trigger 가 계속 DOM focus 를 보유,
 * 활성 menuitem 은 `aria-activedescendant` 로 표시. `'roving'` 일 때 menuitem 이
 * 직접 DOM focus.
 */
export function useMenuButtonPattern(
  data: NormalizedData,
  onEvent?: (e: UiEvent) => void,
  opts: MenuButtonOptions = {},
): {
  triggerProps: ItemProps
  menuProps: RootProps
  itemProps: (id: string) => ItemProps
  items: BaseItem[]
  open: boolean
  setOpen: (open: boolean) => void
} {
  const {
    open: openProp,
    defaultOpen = false,
    onOpenChange,
    focusMode = 'roving',
    containerId = ROOT,
    label, labelledBy,
    idPrefix = 'mb',
  } = opts

  const [internalOpen, setInternalOpen] = useState(defaultOpen)
  const isControlled = openProp !== undefined
  const open = isControlled ? openProp : internalOpen
  const setOpen = (next: boolean) => {
    if (!isControlled) setInternalOpen(next)
    onOpenChange?.(next)
  }

  const triggerRef = useRef<HTMLElement | null>(null)
  const menuRef = useRef<HTMLElement | null>(null)
  const itemRefs = useRef(new Map<string, HTMLElement | null>())

  const ids = getChildren(data, containerId).filter((id) => !isDisabled(data, id))
  const items: BaseItem[] = ids.map((id, i) => ({
    id,
    label: getLabel(data, id),
    selected: false,
    disabled: isDisabled(data, id),
    posinset: i + 1,
    setsize: ids.length,
  }))

  const [activeId, setActiveId] = useState<string | null>(null)
  const triggerDomId = `${idPrefix}-trigger`
  const menuDomId = `${idPrefix}-menu`
  const itemDomId = (id: string) => `${idPrefix}-item-${id}`

  // open 시 first/last focus, close 시 trigger 로 복귀
  const closeAndReturnFocus = () => {
    setOpen(false)
    setActiveId(null)
    triggerRef.current?.focus({ preventScroll: true })
  }

  useEffect(() => {
    if (!open || focusMode !== 'roving') return
    if (!activeId) return
    itemRefs.current.get(activeId)?.focus({ preventScroll: true })
  }, [open, activeId, focusMode])

  // outside click → close
  useEffect(() => {
    if (!open) return
    const onDown = (e: MouseEvent) => {
      const t = e.target as Node | null
      if (!t) return
      if (triggerRef.current?.contains(t)) return
      if (menuRef.current?.contains(t)) return
      setOpen(false)
      setActiveId(null)
    }
    document.addEventListener('mousedown', onDown)
    return () => document.removeEventListener('mousedown', onDown)
  }, [open])

  const moveActive = (delta: number | 'first' | 'last') => {
    if (!ids.length) return
    let next = 0
    if (delta === 'first') next = 0
    else if (delta === 'last') next = ids.length - 1
    else {
      const cur = activeId ? ids.indexOf(activeId) : -1
      next = Math.max(0, Math.min(ids.length - 1, cur + delta))
    }
    setActiveId(ids[next])
  }

  const triggerProps: ItemProps = {
    type: 'button',
    id: triggerDomId,
    ref: triggerRef as React.Ref<HTMLElement>,
    'aria-haspopup': 'menu',
    'aria-expanded': open,
    'aria-controls': menuDomId,
    'aria-activedescendant': focusMode === 'activeDescendant' && open && activeId
      ? itemDomId(activeId) : undefined,
    onClick: () => {
      const next = !open
      setOpen(next)
      if (next) setActiveId(ids[0] ?? null)
      else setActiveId(null)
    },
    onKeyDown: (e: React.KeyboardEvent) => {
      if (!open) {
        if (e.key === KEYS.ArrowDown || matchChord(e, INTENTS.activate.trigger)) {
          e.preventDefault()
          setOpen(true)
          setActiveId(ids[0] ?? null)
        } else if (e.key === KEYS.ArrowUp) {
          e.preventDefault()
          setOpen(true)
          setActiveId(ids[ids.length - 1] ?? null)
        }
        return
      }
      // open 상태 — activedescendant 모드에선 trigger 가 계속 키 받음
      if (focusMode !== 'activeDescendant') return
      switch (e.key) {
        case KEYS.ArrowDown: e.preventDefault(); moveActive(1); break
        case KEYS.ArrowUp: e.preventDefault(); moveActive(-1); break
        case KEYS.Home: e.preventDefault(); moveActive('first'); break
        case KEYS.End: e.preventDefault(); moveActive('last'); break
        case KEYS.Escape: e.preventDefault(); closeAndReturnFocus(); break
        case KEYS.Enter:
        case KEYS.Space:
          e.preventDefault()
          if (activeId) onEvent?.({ type: 'activate', id: activeId })
          closeAndReturnFocus()
          break
      }
    },
  } as unknown as ItemProps

  const menuProps: RootProps = {
    role: 'menu',
    id: menuDomId,
    ref: menuRef as React.Ref<HTMLElement>,
    'aria-labelledby': labelledBy ?? triggerDomId,
    'aria-label': label,
    hidden: !open || undefined,
    tabIndex: -1,
  } as unknown as RootProps

  const itemProps = (id: string): ItemProps => {
    const isActive = activeId === id
    const disabled = isDisabled(data, id)
    const base: Record<string, unknown> = {
      role: 'menuitem',
      id: itemDomId(id),
      'data-id': id,
      'aria-disabled': disabled || undefined,
      'data-active': isActive ? '' : undefined,
      onClick: () => {
        if (disabled) return
        onEvent?.({ type: 'activate', id })
        closeAndReturnFocus()
      },
    }
    if (focusMode === 'roving') {
      base.ref = ((el: HTMLElement | null) => {
        itemRefs.current.set(id, el)
      }) as unknown as React.Ref<HTMLElement>
      base.tabIndex = isActive ? 0 : -1
      base.onKeyDown = (e: React.KeyboardEvent) => {
        switch (e.key) {
          case KEYS.ArrowDown: e.preventDefault(); moveActive(1); break
          case KEYS.ArrowUp: e.preventDefault(); moveActive(-1); break
          case KEYS.Home: e.preventDefault(); moveActive('first'); break
          case KEYS.End: e.preventDefault(); moveActive('last'); break
          case KEYS.Escape: e.preventDefault(); closeAndReturnFocus(); break
          case KEYS.Tab: closeAndReturnFocus(); break
          case KEYS.Enter:
          case KEYS.Space:
            e.preventDefault()
            if (!disabled) onEvent?.({ type: 'activate', id })
            closeAndReturnFocus()
            break
        }
      }
    }
    return base as unknown as ItemProps
  }

  return { triggerProps, menuProps, itemProps, items, open, setOpen }
}
