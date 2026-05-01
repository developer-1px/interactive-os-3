import type { Axis } from './axis'
import type { UiEvent } from '../types'

/**
 * numericStep — Slider/Splitter 등 numeric 값을 가진 entity 의 Arrow 키 step.
 *
 * 입력: orientation('horizontal' | 'vertical')
 * 동작: Arrow←/→ 또는 Arrow↑/↓ 가 entity.data.{value,min,max,step} 에 따라
 * `{type:'value', id, value}` 발행. Home/End 는 min/max 로 점프.
 *
 * orientation 별 키 매핑:
 *   horizontal — Right/Up = +step, Left/Down = -step
 *   vertical   — Up = +step (visual top = larger? APG slider는 값 증가가 위쪽), Down = -step
 *
 * APG: https://www.w3.org/WAI/ARIA/apg/patterns/slider/
 *      https://www.w3.org/WAI/ARIA/apg/patterns/windowsplitter/
 */
export const numericStep = (orientation: 'horizontal' | 'vertical' = 'horizontal'): Axis =>
  (d, id, t) => {
    if (t.kind !== 'key') return null
    const ent = d.entities[id]?.data ?? {}
    const value = Number(ent.value ?? 0)
    const min = Number(ent.min ?? 0)
    const max = Number(ent.max ?? 100)
    const step = Number(ent.step ?? 1)

    const incKeys = orientation === 'horizontal' ? ['ArrowRight', 'ArrowUp'] : ['ArrowUp']
    const decKeys = orientation === 'horizontal' ? ['ArrowLeft', 'ArrowDown'] : ['ArrowDown']

    let next: number | null = null
    if (incKeys.includes(t.key)) next = Math.min(max, value + step)
    else if (decKeys.includes(t.key)) next = Math.max(min, value - step)
    else if (t.key === 'Home') next = min
    else if (t.key === 'End') next = max
    else if (t.key === 'PageUp') next = Math.min(max, value + step * 10)
    else if (t.key === 'PageDown') next = Math.max(min, value - step * 10)

    if (next === null || next === value) return null
    const events: UiEvent[] = [{ type: 'value', id, value: next }]
    return events
  }
