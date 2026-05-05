/**
 * chord — tinykeys de facto string syntax.
 *   "Escape" · "Shift+Tab" · "$mod+c" · "ArrowDown" · "Space"
 *
 * parseChord: string → 내부 ParsedChord. modifier 순서 무관.
 * matchChord: KeyboardEvent ⨯ Chord → boolean.
 */
import { describe, expect, it } from 'vitest'
import { parseChord, matchChord } from './chord'

describe('parseChord', () => {
  it('single key', () => {
    expect(parseChord('Escape')).toEqual({ key: 'Escape' })
  })

  it('ArrowDown', () => {
    expect(parseChord('ArrowDown')).toEqual({ key: 'ArrowDown' })
  })

  it('Space alias → " "', () => {
    expect(parseChord('Space')).toEqual({ key: ' ' })
  })

  it('shift+Tab — modifier title-case', () => {
    expect(parseChord('Shift+Tab')).toEqual({ key: 'Tab', shift: true })
  })

  it('Meta+c (Cmd+C on Mac)', () => {
    expect(parseChord('Meta+c')).toEqual({ key: 'c', meta: true })
  })

  it('Control+Shift+P — multi modifier', () => {
    expect(parseChord('Control+Shift+P')).toEqual({ key: 'P', ctrl: true, shift: true })
  })

  it('order-independent', () => {
    const a = parseChord('Shift+Control+P')
    const b = parseChord('Control+Shift+P')
    expect(a).toEqual(b)
  })

  it('case-insensitive modifiers', () => {
    expect(parseChord('shift+Tab')).toEqual({ key: 'Tab', shift: true })
    expect(parseChord('SHIFT+Tab')).toEqual({ key: 'Tab', shift: true })
  })

  it('preserves key case (a vs A)', () => {
    expect(parseChord('a').key).toBe('a')
    expect(parseChord('A').key).toBe('A')
    expect(parseChord('Shift+a').key).toBe('a')
  })

  it('"+" itself as key', () => {
    expect(parseChord('+')).toEqual({ key: '+' })
    expect(parseChord('Shift++')).toEqual({ key: '+', shift: true })
  })

  it('$mod magic — Mac → Meta, others → Control', () => {
    const mac = parseChord('$mod+c', { isMac: true })
    expect(mac).toEqual({ key: 'c', meta: true })

    const pc = parseChord('$mod+c', { isMac: false })
    expect(pc).toEqual({ key: 'c', ctrl: true })
  })
})

describe('matchChord', () => {
  const ke = (overrides: Partial<KeyboardEvent>): KeyboardEvent =>
    ({ key: '', ctrlKey: false, altKey: false, metaKey: false, shiftKey: false, ...overrides }) as KeyboardEvent

  it('single key match', () => {
    expect(matchChord(ke({ key: 'Escape' }), 'Escape')).toBe(true)
    expect(matchChord(ke({ key: 'a' }), 'Escape')).toBe(false)
  })

  it('modifier required', () => {
    expect(matchChord(ke({ key: 'Tab', shiftKey: true }), 'Shift+Tab')).toBe(true)
    expect(matchChord(ke({ key: 'Tab' }), 'Shift+Tab')).toBe(false) // missing modifier
  })

  it('extra modifier rejected', () => {
    expect(matchChord(ke({ key: 'Tab', shiftKey: true, ctrlKey: true }), 'Shift+Tab')).toBe(false)
  })

  it('Space alias matches " " key', () => {
    expect(matchChord(ke({ key: ' ' }), 'Space')).toBe(true)
  })

  it('case sensitive on key part', () => {
    expect(matchChord(ke({ key: 'a' }), 'a')).toBe(true)
    expect(matchChord(ke({ key: 'A' }), 'a')).toBe(false)
  })
})
