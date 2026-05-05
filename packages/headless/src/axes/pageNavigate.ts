import { fromKeyMap, type Axis, type KeyHandler } from './axis'
import { enabledSiblings } from './index'
import { INTENTS } from './keys'

const stepToward = (delta: (i: number, len: number) => number): KeyHandler =>
  (d, id) => {
    const sibs = enabledSiblings(d, id)
    if (!sibs.length) return null
    const i = Math.max(0, sibs.indexOf(id))
    const t = delta(i, sibs.length)
    if (t === i) return null
    return [{ type: 'navigate', id: sibs[t] }]
  }

/**
 * pageNavigate — PageUp/PageDown 키로 sibling 단위 N 칸 이동.
 *
 * 키는 `INTENTS.pageNavigate` (prev/next) 에서 import — SSOT.
 * step=1 이면 feed 식 "다음 article", step>1 이면 grid/list 식 page 점프.
 */
export const pageNavigate =
  (_orientation: 'vertical' | 'horizontal' = 'vertical', step = 1): Axis =>
    fromKeyMap([
      [INTENTS.pageNavigate.next, stepToward((i, len) => Math.min(len - 1, i + step))],
      [INTENTS.pageNavigate.prev, stepToward((i) => Math.max(0, i - step))],
    ])
