import { ROOT, getChildren, getLabel, isDisabled, getExpanded, type NormalizedData, type UiEvent } from '../types'
import { activate, composeAxes, expand, navigate } from '../axes'
import { useRovingTabIndex } from '../roving/useRovingTabIndex'
import type { BaseItem, ItemProps, RootProps } from './types'

export interface AccordionOptions {
  autoFocus?: boolean
  idPrefix?: string
}

const axis = composeAxes(navigate('vertical'), expand, activate)

/**
 * accordion — APG `/accordion/` recipe.
 * https://www.w3.org/WAI/ARIA/apg/patterns/accordion/
 *
 * 각 item 의 trigger 는 button. expand 상태는 entities[id].data.expanded SSoT.
 * 'single' (한 항목만 열림) 모드는 소비자가 reducer 에 `singleExpand` 합성으로 표현.
 */
export function useAccordionPattern(
  data: NormalizedData,
  onEvent?: (e: UiEvent) => void,
  opts: AccordionOptions = {},
): {
  rootProps: RootProps
  headerProps: (id: string) => ItemProps
  triggerProps: (id: string) => ItemProps
  panelProps: (id: string) => ItemProps
  items: (BaseItem & { expanded: boolean })[]
} {
  const { autoFocus, idPrefix = 'acc' } = opts
  const { focusId, bindFocus, delegate } = useRovingTabIndex(
    axis, data, onEvent ?? (() => {}), { autoFocus },
  )
  const expanded = getExpanded(data)
  const ids = getChildren(data, ROOT)

  const items = ids.map((id, i) => {
    const ent = data.entities[id]?.data ?? {}
    return {
      id,
      label: getLabel(data, id),
      selected: Boolean(ent.selected),
      disabled: isDisabled(data, id),
      expanded: expanded.has(id),
      posinset: i + 1,
      setsize: ids.length,
    }
  })
  const itemMap = new Map(items.map((it) => [it.id, it]))

  const triggerId = (id: string) => `${idPrefix}-trigger-${id}`
  const panelId = (id: string) => `${idPrefix}-panel-${id}`

  const rootProps: RootProps = { role: 'presentation', ...delegate } as unknown as RootProps

  const headerProps = (_id: string): ItemProps => ({ role: 'heading', 'aria-level': 3 } as unknown as ItemProps)

  const triggerProps = (id: string): ItemProps => {
    const it = itemMap.get(id)
    const isFocus = focusId === id
    return {
      id: triggerId(id),
      ref: bindFocus(id) as React.Ref<HTMLElement>,
      'data-id': id,
      tabIndex: isFocus ? 0 : -1,
      'aria-expanded': it?.expanded ?? false,
      'aria-controls': panelId(id),
      'aria-disabled': it?.disabled || undefined,
      'data-state': it?.expanded ? 'open' : 'closed',
    } as unknown as ItemProps
  }

  const panelProps = (id: string): ItemProps => {
    const it = itemMap.get(id)
    return {
      role: 'region',
      id: panelId(id),
      'aria-labelledby': triggerId(id),
      hidden: !it?.expanded,
      'data-state': it?.expanded ? 'open' : 'closed',
    } as unknown as ItemProps
  }

  return { rootProps, headerProps, triggerProps, panelProps, items }
}
