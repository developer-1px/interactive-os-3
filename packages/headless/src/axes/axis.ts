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
 *
 * @deprecated 점진 마이그레이션 동안만 유지. 신규 코드는 `UiEventTemplate` 형태를 쓴다.
 */
export type KeyHandler = (d: NormalizedData, id: string) => UiEvent[] | null

/**
 * UiEventTemplate — 100% 직렬화 의도형 entry. chord 매치 시 dispatcher 가
 * `id` 가 비어있으면 focusId 자동 주입.
 */
export type UiEventTemplate = Partial<UiEvent> & { type: UiEvent['type'] }

/** KeyMap entry 의 핸들러 칸 — 마이그레이션 기간 union (template ⊕ template[] ⊕ legacy fn). */
export type KeyMapEntryRhs = UiEventTemplate | UiEventTemplate[] | KeyHandler

/**
 * KeyMap — `[chord(s), handler|template]` tuple 의 선언적 배열.
 *
 * - chord 는 단일 `KeyChord` 또는 `KeyChord[]` (합집합 — 어느 하나만 매치되면 hit)
 * - 오른쪽 칸은 template (plain object/array) 또는 legacy KeyHandler 함수
 * - tuple 순서 = 우선순위 (앞쪽 항목 먼저 매칭, 첫 hit 의 결과 반환)
 * - chord 는 항상 `INTENTS.X` 또는 `KEYS.X` 통과 — raw 문자열 금지
 */
export type KeyMap = ReadonlyArray<readonly [KeyChord | readonly KeyChord[], KeyMapEntryRhs]>

const isHandlerFn = (rhs: KeyMapEntryRhs): rhs is KeyHandler => typeof rhs === 'function'
const applyTemplate = (t: UiEventTemplate, focusId: string): UiEvent => {
  const hasId = typeof (t as { id?: unknown }).id === 'string' && (t as { id: string }).id.length > 0
  return (hasId ? t : { ...t, id: focusId }) as UiEvent
}

/**
 * fromKeyMap — `KeyMap` 선언을 `Axis` 로 만든다. axis 가 imperative if-else 로 키
 * 분기하는 대신 chord ↔ template 1:1 선언으로만 표현되도록 강제하는 정본 factory.
 *
 * @example
 *   const activateAxis = fromKeyMap([
 *     [INTENTS.activate.trigger, { type: 'activate' }],
 *   ])
 */
export const fromKeyMap = (entries: KeyMap): Axis => (d, id, t) => {
  if (t.kind !== 'key') return null
  for (const [chord, rhs] of entries) {
    const list = Array.isArray(chord) ? (chord as readonly KeyChord[]) : [chord as KeyChord]
    if (!matchChord(t, list)) continue
    if (isHandlerFn(rhs)) return rhs(d, id)
    const tmpls = Array.isArray(rhs) ? rhs : [rhs as UiEventTemplate]
    return tmpls.map((tmpl) => applyTemplate(tmpl, id))
  }
  return null
}
