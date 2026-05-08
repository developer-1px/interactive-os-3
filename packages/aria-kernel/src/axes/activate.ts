import { fromKeyMap, tagAxis, type Axis } from './axis'
import { getChildren, isDisabled } from '../types'
import { INTENTS } from './keys'

/**
 * activate — Enter/Space(key) 또는 click(pointer) 시 'activate' 이벤트 발행.
 *
 * 키 매핑은 `INTENTS.activate.trigger` 에서 import — SSOT 정합.
 * 키 chord 매칭 + template 합성은 `fromKeyMap` 가 처리, leaf gate (자식 有 시 차단)
 * 만 KeyHandler 형태로 남는다 — 분기 활성화는 treeExpand 가 선점 처리.
 *
 * 클릭은 분기/리프 관계없이 항상 activate (gesture 헬퍼가 분기/리프 의미 분해 담당).
 *
 * Click 은 entries 의 1급 chord — fromKeyMap 이 자동으로 spec.bindings 에 등재.
 */
const activateKeys = fromKeyMap([
  [INTENTS.activate.trigger, (d, id) => (getChildren(d, id).length ? null : [{ type: 'activate', id }])],
  ['Click', { type: 'activate' }],
])

export const activate: Axis = tagAxis((d, id, t) => {
  if (isDisabled(d, id)) return null
  return activateKeys(d, id, t)
}, activateKeys.chords, activateKeys.spec.bindings)
