import { type NormalizedData, type UiEvent } from '../types'
import { bindAxis } from '../state/bind'
import { numericStep } from '../axes/numericStep'
import type { ItemProps, RootProps } from './types'

export interface SplitterOptions {
  orientation?: 'horizontal' | 'vertical'
}

/**
 * splitter — APG `Window Splitter`.
 * https://www.w3.org/WAI/ARIA/apg/patterns/windowsplitter/
 *
 * entity.data (handleId): { value, min, max, step }
 * Slider와 axis 공유 (numericStep) — 차이는 role=separator + aria-orientation 의미.
 */
export function splitter(
  data: NormalizedData,
  handleId: string,
  onEvent?: (e: UiEvent) => void,
  opts: SplitterOptions = {},
): {
  rootProps: RootProps
  handleProps: ItemProps
} {
  const { orientation = 'vertical' } = opts
  const ent = data.entities[handleId]?.data ?? {}
  const value = Number(ent.value ?? 0)
  const min = Number(ent.min ?? 0)
  const max = Number(ent.max ?? 100)

  const axis = numericStep(orientation === 'vertical' ? 'horizontal' : 'vertical')
  const { onKey } = bindAxis(axis, data, onEvent ?? (() => {}))

  const rootProps: RootProps = { role: 'group' } as RootProps

  const handleProps: ItemProps = {
    role: 'separator',
    'data-id': handleId,
    tabIndex: 0,
    'aria-orientation': orientation,
    'aria-valuenow': value,
    'aria-valuemin': min,
    'aria-valuemax': max,
    onKeyDown: (e: React.KeyboardEvent) => onKey(e, handleId),
  } as unknown as ItemProps

  return { rootProps, handleProps }
}
