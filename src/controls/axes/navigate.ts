import type { Axis } from '../core/axis'
import { enabledSiblings } from './index'

type IndexFn = (len: number, i: number) => number
const mod = (n: number, m: number) => ((n % m) + m) % m

const VERTICAL: Partial<Record<string, IndexFn>> = {
  ArrowUp: (len, i) => mod(i - 1, len),
  ArrowDown: (len, i) => mod(i + 1, len),
  Home: () => 0,
  End: (len) => len - 1,
}

const HORIZONTAL: Partial<Record<string, IndexFn>> = {
  ArrowLeft: (len, i) => mod(i - 1, len),
  ArrowRight: (len, i) => mod(i + 1, len),
  Home: () => 0,
  End: (len) => len - 1,
}

const TABLES = { vertical: VERTICAL, horizontal: HORIZONTAL }

export const navigate =
  (orientation: 'vertical' | 'horizontal' = 'vertical'): Axis =>
  (d, id, k) => {
    const fn = TABLES[orientation][k.key]
    const sibs = fn ? enabledSiblings(d, id) : null
    return fn && sibs && sibs.length
      ? [{ type: 'navigate', id: sibs[fn(sibs.length, Math.max(0, sibs.indexOf(id)))] }]
      : null
  }
