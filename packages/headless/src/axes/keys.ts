/**
 * keys.ts — `@p/headless/axes` SSOT.
 *
 * 모든 axis 가 사용하는 키 ↔ intent 매핑을 단일 모듈에서 박제. 직렬화 가능한 plain
 * 데이터 — 다음 용도로 사용:
 *   - axis 구현체가 import 해서 동작 결정
 *   - 소비자가 import 해서 키맵 cheatsheet/단축키 표 자동 렌더
 *   - lint/test 가 도큐먼트와 구현 정합 검증
 *
 * 키 문자열은 KeyboardEvent.key 표기 (W3C UIEvents key values).
 *   https://www.w3.org/TR/uievents-key/
 */

export const KEYS = {
  Enter: 'Enter',
  Space: ' ',
  Escape: 'Escape',
  Tab: 'Tab',
  ArrowUp: 'ArrowUp',
  ArrowDown: 'ArrowDown',
  ArrowLeft: 'ArrowLeft',
  ArrowRight: 'ArrowRight',
  Home: 'Home',
  End: 'End',
  PageUp: 'PageUp',
  PageDown: 'PageDown',
  F2: 'F2',
  Backspace: 'Backspace',
} as const
export type KeyName = keyof typeof KEYS

/** modifier 동반 spec — 단축키 표 렌더 시 그대로 표시. */
export interface KeyChord {
  key: string
  ctrl?: boolean
  alt?: boolean
  meta?: boolean
  shift?: boolean
}

const k = (key: string, mods: Omit<KeyChord, 'key'> = {}): KeyChord => ({ key, ...mods })

/**
 * INTENTS — axis 별 intent ↔ KeyChord 매핑.
 *
 * 각 axis 는 본 매핑을 import 해서 동작 결정. 외부 consumer 도 동일 객체를 import
 * 해서 키맵 표시·문서·테스트에 사용 (SSOT).
 */
export const INTENTS = {
  activate: {
    trigger: [k(KEYS.Enter), k(KEYS.Space)],
  },
  escape: {
    close: [k(KEYS.Escape)],
  },
  expand: {
    open: [k(KEYS.ArrowRight), k(KEYS.Enter), k(KEYS.Space)],
    close: [k(KEYS.ArrowLeft)],
  },
  navigate: {
    vertical: { prev: k(KEYS.ArrowUp), next: k(KEYS.ArrowDown) },
    horizontal: { prev: k(KEYS.ArrowLeft), next: k(KEYS.ArrowRight) },
    start: k(KEYS.Home),
    end: k(KEYS.End),
  },
  pageNavigate: {
    prev: k(KEYS.PageUp),
    next: k(KEYS.PageDown),
  },
  numericStep: {
    horizontal: {
      inc: [k(KEYS.ArrowRight), k(KEYS.ArrowUp)],
      dec: [k(KEYS.ArrowLeft), k(KEYS.ArrowDown)],
    },
    vertical: {
      inc: [k(KEYS.ArrowUp)],
      dec: [k(KEYS.ArrowDown)],
    },
    min: k(KEYS.Home),
    max: k(KEYS.End),
    pageInc: k(KEYS.PageUp),
    pageDec: k(KEYS.PageDown),
  },
  gridNavigate: {
    left: k(KEYS.ArrowLeft),
    right: k(KEYS.ArrowRight),
    up: k(KEYS.ArrowUp),
    down: k(KEYS.ArrowDown),
    rowStart: k(KEYS.Home),
    rowEnd: k(KEYS.End),
    gridStart: k(KEYS.Home, { ctrl: true }),
    gridEnd: k(KEYS.End, { ctrl: true }),
  },
  gridMultiSelect: {
    selectColumn: k(KEYS.Space, { ctrl: true }),
    selectRow: k(KEYS.Space, { shift: true }),
    selectAll: [k('a', { ctrl: true }), k('A', { ctrl: true }), k('a', { meta: true }), k('A', { meta: true })],
    toggle: [k(KEYS.Space)],
    rangeLeft: k(KEYS.ArrowLeft, { shift: true }),
    rangeRight: k(KEYS.ArrowRight, { shift: true }),
    rangeUp: k(KEYS.ArrowUp, { shift: true }),
    rangeDown: k(KEYS.ArrowDown, { shift: true }),
  },
  multiSelect: {
    toggle: [k(KEYS.Space), k('Spacebar')],
    selectAll: [k('a', { ctrl: true }), k('A', { ctrl: true }), k('a', { meta: true }), k('A', { meta: true })],
    rangeUp: k(KEYS.ArrowUp, { shift: true }),
    rangeDown: k(KEYS.ArrowDown, { shift: true }),
  },
  select: {
    toggle: [k(KEYS.Space)],
  },
  treeNavigate: {
    parent: k(KEYS.ArrowLeft),
    firstChild: k(KEYS.ArrowRight),
    prev: k(KEYS.ArrowUp),
    next: k(KEYS.ArrowDown),
  },
  treeExpand: {
    open: k(KEYS.ArrowRight),
    close: k(KEYS.ArrowLeft),
  },
} as const

interface KeyLike {
  key?: string
  ctrl?: boolean
  alt?: boolean
  meta?: boolean
  shift?: boolean
}

/** match — KeyChord 배열에 t (KeyboardEvent → KeySpec 또는 Trigger) 가 들어맞는지 검사. */
export const matchChord = (
  t: KeyLike,
  chords: readonly KeyChord[] | KeyChord,
): boolean => {
  if (typeof t.key !== 'string') return false
  const list = Array.isArray(chords) ? chords : [chords]
  return list.some((c) =>
    c.key === t.key &&
    !!c.ctrl === !!t.ctrl &&
    !!c.alt === !!t.alt &&
    !!c.meta === !!t.meta &&
    !!c.shift === !!t.shift,
  )
}

/** matchKey — modifier 무시, 키 이름만 비교 (modifier 매핑 별도 처리하는 axis 용). */
export const matchKey = (
  t: KeyLike,
  keys: readonly KeyChord[] | KeyChord | string | readonly string[],
): boolean => {
  if (typeof t.key !== 'string') return false
  if (typeof keys === 'string') return t.key === keys
  if (Array.isArray(keys)) {
    return keys.some((c) => (typeof c === 'string' ? c === t.key : c.key === t.key))
  }
  return (keys as KeyChord).key === t.key
}
