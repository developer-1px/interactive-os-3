import type { KeyboardEvent, MouseEvent } from 'react'
import type { Axis } from '../axes'
import { ROOT, type NormalizedData, type UiEvent, type ValueEvent } from '../types'
import { fromKeyboardEvent } from '../key'
import { clickTrigger, keyTrigger } from '../trigger'

export interface AxisBindings {
  onKey: (ke: KeyboardEvent, id: string) => boolean
  onClick: (me: MouseEvent, id: string) => boolean
}

export const bindAxis = (
  axis: Axis,
  d: NormalizedData,
  onEvent: (e: UiEvent) => void,
): AxisBindings => ({
  onKey: (ke, id) => {
    const events = axis(d, id, keyTrigger(fromKeyboardEvent(ke)))
    if (!events) return false
    events.forEach(onEvent)
    ke.preventDefault()
    return true
  },
  onClick: (me, id) => {
    const events = axis(d, id, clickTrigger({
      shift: me.shiftKey, ctrl: me.ctrlKey, alt: me.altKey, meta: me.metaKey,
    }))
    if (!events) return false
    events.forEach(onEvent)
    return true
  },
})

/**
 * 단일값 컨트롤(slider/switch/spinbutton/splitter)을 axis 인프라에 잇는 헬퍼.
 *
 * axis 는 NormalizedData 시그니처라 단일 entity 표현을 위해 ROOT 1개짜리 합성 데이터를
 * 만들어 통과시킨다. axis 가 emit 한 UiEvent 를 `pick` 으로 narrow 하여 `ValueEvent<T>`
 * 로 dispatch.
 *
 * @param entity ROOT 위치에 들어갈 entity ({value, min, max, step} 또는 {value, ...})
 * @param pick UiEvent → T | undefined. undefined 면 dispatch 안 함.
 */
export function bindValueAxis<T>(
  axis: Axis,
  entity: Record<string, unknown>,
  dispatch: ((e: ValueEvent<T>) => void) | undefined,
  pick: (e: UiEvent) => T | undefined,
): { onKey: (ke: KeyboardEvent) => boolean; onClick: (me: MouseEvent) => boolean } {
  const synth: NormalizedData = { entities: { [ROOT]: entity }, relationships: {} }
  const intent = (e: UiEvent) => {
    const v = pick(e)
    if (v !== undefined) dispatch?.({ type: 'value', value: v })
  }
  const inner = bindAxis(axis, synth, intent)
  return {
    onKey: (ke) => inner.onKey(ke, ROOT),
    onClick: (me) => inner.onClick(me, ROOT),
  }
}

/** 숫자 값 picker — slider/splitter/spinbutton 공통. */
export const pickNumericValue = (e: UiEvent): number | undefined =>
  e.type === 'value' && typeof e.value === 'number' ? e.value : undefined
