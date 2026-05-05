import type { ItemProps, RootProps } from './types'
import { isExpanded, type NormalizedData, type UiEvent } from '../types'
import { activate } from '../axes'
import { bindAxis } from '../state/bind'

/** Disclosure 가 등록하는 axis — SSOT. 데모/문서는 이걸 probe. */
export const disclosureAxis = () => activate

/** Options for {@link disclosurePattern}. */
export interface DisclosureOptions {
  /** controlled fallback — host 가 onEvent reducer 로 EXPANDED 흡수 안 할 때 직접 받음. */
  onOpenChange?: (open: boolean) => void
  idPrefix?: string
}

/**
 * disclosure — APG `/disclosure/` recipe.
 * https://www.w3.org/WAI/ARIA/apg/patterns/disclosure/
 *
 * 데이터 차원 — `EXPANDED` meta set 에 id 가 있으면 open. activate 시
 * `{type:'expand', id, open:!current}` 직렬 emit. host reducer 흡수 또는 옆구리 콜백.
 *
 * @example
 *   const data = fromTree([{ id: 'faq1', label: 'How to use?' }], { ... })
 *   // open 상태는 EXPANDED meta set 에 'faq1' 추가/제거로 표현 (reduce.ts 가 자동 처리)
 *   const { triggerProps, panelProps } = disclosurePattern(data, 'faq1', dispatch)
 *   return <>
 *     <button {...triggerProps}>FAQ</button>
 *     <div {...panelProps}>...answer...</div>
 *   </>
 */
export function disclosurePattern(
  data: NormalizedData,
  id: string,
  onEvent?: (e: UiEvent) => void,
  opts: DisclosureOptions = {},
): {
  triggerProps: ItemProps
  panelProps: RootProps
} {
  const { onOpenChange, idPrefix = 'disc' } = opts
  const open = isExpanded(data, id)
  const panelId = `${idPrefix}-${id}-panel`

  const intent = (e: UiEvent) => {
    if (e.type === 'activate') {
      const next = !open
      onOpenChange?.(next)
      onEvent?.({ type: 'expand', id, open: next })
      return
    }
    onEvent?.(e)
  }
  const { onKey, onClick } = bindAxis(activate, data, intent)

  const triggerProps: ItemProps = {
    'aria-expanded': open,
    'aria-controls': panelId,
    onClick: (e: React.MouseEvent) => { onClick(e, id) },
    onKeyDown: (e: React.KeyboardEvent) => { onKey(e, id) },
    'data-state': open ? 'open' : 'closed',
  } as unknown as ItemProps

  const panelProps: RootProps = {
    role: 'region',
    id: panelId,
    hidden: !open,
    'data-state': open ? 'open' : 'closed',
  } as unknown as RootProps

  return { triggerProps, panelProps }
}
