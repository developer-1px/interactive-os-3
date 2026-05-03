import type { Axis } from './axis'
import { getChildren, isDisabled } from '../types'
import { INTENTS, matchKey } from './keys'

/**
 * activate — Enter/Space(key) 또는 click(pointer) 시 'activate' 이벤트 발행.
 *
 * 키 매핑은 `INTENTS.activate.trigger` 에서 import — SSOT 정합.
 *
 * rovingItem 기본기: 클릭은 분기/리프 관계없이 항상 activate 로 합류한다.
 * 분기 여부의 의미 분해는 gesture 헬퍼(expandBranchOnActivate 등)가 담당.
 * 키보드 Enter/Space 는 리프에서만 fire — 분기는 treeExpand 가 선점 처리. disabled 는 무시.
 */
export const activate: Axis = (d, id, t) => {
  if (isDisabled(d, id)) return null
  if (t.kind === 'click') return [{ type: 'activate', id }]
  if (t.kind === 'key' && matchKey(t, INTENTS.activate.trigger) && !getChildren(d, id).length)
    return [{ type: 'activate', id }]
  return null
}
