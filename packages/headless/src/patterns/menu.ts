import { ROOT, getChildren, getLabel, isDisabled, type NormalizedData, type UiEvent } from '../types'
import { activate, composeAxes, navigate, typeahead } from '../axes'
import { useRovingTabIndex } from '../roving/useRovingTabIndex'
import type { BaseItem, ItemProps, RootProps } from './types'

export interface MenuOptions {
  closeOnSelect?: boolean
  autoFocus?: boolean
  onEscape?: () => void
}

const axis = composeAxes(navigate('vertical'), activate, typeahead)

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
  const { autoFocus, onEscape } = opts
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
    return {
      role: 'menuitem',
      ref: bindFocus(id) as React.Ref<HTMLElement>,
      'data-id': id,
      tabIndex: isFocus ? 0 : -1,
      'aria-disabled': it?.disabled || undefined,
      'data-disabled': it?.disabled ? '' : undefined,
    } as unknown as ItemProps
  }

  return { rootProps, itemProps, items }
}
