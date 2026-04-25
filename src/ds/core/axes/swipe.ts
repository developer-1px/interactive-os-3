import type { Axis } from '../axis'
import { enabledSiblings } from './index'

const mod = (n: number, m: number) => ((n % m) + m) % m

/** swipe → navigate 매핑.
 *  관행:
 *  - vertical(피드/스택): up→next, down→prev (TikTok/Instagram Stories)
 *  - horizontal(캐러셀):  left→next, right→prev (페이지 넘김)
 */
const SWIPE_TO_DELTA = {
  vertical:   { up:  1, down: -1, left: 0, right: 0 } as const,
  horizontal: { left: 1, right: -1, up: 0, down: 0 } as const,
}

/**
 * swipe axis — 'swipe' Trigger 만 처리.
 *  navigate(orientation) 와 동일한 sibling 모델을 따르되 입력만 swipe direction.
 *  loop는 navigate와 동일하게 modular.
 */
export const swipe =
  (orientation: 'vertical' | 'horizontal' = 'vertical'): Axis =>
  (d, id, t) => {
    if (t.kind !== 'swipe') return null
    const delta = SWIPE_TO_DELTA[orientation][t.dir]
    if (!delta) return null
    const sibs = enabledSiblings(d, id)
    if (!sibs.length) return null
    const i = Math.max(0, sibs.indexOf(id))
    const targetIdx = mod(i + delta, sibs.length)
    return [{ type: 'navigate', id: sibs[targetIdx] }]
  }
