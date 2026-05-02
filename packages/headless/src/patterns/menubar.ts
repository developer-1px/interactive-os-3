import { ROOT, getChildren, getLabel, isDisabled, type NormalizedData, type UiEvent } from '../types'
import { activate, composeAxes, navigate } from '../axes'
import { useRovingTabIndex } from '../roving/useRovingTabIndex'
import type { BaseItem, ItemProps, RootProps } from './types'

export interface MenubarOptions {
  orientation?: 'horizontal' | 'vertical'
  autoFocus?: boolean
  /** aria-label — ARIA: menubar requires accessible name. */
  label?: string
  labelledBy?: string
}

/**
 * menubar — APG `/menubar/` recipe.
 * https://www.w3.org/WAI/ARIA/apg/patterns/menubar/
 *
 * 상위 menubar 는 horizontal navigate, 하위 menu open 시 cross-axis vertical.
 * 본 recipe 는 상위 layer 만. 하위 menu 는 `useMenuPattern()` recipe 를 별도 호출.
 */
export function useMenubarPattern(
  data: NormalizedData,
  onEvent?: (e: UiEvent) => void,
  opts: MenubarOptions = {},
): {
  rootProps: RootProps
  itemProps: (id: string) => ItemProps
  items: BaseItem[]
} {
  const { orientation = 'horizontal', autoFocus, label, labelledBy } = opts
  const axis = composeAxes(navigate(orientation), activate)
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
    role: 'menubar',
    'aria-orientation': orientation,
    'aria-label': label,
    'aria-labelledby': labelledBy,
    ...delegate,
  } as RootProps

  const itemProps = (id: string): ItemProps => {
    const it = items.find((x) => x.id === id)
    const isFocus = focusId === id
    return {
      role: 'menuitem',
      ref: bindFocus(id) as React.Ref<HTMLElement>,
      'data-id': id,
      tabIndex: isFocus ? 0 : -1,
      'aria-disabled': it?.disabled || undefined,
      'aria-haspopup': it?.selected ? 'menu' : undefined,
      'data-disabled': it?.disabled ? '' : undefined,
    } as unknown as ItemProps
  }

  return { rootProps, itemProps, items }
}
