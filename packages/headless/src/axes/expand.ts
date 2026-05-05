import { fromKeyMap, type Axis, type KeyHandler } from './axis'
import type { UiEvent } from '../types'
import { getChildren, isDisabled } from '../types'
import { INTENTS } from './keys'

/**
 * expand — accordion·menu 의 단순 open/close (aria-expanded). branch leaf 통과 +
 * nextVisibleLeaf 도출은 treeExpand. 키 매핑은 `INTENTS.expand` SSOT.
 *
 * Intent-form (PRD #38 phase 3c): chord → `{type:'expandSeed', dir:'open'|'close'}`
 * 추상 의도 emit. expand+navigate 합성은 resolver 가 담당.
 */
export const expand: Axis = fromKeyMap([
  [INTENTS.expand.open,  { type: 'expandSeed', dir: 'open' }],
  [INTENTS.expand.close, { type: 'expandSeed', dir: 'close' }],
] as never)

/**
 * seedExpand — `KeyMap` handler primitive. id 를 open 하고 seed(첫/끝 enabled child)
 * 로 navigate. axis factory 가 chord 별로 다른 seed 를 매핑할 때 사용.
 *
 * 마이그 기간 — phase 3c 에서 expandSeed intent 로 통합 예정. 현재는 함수형 유지.
 */
export const seedExpand = (seed: 'first' | 'last'): KeyHandler => (d, id) => {
  const kids = getChildren(d, id)
  if (kids.length === 0 || isDisabled(d, id)) return null
  const enabled = kids.filter((c) => !isDisabled(d, c))
  const events: UiEvent[] = [{ type: 'expand', id, open: true }]
  const target = seed === 'first' ? enabled[0] : enabled[enabled.length - 1]
  if (target) events.push({ type: 'navigate', id: target })
  return events
}
