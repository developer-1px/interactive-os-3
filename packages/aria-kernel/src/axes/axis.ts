import type { UiEvent, NormalizedData } from '../types'
import type { Trigger } from '../trigger'
import { parseTrigger } from '../trigger'
import { matchChord, type KeyChord } from './keys'
import { type Chord } from './chord'
import { triggerMatches } from '../trigger'

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
/**
 * Axis — function-with-property. 호출 가능 (data + trigger → UiEvent[] | null) 하면서
 * `chords` 메타데이터로 자신이 응답하는 chord 목록을 노출.
 *
 * `chords` 는 phase 4 (PRD #38) 추가 — demo 가 `keys: () => dedupe(probe(...))`
 * 보일러플레이트 없이 `axisKeys(axis)` 한 줄로 chord 추출 가능.
 */
/**
 * AxisBinding — 단일 chord ↔ emit(s) 정적 매핑 (직렬화 의도형).
 *
 * - `trigger`: chord 문자열 (tinykeys 형식, 'Click' 포함)
 * - `emits`: chord 매치 시 발행되는 UiEvent type 목록. legacy KeyHandler 함수형 rhs 인
 *   경우 빈 배열 + `dynamic: true` 로 표시
 * - `dynamic`: rhs 가 함수형이라 emit type 이 런타임에 결정됨을 표시
 */
export type AxisBinding = {
  readonly trigger: string
  readonly emits: readonly { readonly type: string }[]
  readonly dynamic?: true
}

/**
 * AxisSpec — axis 가 노출하는 직렬화 가능한 행동 명세.
 *
 * SSOT 원칙: chord/emit 등 string 으로 표현 가능한 모든 정보는 axis 소스가 정본이며,
 * `fromKeyMap` factory 가 entries 로부터 자동 생성. 자연어 설명은 본 spec 에 포함하지
 * 않는다 — axis 모듈 JSDoc 을 별도 surface 로 둔다.
 */
export type AxisSpec = {
  readonly chords: readonly string[]
  readonly bindings: readonly AxisBinding[]
}

export type Axis = ((d: NormalizedData, id: string, t: Trigger) => UiEvent[] | null) & {
  /** axis 가 응답하는 chord 목록 (string tinykeys 형식). 직렬화 가능. */
  readonly chords: readonly string[]
  /** chord ↔ emit 매핑 포함 직렬화 가능 spec. APG 정합 매트릭스의 정본 surface. */
  readonly spec: AxisSpec
}

/** axis 함수에 chords/spec 메타 부착하는 helper. axis wrapper 가 inner axis 메타 흡수할 때 사용. */
export const tagAxis = (
  fn: (d: NormalizedData, id: string, t: Trigger) => UiEvent[] | null,
  chords: readonly string[],
  bindings: readonly AxisBinding[] = [],
): Axis => {
  const tagged = fn as Axis
  const frozenChords = Object.freeze([...chords])
  const frozenBindings = Object.freeze(
    bindings.map((b) => Object.freeze({ ...b, emits: Object.freeze(b.emits.map((e) => Object.freeze({ ...e }))) })),
  )
  const spec: AxisSpec = Object.freeze({ chords: frozenChords, bindings: frozenBindings })
  Object.defineProperty(tagged, 'chords', { value: frozenChords, enumerable: true, configurable: true })
  Object.defineProperty(tagged, 'spec', { value: spec, enumerable: true, configurable: true })
  return tagged
}

/**
 * composeAxes — 여러 Axis 를 우선순위 순으로 합성. 첫 non-null 반환을 채택, 나머지 axis 는 단락.
 * 합성된 Axis 의 `chords` 는 sub-axis chords 의 union (중복 제거).
 *
 * 같은 키를 두 axis 가 다루면 앞쪽이 이긴다 (예: treeExpand 가 Space 를 흡수해야 activate 가 leaf 에서만 발화).
 */
export const composeAxes = (...axes: Axis[]): Axis => {
  const fn = (d: NormalizedData, id: string, t: Trigger): UiEvent[] | null => {
    for (const a of axes) {
      const r = a(d, id, t)
      if (r) return r
    }
    return null
  }
  const seenChords = new Set<string>()
  const chords: string[] = []
  for (const a of axes) for (const c of a.chords ?? []) if (!seenChords.has(c)) { seenChords.add(c); chords.push(c) }
  // bindings: 우선순위 보존 — 같은 trigger 가 여러 axis 에 있으면 앞쪽 axis 가 이긴다 (composeAxes 의 short-circuit 의미와 일치).
  const seenTrig = new Set<string>()
  const bindings: AxisBinding[] = []
  for (const a of axes) {
    for (const b of a.spec?.bindings ?? []) {
      if (seenTrig.has(b.trigger)) continue
      seenTrig.add(b.trigger)
      bindings.push(b)
    }
  }
  return tagAxis(fn, chords, bindings)
}

