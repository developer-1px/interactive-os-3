import { fromKeyMap, tagAxis, type Axis } from './axis'
import { isDisabled } from '../types'
import { INTENTS } from './keys'

/**
 * toggle — Space(key) 또는 click(pointer) 시 'activate' 이벤트 발행.
 *
 * checkbox / aria-pressed button 등 ARIA APG 가 Space 만 명시한 토글 류 전용.
 * `activate` (Enter+Space+Click) 와 분리 — APG checkbox 는 Enter 미허용
 * (form submit 과 충돌). switch 는 spec 상 Enter 선택적이므로 별도 처리.
 *
 * Click 은 entries 의 1급 chord — fromKeyMap 이 자동으로 spec.bindings 에 등재.
 */
const toggleKeys = fromKeyMap([
  [INTENTS.toggle.trigger, { type: 'activate' }],
  ['Click', { type: 'activate' }],
])

export const toggle: Axis = tagAxis((d, id, t) => {
  if (isDisabled(d, id)) return null
  return toggleKeys(d, id, t)
}, toggleKeys.chords, toggleKeys.spec.bindings)
