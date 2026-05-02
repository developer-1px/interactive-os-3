import { ROOT, getChildren, getLabel, isDisabled, type NormalizedData, type UiEvent } from '../types'
import { activate, composeAxes, navigate, typeahead } from '../axes'
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
}

const axisFor = (orientation: 'horizontal' | 'vertical') =>
  composeAxes(navigate(orientation), activate, typeahead)
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
  const { autoFocus, onEscape, orientation = 'vertical', label, labelledBy } = opts
  const axis = orientation === 'horizontal' ? horizontalAxis : verticalAxis
  const { focusId, bindFocus, delegate } = useRovingTabIndex(
    axis, data, onEvent ?? (() => {}), { autoFocus },
  )
  const ids = getChildren(data, ROOT)

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
    role: 'menu',
    'aria-orientation': orientation,
    'aria-label': label,
    'aria-labelledby': labelledBy,
    ...delegate,
    onKeyDown: (e) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        onEscape?.()
        return
      }
      delegate.onKeyDown(e)
    },
  } as RootProps

  const itemProps = (id: string): ItemProps => {
    const it = items.find((x) => x.id === id)
    const isFocus = focusId === id
    const ent = data.entities[id]?.data ?? {}
    const kind = (ent.kind as 'menuitem' | 'menuitemcheckbox' | 'menuitemradio' | undefined) ?? 'menuitem'
    // ARIA 1.2: menuitemcheckbox supports tri-state (true | false | "mixed"); menuitemradio is binary.
    const rawChecked = ent.checked ?? ent.selected
    const checked: boolean | 'mixed' | undefined =
      kind === 'menuitem' ? undefined
        : rawChecked === 'mixed' ? 'mixed'
        : Boolean(rawChecked)
    return {
      role: kind,
      ref: bindFocus(id) as React.Ref<HTMLElement>,
      'data-id': id,
      tabIndex: isFocus ? 0 : -1,
      'aria-disabled': it?.disabled || undefined,
      'aria-checked': checked,
      'data-disabled': it?.disabled ? '' : undefined,
      'data-checked': checked === true ? '' : checked === 'mixed' ? 'mixed' : undefined,
    } as unknown as ItemProps
  }

  return { rootProps, itemProps, items }
}