/** axisKeys — axis 가 응답하는 chord 의 key 부분만 추출 (display 용). */
export const axisKeys = (axis: Axis): readonly string[] => {
  const seen = new Set<string>()
  for (const c of axis.chords ?? []) {
    // chord 의 마지막 '+' 뒤가 key (Click / Space alias 처리는 표시 단계에서)
    const lp = c.lastIndexOf('+')
    const k = lp === -1 ? c : c.slice(lp + 1) || '+'
    seen.add(k === 'Space' ? ' ' : k)
  }
  return [...seen]
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
export type KeyMapChord = KeyChord | readonly KeyChord[] | Chord | readonly Chord[]
export type KeyMap = ReadonlyArray<readonly [KeyMapChord, KeyMapEntryRhs]>

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
/** KeyChord object → tinykeys string (display/메타용). */
const chordToString = (c: KeyChord): string => {
  const parts: string[] = []
  if (c.ctrl)  parts.push('Control')
  if (c.alt)   parts.push('Alt')
  if (c.meta)  parts.push('Meta')
  if (c.shift) parts.push('Shift')
  parts.push(c.key === ' ' ? 'Space' : c.key)
  return parts.join('+')
}

const isStringChord = (c: unknown): c is Chord => typeof c === 'string'
const normalizeChord = (chord: KeyMapChord): { strings: readonly Chord[]; objects: readonly KeyChord[] } => {
  const arr = Array.isArray(chord) ? chord : [chord]
  const strings: Chord[] = []
  const objects: KeyChord[] = []
  for (const c of arr) {
    if (isStringChord(c)) strings.push(c)
    else objects.push(c as KeyChord)
  }
  return { strings, objects }
}

export const fromKeyMap = (entries: KeyMap): Axis => {
  const fn = (d: NormalizedData, id: string, t: Trigger): UiEvent[] | null => {
    const p = parseTrigger(t)
    for (const [chord, rhs] of entries) {
      const { strings, objects } = normalizeChord(chord)
      // KeyChord 객체 매칭은 key trigger 만 (matchChord 가 ParsedKeyChord 가정).
      // string chord 매칭은 triggerMatches 가 click/key 둘 다 처리 — Click 1급 진입.
      const hit =
        (p.kind === 'key' && objects.length > 0 && matchChord(p, objects)) ||
        (strings.length > 0 && strings.some((s) => triggerMatches(t, s)))
      if (!hit) continue
      if (isHandlerFn(rhs)) return rhs(d, id)
      const tmpls = Array.isArray(rhs) ? rhs : [rhs as UiEventTemplate]
      return tmpls.map((tmpl) => applyTemplate(tmpl, id))
    }
    return null
  }
  // chord 목록 + binding 동시 추출. trigger 정규형 1개당 row 1 (memory: feedback_minimize_choices_for_llm).
  const chords: string[] = []
  const seenChord = new Set<string>()
  const bindings: AxisBinding[] = []
  const seenBindTrig = new Set<string>()
  const pushChord = (s: string): void => {
    if (!seenChord.has(s)) { seenChord.add(s); chords.push(s) }
  }
  const bindingFromRhs = (trigger: string, rhs: KeyMapEntryRhs): AxisBinding => {
    if (isHandlerFn(rhs)) return { trigger, emits: [], dynamic: true }
    const tmpls = Array.isArray(rhs) ? rhs : [rhs]
    return { trigger, emits: tmpls.map((t) => ({ type: t.type })) }
  }
  for (const [chord, rhs] of entries) {
    const { strings, objects } = normalizeChord(chord)
    const triggers: string[] = []
    for (const c of objects) triggers.push(chordToString(c))
    for (const s of strings) triggers.push(s)
    for (const trig of triggers) {
      pushChord(trig)
      if (seenBindTrig.has(trig)) continue
      seenBindTrig.add(trig)
      bindings.push(bindingFromRhs(trig, rhs))
    }
  }
  return tagAxis(fn, chords, bindings)
}
