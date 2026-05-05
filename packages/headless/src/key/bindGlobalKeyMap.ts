/**
 * bindGlobalKeyMap — window 'keydown' 에 KeyMap 을 등록. KeyChord 매칭 시 dispatcher
 * 가 template 에 id 가 있으면 그대로, 없으면 그대로(글로벌은 focusId 없음) emit.
 *
 * editable(input/textarea/contenteditable) 안에서 modifier 없는 단일 키는
 * 타이핑을 탈취하지 않는다 (useShortcut 의 가드 어휘 그대로 흡수).
 */

import type { KeyMap, UiEventTemplate } from '../axes/axis'
import type { KeyChord } from '../axes/keys'
import { matchChord } from '../axes/keys'
import { matchAnyChord, type Chord } from '../axes/chord'
import type { UiEvent } from '../types'

const isEditable = (t: EventTarget | null): boolean => {
  const el = t as HTMLElement | null
  if (!el) return false
  const tag = el.tagName
  return tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT' || el.isContentEditable
}

const hasModifier = (c: KeyChord): boolean => !!(c.ctrl || c.alt || c.meta)
const isStringChord = (c: unknown): c is Chord => typeof c === 'string'
const splitChords = (chord: unknown): { strings: readonly Chord[]; objects: readonly KeyChord[] } => {
  const arr = Array.isArray(chord) ? chord : [chord]
  const strings: Chord[] = []
  const objects: KeyChord[] = []
  for (const c of arr) {
    if (isStringChord(c)) strings.push(c)
    else objects.push(c as KeyChord)
  }
  return { strings, objects }
}
const stringHasModifier = (s: string): boolean => /(?:Control|Ctrl|Alt|Meta|\$mod)\+/.test(s)

const fromEvent = (e: KeyboardEvent): KeyChord => ({
  key: e.key, ctrl: e.ctrlKey, alt: e.altKey, meta: e.metaKey, shift: e.shiftKey,
})

export const bindGlobalKeyMap = (
  entries: KeyMap,
  onEvent: (e: UiEvent) => void,
): (() => void) => {
  const onKey = (e: KeyboardEvent) => {
    if (e.defaultPrevented) return
    const trig = fromEvent(e)
    for (const [chord, rhs] of entries) {
      const { strings, objects } = splitChords(chord)
      const hit =
        (objects.length > 0 && matchChord(trig, objects)) ||
        (strings.length > 0 && matchAnyChord(e, strings))
      if (!hit) continue
      // editable 안에서 modifier 없는 chord 는 탈취 금지
      const anyModified = objects.some(hasModifier) || strings.some(stringHasModifier)
      if (!anyModified && isEditable(e.target)) return
      e.preventDefault()
      if (typeof rhs === 'function') return // 글로벌은 KeyHandler 미지원 (data/focusId 없음)
      const tmpls: UiEventTemplate[] = Array.isArray(rhs) ? rhs : [rhs]
      tmpls.forEach((t) => onEvent(t as UiEvent))
      return
    }
  }
  window.addEventListener('keydown', onKey)
  return () => window.removeEventListener('keydown', onKey)
}
