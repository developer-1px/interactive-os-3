import { type NormalizedData, type UiEvent } from '../types'
import { ROOT } from '../types'
import { bindAxis } from '../state/bind'
import { numericStep } from '../axes/numericStep'
import type { ItemProps, RootProps } from './types'
import type { ValueEvent } from '../local'

/** Splitter 가 등록하는 axis — SSOT. (vertical separator → horizontal arrow keys, vice versa) */
export const splitterAxis = (opts: { orientation?: 'horizontal' | 'vertical' } = {}) => {
  const o = opts.orientation ?? 'vertical'
  return numericStep(o === 'vertical' ? 'horizontal' : 'vertical')
}

export interface SplitterOptions {
  orientation?: 'horizontal' | 'vertical'
  min?: number
  max?: number
  step?: number
  label?: string
  disabled?: boolean
}

/**
 * splitter — APG `Window Splitter`.
 * https://www.w3.org/WAI/ARIA/apg/patterns/windowsplitter/
 *
 * 단일 number 컨트롤 — slider 와 axis 공유 (numericStep), role=separator 만 다름.
 *
 * @example
 *   const [pos, dispatch] = useLocalValue(40)
 *   const { handleProps, ... } = splitterPattern(pos, dispatch, { min: 10, max: 90 })
 */
export function splitterPattern(
  value: number,
  dispatch?: (e: ValueEvent<number>) => void,
  opts: SplitterOptions = {},
): {
  rootProps: RootProps
  handleProps: ItemProps
} {
  const { orientation = 'vertical', min = 0, max = 100, step = 1, label, disabled = false } = opts

  const synth: NormalizedData = {
    entities: { [ROOT]: { value, min, max, step } },
    relationships: {},
  }
  const axis = splitterAxis({ orientation })
  const intent = (e: UiEvent) => {
    if (e.type === 'value' && typeof e.value === 'number') {
      dispatch?.({ type: 'value', value: e.value })
    }
  }
  const { onKey } = bindAxis(axis, synth, intent)

  const rootProps: RootProps = { role: 'group' } as RootProps

  const handleProps: ItemProps = {
    role: 'separator',
    tabIndex: disabled ? -1 : 0,
    'aria-orientation': orientation,
    'aria-valuenow': value,
    'aria-valuemin': min,
    'aria-valuemax': max,
    'aria-label': label,
    'aria-disabled': disabled || undefined,
    onKeyDown: (e: React.KeyboardEvent) => onKey(e, ROOT),
  } as unknown as ItemProps

  return { rootProps, handleProps }
}
