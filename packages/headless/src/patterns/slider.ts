import { type NormalizedData, type UiEvent } from '../types'
import { bindAxis } from '../state/bind'
import { numericStep } from '../axes/numericStep'
import type { ItemProps, RootProps } from './types'

export interface SliderOptions {
  orientation?: 'horizontal' | 'vertical'
}

/**
 * slider — APG `/slider/` recipe.
 * https://www.w3.org/WAI/ARIA/apg/patterns/slider/
 *
 * entity.data: { value, min, max, step, label? }
 * 키보드: Arrow ±step, Home/End min/max, PageUp/PageDown ±step*10.
 *
 * pointer drag 는 소비자 책임 (ref + onPointerDown → value 계산 → onEvent 'value').
 */
export function sliderPattern(
  data: NormalizedData,
  thumbId: string,
  onEvent?: (e: UiEvent) => void,
  opts: SliderOptions = {},
): {
  rootProps: RootProps
  trackProps: ItemProps
  rangeProps: ItemProps
  thumbProps: ItemProps
} {
  const { orientation = 'horizontal' } = opts
  const ent = data.entities[thumbId] ?? {}
  const value = Number(ent.value ?? 0)
  const min = Number(ent.min ?? 0)
  const max = Number(ent.max ?? 100)
  const pct = ((value - min) / (max - min)) * 100

  const axis = numericStep(orientation)
  const { onKey } = bindAxis(axis, data, onEvent ?? (() => {}))

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
    'data-id': thumbId,
    tabIndex: 0,
    'aria-orientation': orientation,
    'aria-valuenow': value,
    'aria-valuemin': min,
    'aria-valuemax': max,
    'aria-label': ent.label as string | undefined,
    onKeyDown: (e: React.KeyboardEvent) => onKey(e, thumbId),
    style: orientation === 'horizontal'
      ? { left: `${pct}%` }
      : { bottom: `${pct}%` },
  } as unknown as ItemProps

  return { rootProps, trackProps, rangeProps, thumbProps }
}
