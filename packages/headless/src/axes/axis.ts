import type { UiEvent, NormalizedData } from '../types'
import type { Trigger } from '../trigger'
import { matchChord, type KeyChord } from './keys'

/**
 * Axis — data 기반 APG 키/포인터 처리 primitive.
 *
 * 입력: data + focus id + Trigger (key 또는 click)
 * 출력: 적용할 UiEvent[] 또는 null(무반응).
 *
 * activate 는 Enter/Space 와 click 모두 반응. 나머지(navigate/expand/typeahead
 * /treeNavigate/treeExpand)는 key 만 반응하고 click 은 바로 null 반환 — 컴포넌트
 * 쪽에서 click 의 focus 이동은 별도 처리한다.
 */
export type Axis = (d: NormalizedData, id: string, t: Trigger) => UiEvent[] | null

/**
 * composeAxes — 여러 Axis 를 우선순위 순으로 합성. 첫 non-null 반환을 채택, 나머지 axis 는 단락(short-circuit).
 *
 * 같은 키를 두 axis 가 다루면 앞쪽이 이긴다 (예: treeExpand 가 Space 를 흡수해야 activate 가 leaf 에서만 발화).
 *
 * @example
 *   const onKey = composeAxes(treeExpand, treeNavigate, typeahead, activate)
 *   const events = onKey(data, focusId, { kind: 'key', key: 'ArrowRight' })
 */
export const composeAxes = (...axes: Axis[]): Axis => (d, id, t) => {
  for (const a of axes) {
    const r = a(d, id, t)
    if (r) return r
  }
  return null
}

/**
 * KeyHandler — chord 매칭 시 호출되는 data-driven 함수. UiEvent[] 또는 null 반환.
 */
export type KeyHandler = (d: NormalizedData, id: string) => UiEvent[] | null

/**
 * KeyMap — `[chord(s), handler]` tuple 의 선언적 배열. 키 ↔ 동작 매핑이 그대로 코드 형태.
 *
 * - chord 는 단일 `KeyChord` 또는 `KeyChord[]` (합집합 — 어느 하나만 매치되면 hit)
 * - tuple 순서 = 우선순위 (앞쪽 항목 먼저 매칭, 첫 hit 의 handler 결과 반환)
 * - SSOT 정합: chord 는 항상 `INTENTS.X` 또는 `KEYS.X` 통과 — raw 문자열 금지
 */
export type KeyMap = ReadonlyArray<readonly [KeyChord | readonly KeyChord[], KeyHandler]>

/**
 * fromKeyMap — `KeyMap` 선언을 `Axis` 로 만든다. axis 가 imperative if-else 로 키
 * 분기하는 대신 chord ↔ handler 1:1 선언으로만 표현되도록 강제하는 정본 factory.
 *
 * @example
 *   const expandTopAxis = fromKeyMap([
 *     [INTENTS.expand.open, (d, id) => seedExpand(d, id, 'first')],
 *     [[KEYS.ArrowUp],      (d, id) => seedExpand(d, id, 'last')],
 *   ])
 */
export const fromKeyMap = (entries: KeyMap): Axis => (d, id, t) => {
  if (t.kind !== 'key') return null
  for (const [chord, handler] of entries) {
    const list = Array.isArray(chord) ? (chord as readonly KeyChord[]) : [chord as KeyChord]
    if (matchChord(t, list)) return handler(d, id)
  }
  return null
}
