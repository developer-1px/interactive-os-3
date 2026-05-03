import { useMemo } from 'react'
import type { NormalizedData, UiEvent } from '../types'
import { activate, composeAxes, expand, navigate } from '../axes'
import { useRovingTabIndex } from '../roving/useRovingTabIndex'
import type { ItemProps, RootProps } from './types'

export interface AccordionItem {
  id: string
  label?: string
  expanded?: boolean
  disabled?: boolean
}

export type AccordionEvent =
  | { type: 'expand'; id: string; open: boolean }
  | { type: 'navigate'; id: string }

export interface AccordionOptions {
  /** 'multiple' (default): 여러 패널 동시 열림. 'single': APG single-mode — 한 항목만 열림 (형제 자동 collapse). */
  mode?: 'multiple' | 'single'
  autoFocus?: boolean
  idPrefix?: string
}

/** Accordion 이 등록하는 axis — SSOT. */
export const accordionAxis = () => composeAxes(navigate('vertical'), expand, activate)
const axis = accordionAxis()

/**
 * accordion — APG `/accordion/` recipe.
 * https://www.w3.org/WAI/ARIA/apg/patterns/accordion/
 *
 * N 개 독립 disclosure + 헤더 roving 의 *bundle*. picker 가 아니므로 NormalizedData
 * 가 아니라 `AccordionItem[]` 직접 받음. 각 item 의 `expanded` 가 SSoT.
 *
 * @example
 *   const [items, setItems] = useState<AccordionItem[]>([
 *     { id: 'a', label: 'What?', expanded: false }, ...
 *   ])
 *   const dispatch = (e: AccordionEvent) => {
 *     if (e.type === 'expand') {
 *       setItems(xs => xs.map(it => it.id === e.id ? { ...it, expanded: e.open } : it))
 *     }
 *   }
 *   const { triggerProps, panelProps, ... } = useAccordionPattern(items, dispatch)
 */
export function useAccordionPattern(
  items: AccordionItem[],
  dispatch?: (e: AccordionEvent) => void,
  opts: AccordionOptions = {},
): {
  rootProps: RootProps
  headerProps: (id: string) => ItemProps
  triggerProps: (id: string) => ItemProps
  panelProps: (id: string) => ItemProps
  items: (AccordionItem & { posinset: number; setsize: number })[]
} {
  const { mode = 'multiple', autoFocus, idPrefix = 'acc' } = opts

  // axis 인프라 재사용을 위해 items[] → NormalizedData 로 lift (외부 API 엔 보이지 않음).
  const synth: NormalizedData = useMemo(() => ({
    entities: Object.fromEntries(items.map((it) => [it.id, {
      label: it.label,
      disabled: it.disabled,
    }])),
    relationships: {},
    meta: {
      root: items.map((it) => it.id),
      expanded: items.filter((it) => it.expanded).map((it) => it.id),
    },
  }), [items])

  // single mode: open 시 형제 자동 collapse — pattern 안에서 batch dispatch.
  const intent = (e: UiEvent) => {
    if (e.type === 'navigate') { dispatch?.({ type: 'navigate', id: e.id }); return }
    if (e.type === 'expand') {
      if (mode === 'single' && e.open) {
        for (const it of items) {
          if (it.id !== e.id && it.expanded) dispatch?.({ type: 'expand', id: it.id, open: false })
        }
      }
      dispatch?.({ type: 'expand', id: e.id, open: e.open })
      return
    }
    // activate(click) → expand toggle (gesture: expandOnActivate).
    if (e.type === 'activate') {
      const target = items.find((it) => it.id === e.id)
      if (!target) return
      const next = !target.expanded
      if (mode === 'single' && next) {
        for (const it of items) {
          if (it.id !== e.id && it.expanded) dispatch?.({ type: 'expand', id: it.id, open: false })
        }
      }
      dispatch?.({ type: 'expand', id: e.id, open: next })
    }
  }

  const { focusId, bindFocus, delegate } = useRovingTabIndex(axis, synth, intent, { autoFocus })

  const triggerId = (id: string) => `${idPrefix}-trigger-${id}`
  const panelId = (id: string) => `${idPrefix}-panel-${id}`

  const rootProps: RootProps = { role: 'presentation', ...delegate } as unknown as RootProps

  const headerProps = (_id: string): ItemProps =>
    ({ role: 'heading', 'aria-level': 3 } as unknown as ItemProps)

  const triggerProps = (id: string): ItemProps => {
    const it = items.find((x) => x.id === id)
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
    const it = items.find((x) => x.id === id)
    return {
      role: 'region',
      id: panelId(id),
      'aria-labelledby': triggerId(id),
      hidden: !it?.expanded,
      'data-state': it?.expanded ? 'open' : 'closed',
    } as unknown as ItemProps
  }

  return {
    rootProps,
    headerProps,
    triggerProps,
    panelProps,
    items: items.map((it, i) => ({ ...it, posinset: i + 1, setsize: items.length })),
  }
}

