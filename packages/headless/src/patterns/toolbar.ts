import { ROOT, getChildren, getLabel, isDisabled, type NormalizedData, type UiEvent } from '../types'
import { activate, composeAxes, navigate } from '../axes'
import { useRovingTabIndex } from '../roving/useRovingTabIndex'
import type { BaseItem, ItemProps, RootProps } from './types'

/** Toolbar 가 등록하는 axis — SSOT. */
export const toolbarAxis = (opts: { orientation?: 'horizontal' | 'vertical' } = {}) =>
  composeAxes(navigate(opts.orientation ?? 'horizontal'), activate)

/** Options for {@link useToolbarPattern}. */
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
 *
 * Per-item ARIA role 디스크리미네이터 — `entity.itemRole` 에 다음 중 하나:
 *   `'button'` (default), `'toggle'`, `'radio'`, `'checkbox'`,
 *   `'menubutton'`, `'spinbutton'`, `'link'`.
 * APG toolbar example 의 혼합 itemRole 변종을 1:1 흡수.
 */
export function useToolbarPattern(
  data: NormalizedData,
  onEvent?: (e: UiEvent) => void,
  opts: ToolbarOptions = {},
): {
  rootProps: RootProps
  toolbarItemProps: (id: string) => ItemProps
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

  const toolbarItemProps = (id: string): ItemProps => {
    const ent = data.entities[id]
    if (ent?.separator) {
      return { role: 'separator', tabIndex: -1, 'data-id': id } as unknown as ItemProps
    }
    const isFocus = focusId === id
    const disabled = isDisabled(data, id)
    const itemRole = ent?.itemRole as
      | 'button' | 'toggle' | 'radio' | 'checkbox' | 'menubutton' | 'spinbutton' | 'link'
      | undefined

    const base = {
      ref: bindFocus(id) as React.Ref<HTMLElement>,
      'data-id': id,
      tabIndex: isFocus ? 0 : -1,
      'aria-disabled': disabled || undefined,
      'data-disabled': disabled ? '' : undefined,
    } as Record<string, unknown>

    switch (itemRole) {
      case 'radio':
        base.role = 'radio'
        base['aria-checked'] = Boolean(ent?.pressed ?? ent?.selected)
        break
      case 'checkbox':
        base.role = 'checkbox'
        base['aria-checked'] = Boolean(ent?.pressed ?? ent?.selected)
        break
      case 'menubutton':
        base['aria-haspopup'] = 'menu'
        base['aria-expanded'] = Boolean(ent?.expanded)
        break
      case 'spinbutton':
        base.role = 'spinbutton'
        if (ent?.value !== undefined) base['aria-valuenow'] = ent.value
        if (ent?.min !== undefined) base['aria-valuemin'] = ent.min
        if (ent?.max !== undefined) base['aria-valuemax'] = ent.max
        break
      case 'link':
        // native <a> 권장 — role 따로 안 박음. tabIndex 만 roving 그대로.
        break
      case 'toggle':
        base['aria-pressed'] = Boolean(ent?.pressed)
        break
      case 'button':
      default:
        // 기존 호환: pressed 가 명시되어 있으면 toggle 로 취급.
        if (ent?.pressed !== undefined) base['aria-pressed'] = Boolean(ent.pressed)
        break
    }
    return base as unknown as ItemProps
  }

  return { rootProps, toolbarItemProps, items }
}
