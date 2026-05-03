import { type NormalizedData, type UiEvent } from '../types'
import { ROOT } from '../types'
import { bindAxis } from '../state/bind'
import { numericStep } from '../axes/numericStep'
import type { ItemProps, RootProps } from './types'
import type { ValueEvent } from '../local'

/** Slider 가 등록하는 axis — SSOT. */
export const sliderAxis = (opts: { orientation?: 'horizontal' | 'vertical' } = {}) =>
  numericStep(opts.orientation ?? 'horizontal')

export interface SliderOptions {
  orientation?: 'horizontal' | 'vertical'
  /** numeric constraints — display + numericStep axis 모두 참조. */
  min?: number
  max?: number
  step?: number
  label?: string
  disabled?: boolean
}

/**
 * slider — APG `/slider/` recipe.
 * https://www.w3.org/WAI/ARIA/apg/patterns/slider/
 *
 * 단일 number 컨트롤 — 키보드: Arrow ±step, Home/End min/max, PageUp/PageDown ±step*10.
 *
 * @example
 *   const [value, dispatch] = useLocalValue(40)
 *   const { thumbProps, ... } = sliderPattern(value, dispatch,
 *     { min: 0, max: 100, step: 5, label: 'Volume' })
 */
export function sliderPattern(
  value: number,
  dispatch?: (e: ValueEvent<number>) => void,
  opts: SliderOptions = {},
): {
  rootProps: RootProps
  trackProps: ItemProps
  rangeProps: ItemProps
  thumbProps: ItemProps
} {
  const { orientation = 'horizontal', min = 0, max = 100, step = 1, label, disabled = false } = opts
  const pct = ((value - min) / (max - min)) * 100

  // axis (numericStep) 는 entity.data: {value, min, max, step} 를 읽음. 합성 ROOT 1개로 통과.
  const synth: NormalizedData = {
    entities: { [ROOT]: { value, min, max, step } },
    relationships: {},
  }
  const axis = sliderAxis({ orientation })
  const intent = (e: UiEvent) => {
    if (e.type === 'value' && typeof e.value === 'number') {
      dispatch?.({ type: 'value', value: e.value })
    }
  }
  const { onKey } = bindAxis(axis, synth, intent)

  const rootProps: RootProps = {
    role: 'group',
    'aria-orientation': orientation,
  } as RootProps

  const trackProps: ItemProps = {
    'data-orientation': orientation,
  } as unknown as ItemProps

  const rangeProps: ItemProps = {
    'data-orientation': orientation,
    style: orientation === 'horizontal'
      ? { width: `${pct}%` }
      : { height: `${pct}%` },
  } as unknown as ItemProps

  const thumbProps: ItemProps = {
    role: 'slider',
    tabIndex: disabled ? -1 : 0,
    'aria-orientation': orientation,
    'aria-valuenow': value,
    'aria-valuemin': min,
    'aria-valuemax': max,
    'aria-label': label,
    'aria-disabled': disabled || undefined,
    onKeyDown: (e: React.KeyboardEvent) => onKey(e, ROOT),
    style: orientation === 'horizontal'
      ? { left: `${pct}%` }
      : { bottom: `${pct}%` },
  } as unknown as ItemProps

  return { rootProps, trackProps, rangeProps, thumbProps }
}
