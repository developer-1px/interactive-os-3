import { ROOT, getChildren, getLabel, isDisabled, type NormalizedData, type UiEvent } from '../types'
import { activate, composeAxes, navigate } from '../axes'
import { useRovingTabIndex } from '../roving/useRovingTabIndex'
import type { BaseItem, ItemProps, RootProps } from './types'

/** Toolbar 가 등록하는 axis — SSOT. */
export const toolbarAxis = (opts: { orientation?: 'horizontal' | 'vertical' } = {}) =>
  composeAxes(navigate(opts.orientation ?? 'horizontal'), activate)

export interface ToolbarOptions {
  orientation?: 'horizontal' | 'vertical'
  autoFocus?: boolean
  /** aria-label — APG: toolbar requires accessible name. */
  label?: string
  /** aria-labelledby (외부 heading element 연결). */
  labelledBy?: string
}

/**
 * toolbar — APG `/toolbar/` recipe.
 * https://www.w3.org/WAI/ARIA/apg/patterns/toolbar/
 *
 * `entity.separator: true` 항목은 roving skip + role="separator".
 * `entity.pressed` 는 toggle button 상태 — 데이터 owner 가 set.
 */
export function useToolbarPattern(
  data: NormalizedData,
  onEvent?: (e: UiEvent) => void,
  opts: ToolbarOptions = {},
): {
  rootProps: RootProps
  itemProps: (id: string) => ItemProps
  items: (BaseItem & { separator: boolean })[]
} {
  const { orientation = 'horizontal', autoFocus, label, labelledBy } = opts

  const relay = onEvent ?? (() => {})
  const { focusId, bindFocus, delegate } = useRovingTabIndex(
    toolbarAxis({ orientation }), data, relay, { autoFocus },
  )

  const ids = getChildren(data, ROOT)
  const items = ids.map((id, i) => ({
    id,
    label: getLabel(data, id),
    selected: Boolean(data.entities[id]?.pressed),
    disabled: isDisabled(data, id),
    posinset: i + 1,
    setsize: ids.length,
    separator: Boolean(data.entities[id]?.separator),
  }))

  const rootProps: RootProps = {
    role: 'toolbar',
    'aria-orientation': orientation,
    'aria-label': label,
    'aria-labelledby': labelledBy,
    ...delegate,
  } as RootProps

  const itemProps = (id: string): ItemProps => {
    const ent = data.entities[id]
    if (ent?.separator) {
      return { role: 'separator', tabIndex: -1, 'data-id': id } as unknown as ItemProps
    }
    const isFocus = focusId === id
    const disabled = isDisabled(data, id)
    return {
      ref: bindFocus(id) as React.Ref<HTMLElement>,
      'data-id': id,
      tabIndex: isFocus ? 0 : -1,
      'aria-pressed': ent?.pressed === undefined ? undefined : Boolean(ent.pressed),
      'aria-disabled': disabled || undefined,
      'data-disabled': disabled ? '' : undefined,
    } as unknown as ItemProps
  }

  return { rootProps, itemProps, items }
}
