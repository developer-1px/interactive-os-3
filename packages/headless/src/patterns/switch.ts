import type { ItemProps } from './types'
import type { NormalizedData, UiEvent } from '../types'
import { activate } from '../axes'
import { bindAxis } from '../state/bind'

export interface SwitchOptions {
  label?: string
  /** controlled fallback — host 가 onEvent reducer 로 흡수 안 할 때 직접 받음. */
  onCheckedChange?: (checked: boolean) => void
}

/**
 * switch — WAI-ARIA `switch` role.
 * https://www.w3.org/TR/wai-aria-1.2/#switch
 *
 * 데이터 차원 — 다른 recipe(slider/spinbutton 등)와 동일 시그니처: `(data, id, onEvent?, opts?)`.
 * `data.entities[id].{checked|selected, disabled}` 에서 상태 읽음. activate 시
 * `{type:'value', id, value:!checked}` 직렬 emit. host reducer 가 흡수하거나
 * `onCheckedChange` 로 옆구리 수신.
 *
 * @example
 *   const data = fromTree([{ id: 'mute', checked: true, label: 'Mute' }], {
 *     getId: (n) => n.id, toData: (n) => n,
 *   })
 *   const { switchProps } = toggleSwitchPattern(data, 'mute', dispatch, { label: 'Mute' })
 *   return <button {...switchProps}>Mute</button>
 */
export function toggleSwitchPattern(
  data: NormalizedData,
  id: string,
  onEvent?: (e: UiEvent) => void,
  opts: SwitchOptions = {},
): { switchProps: ItemProps } {
  const ent = data.entities[id] ?? {}
  const checked = Boolean(ent.checked ?? ent.selected)
  const disabled = Boolean(ent.disabled)
  const { label, onCheckedChange } = opts

  const intent = (e: UiEvent) => {
    if (e.type === 'activate') {
      const next = !checked
      onCheckedChange?.(next)
      onEvent?.({ type: 'value', id, value: next })
      return
    }
    onEvent?.(e)
  }
  const { onKey, onClick } = bindAxis(activate, data, intent)

  const switchProps: ItemProps = {
    role: 'switch',
    tabIndex: disabled ? -1 : 0,
    'aria-checked': checked,
    'aria-disabled': disabled || undefined,
    'aria-label': label,
    'data-state': checked ? 'on' : 'off',
    'data-disabled': disabled ? '' : undefined,
    onClick: (e: React.MouseEvent) => { onClick(e, id) },
    onKeyDown: (e: React.KeyboardEvent) => { onKey(e, id) },
  } as unknown as ItemProps

  return { switchProps }
}
