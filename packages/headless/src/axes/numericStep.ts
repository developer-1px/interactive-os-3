import type { Axis } from './axis'
import type { UiEvent } from '../types'
import { INTENTS, matchChord } from './keys'

/**
 * numericStep — Slider/Splitter/Spinbutton Arrow/Page/Home/End → value step.
 *
 * 키 매핑은 `INTENTS.numericStep` (orientation 별 inc/dec, min/max, pageInc/Dec) 에서 import (SSOT).
 *
 * APG: https://www.w3.org/WAI/ARIA/apg/patterns/slider/
 *      https://www.w3.org/WAI/ARIA/apg/patterns/windowsplitter/
 *      https://www.w3.org/WAI/ARIA/apg/patterns/spinbutton/
 */
export const numericStep = (orientation: 'horizontal' | 'vertical' = 'horizontal'): Axis =>
  (d, id, t) => {
    if (t.kind !== 'key') return null
    const ent: Record<string, unknown> = d.entities[id] ?? {}
    const value = Number(ent.value ?? 0)
    const min = Number(ent.min ?? 0)
    const max = Number(ent.max ?? 100)
    const step = Number(ent.step ?? 1)
    const o = INTENTS.numericStep[orientation]

    let next: number | null = null
    if (matchChord(t, o.inc)) next = Math.min(max, value + step)
    else if (matchChord(t, o.dec)) next = Math.max(min, value - step)
    else if (matchChord(t, INTENTS.numericStep.min)) next = min
    else if (matchChord(t, INTENTS.numericStep.max)) next = max
    else if (matchChord(t, INTENTS.numericStep.pageInc)) next = Math.min(max, value + step * 10)
    else if (matchChord(t, INTENTS.numericStep.pageDec)) next = Math.max(min, value - step * 10)

    if (next === null || next === value) return null
    const events: UiEvent[] = [{ type: 'value', id, value: next }]
    return events
  }
