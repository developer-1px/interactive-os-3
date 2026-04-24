import type { Axis } from '../axis'
import { getChildren, isDisabled } from '../types'

const KEY_TRIGGER = new Set(['Enter', ' '])

/**
 * activate — Enter/Space(key) 또는 click(pointer) 시 'activate' 이벤트 발행.
 * 하위 노드가 있으면 pass-through(expand 가 처리). disabled 는 무시.
 */
export const activate: Axis = (d, id, t) => {
  if (isDisabled(d, id) || getChildren(d, id).length) return null
  const fires =
    t.kind === 'click' ||
    (t.kind === 'key' && KEY_TRIGGER.has(t.key))
  return fires ? [{ type: 'activate', id }] : null
}
