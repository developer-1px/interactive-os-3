import { useCallback } from 'react'
import { ROOT, getChildren, getLabel, isDisabled, type NormalizedData, type UiEvent } from '../types'
import { activate, composeAxes, escape, expand, navigate, typeahead } from '../axes'
import { useRovingTabIndex } from '../roving/useRovingTabIndex'
import type { BaseItem, ItemProps, RootProps } from './types'

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
}

// escape 가 navigate 보다 먼저 — Escape 키가 일반 nav 매핑보다 우선.
// expand 가 activate 보다 먼저 — children 있는 menuitem 의 Enter/Space/ArrowRight 는
// submenu open(+ first child focus)로 흐름. children 없는 leaf 는 expand 가 null →
// activate 로 떨어져 Enter/Space 가 activate 로 emit.
const axisFor = (orientation: 'horizontal' | 'vertical') =>
  composeAxes(escape, expand, navigate(orientation), activate, typeahead)
const verticalAxis = axisFor('vertical')
const horizontalAxis = axisFor('horizontal')

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
  itemProps: (id: string) => ItemProps
  items: BaseItem[]
} {
  const { autoFocus, onEscape, orientation = 'vertical', label, labelledBy, containerId = ROOT } = opts
  const axis = orientation === 'horizontal' ? horizontalAxis : verticalAxis
  // gesture/intent split: escape axis 가 emit 한 'open false' 를 onEscape 콜백으로 변환.
  const relay = useCallback((e: UiEvent) => {
    if (e.type === 'open' && e.open === false) { onEscape?.(); return }
    onEvent?.(e)
  }, [onEvent, onEscape])
  const { focusId, bindFocus, delegate } = useRovingTabIndex(
    axis, data, relay, { autoFocus, containerId },
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

  const itemProps = (id: string): ItemProps => {
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

  return { rootProps, itemProps, items }
}
