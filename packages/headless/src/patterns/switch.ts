import type { ItemProps } from './types'
import type { NormalizedData, UiEvent } from '../types'
import { ROOT } from '../types'
import { activate } from '../axes'
import { bindAxis } from '../state/bind'
import type { ValueEvent } from '../local'

/** Switch 가 등록하는 axis — SSOT. */
export const switchAxis = () => activate

export interface SwitchOptions {
  label?: string
  disabled?: boolean
}

/**
 * switch — WAI-ARIA `switch` role.
 * https://www.w3.org/TR/wai-aria-1.2/#switch
 *
 * 단일 boolean 컨트롤 — NormalizedData 가 아니라 boolean 직접 받음.
 * activate 시 `{type:'value', value:!checked}` 직렬 emit.
 *
 * @example
 *   const [on, dispatch] = useLocalValue(false)
 *   const { switchProps } = toggleSwitchPattern(on, dispatch, { label: 'Mute' })
 *   return <button {...switchProps}>Mute</button>
 */
export function toggleSwitchPattern(
  checked: boolean,
  dispatch?: (e: ValueEvent<boolean>) => void,
  opts: SwitchOptions = {},
): { switchProps: ItemProps } {
  const { label, disabled = false } = opts

  // axis 는 NormalizedData 시그니처. 단일값을 표현하기 위해 합성 ROOT 1개 entity 만들고 통과.
  const synth: NormalizedData = {
    entities: { [ROOT]: { value: checked, disabled } },
    relationships: {},
  }
  const intent = (e: UiEvent) => {
    if (e.type === 'activate') dispatch?.({ type: 'value', value: !checked })
  }
  const { onKey, onClick } = bindAxis(activate, synth, intent)

  const switchProps: ItemProps = {
    role: 'switch',
    tabIndex: disabled ? -1 : 0,
    'aria-checked': checked,
    'aria-disabled': disabled || undefined,
    'aria-label': label,
    'data-state': checked ? 'on' : 'off',
    'data-disabled': disabled ? '' : undefined,
    onClick: (e: React.MouseEvent) => { onClick(e, ROOT) },
    onKeyDown: (e: React.KeyboardEvent) => { onKey(e, ROOT) },
  } as unknown as ItemProps

  return { switchProps }
}
