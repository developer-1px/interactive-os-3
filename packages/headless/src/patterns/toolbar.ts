import { ROOT, getChildren, getLabel, isDisabled, type NormalizedData, type UiEvent } from '../types'
import { activate, composeAxes, navigate } from '../axes'
import { useRovingTabIndex } from '../roving/useRovingTabIndex'
import type { ItemProps, RootProps, ToolbarItem } from './types'

export interface ToolbarOptions {
  orientation?: 'horizontal' | 'vertical'
  autoFocus?: boolean
  /** aria-label — APG: toolbar requires accessible name. */
  label?: string
  /** aria-labelledby (외부 heading element 연결). */
  labelledBy?: string
}

/**
 * toolbar — APG `/toolbar/` recipe (data-driven 변종).
 * https://www.w3.org/WAI/ARIA/apg/patterns/toolbar/
 *
 * native button 자유 children 묶음이라면 `useSpatialNavigation` 직접 사용 권장.
 * 이 recipe 는 entity.data 기반 toolbar 구성 시.
 *
 * separator 항목은 itemProps role="separator" + tabIndex=-1, roving skip.
 */
export function useToolbarPattern(
  data: NormalizedData,
  onEvent?: (e: UiEvent) => void,
  opts: ToolbarOptions = {},
): {
  rootProps: RootProps
  itemProps: (id: string) => ItemProps
  items: ToolbarItem[]
} {
  const { orientation = 'horizontal', autoFocus, label, labelledBy } = opts

  const axis = composeAxes(navigate(orientation), activate)
  const { focusId, bindFocus, delegate } = useRovingTabIndex(
    axis, data, onEvent ?? (() => {}), { autoFocus },
  )
  const ids = getChildren(data, ROOT)

  const items: ToolbarItem[] = ids.map((id) => {
    const ent = data.entities[id] ?? {}
    return {
      id,
      label: getLabel(data, id),
      disabled: isDisabled(data, id),
      separator: Boolean(ent.separator),
    }
  })

  const rootProps: RootProps = {
    role: 'toolbar',
    'aria-orientation': orientation,
    'aria-label': label,
    'aria-labelledby': labelledBy,
    ...delegate,
  } as RootProps

  const itemProps = (id: string): ItemProps => {
    const it = items.find((x) => x.id === id)
    if (it?.separator) {
      return { role: 'separator', tabIndex: -1, 'data-id': id } as unknown as ItemProps
    }
    const isFocus = focusId === id
    return {
      ref: bindFocus(id) as React.Ref<HTMLElement>,
      'data-id': id,
      tabIndex: isFocus ? 0 : -1,
      'aria-disabled': it?.disabled || undefined,
      'data-disabled': it?.disabled ? '' : undefined,
    } as unknown as ItemProps
  }

  return { rootProps, itemProps, items }
}
