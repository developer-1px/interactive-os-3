import type { Axis } from './axis'
import { INTENTS, matchChord } from './keys'

/**
 * escape — Escape 키 → `{type:'open', id, open:false}` 직렬 emit.
 *
 * 키는 `INTENTS.escape.close` 에서 import — SSOT.
 * Menu/Combobox/Dialog 의 닫기 의도를 axis 로 박제. 어느 layer 가 닫힐지는 host 가
 * onEvent 에서 결정.
 */
export const escape: Axis = (_d, id, t) => {
  if (t.kind !== 'key') return null
  if (!matchChord(t, INTENTS.escape.close)) return null
  return [{ type: 'open', id, open: false }]
}
