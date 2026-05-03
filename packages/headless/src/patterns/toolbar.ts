import { useMemo } from 'react'
import type { NormalizedData, UiEvent } from '../types'
import { activate, composeAxes, navigate } from '../axes'
import { useRovingTabIndex } from '../roving/useRovingTabIndex'
import type { ItemProps, RootProps, ToolbarItem } from './types'

/** Toolbar 가 등록하는 axis — SSOT. */
export const toolbarAxis = (opts: { orientation?: 'horizontal' | 'vertical' } = {}) =>
  composeAxes(navigate(opts.orientation ?? 'horizontal'), activate)

export type ToolbarEvent =
  | { type: 'activate'; id: string }
  | { type: 'navigate'; id: string }

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
 * N 개 독립 button 의 *bundle* — picker 가 아니므로 NormalizedData 가 아니라
 * `ToolbarItem[]` 직접 받음. separator 항목은 roving skip.
 *
 * @example
 *   const items: ToolbarItem[] = [
 *     { id: 'bold', label: 'Bold' }, { id: 'italic', label: 'Italic' },
 *     { id: 'sep', separator: true }, { id: 'link', label: 'Link' },
 *   ]
 *   const { rootProps, itemProps } = useToolbarPattern(items, dispatch, { label: 'Formatting' })
 */
export function useToolbarPattern(
  items: ToolbarItem[],
  dispatch?: (e: ToolbarEvent) => void,
  opts: ToolbarOptions = {},
): {
  rootProps: RootProps
  itemProps: (id: string) => ItemProps
  items: ToolbarItem[]
} {
  const { orientation = 'horizontal', autoFocus, label, labelledBy } = opts

  // axis 인프라 재사용을 위해 items[] → 합성 NormalizedData (separator 는 disabled 로 lift, roving skip).
  const synth: NormalizedData = useMemo(() => ({
    entities: Object.fromEntries(items.map((it) => [it.id, {
      label: it.label,
      disabled: it.disabled || it.separator,
    }])),
    relationships: {},
    meta: { root: items.map((it) => it.id) },
  }), [items])

  const intent = (e: UiEvent) => {
    if (e.type === 'activate') dispatch?.({ type: 'activate', id: e.id })
    else if (e.type === 'navigate') dispatch?.({ type: 'navigate', id: e.id })
  }

  const { focusId, bindFocus, delegate } = useRovingTabIndex(
    toolbarAxis({ orientation }), synth, intent, { autoFocus },
  )

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
