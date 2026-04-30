import type { Axis } from './axis'
import { enabledSiblings } from './index'

const mod = (n: number, m: number) => ((n % m) + m) % m

const AXIS_KEYS = {
  vertical: { prev: 'ArrowUp', next: 'ArrowDown' },
  horizontal: { prev: 'ArrowLeft', next: 'ArrowRight' },
}

export const navigate =
  (orientation: 'vertical' | 'horizontal' = 'vertical'): Axis =>
  (d, id, t) => { if (t.kind !== "key") return null; const k = t;
    const { prev, next } = AXIS_KEYS[orientation]
    const sibs = enabledSiblings(d, id)
    if (!sibs.length) return null
    const i = Math.max(0, sibs.indexOf(id))
    const targetIdx =
      k.key === prev ? mod(i - 1, sibs.length) :
      k.key === next ? mod(i + 1, sibs.length) :
      k.key === 'Home' ? 0 :
      k.key === 'End' ? sibs.length - 1 :
      -1
    return targetIdx < 0 ? null : [{ type: 'navigate', id: sibs[targetIdx] }]
  }
