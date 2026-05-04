import { describe, it, expect } from 'vitest'
import { INTENTS, KEYS, matchChord, matchKey } from './keys'
import { activate } from './activate'
import { escape } from './escape'
import { navigate } from './navigate'
import { keyTrigger, clickTrigger } from '../trigger'

const k = (key: string, mods: { ctrl?: boolean; shift?: boolean; meta?: boolean } = {}) =>
  keyTrigger({ key, ctrl: false, shift: false, meta: false, alt: false, ...mods })

describe('keys.ts SSOT', () => {
  it('KEYS exposes raw KeyboardEvent.key strings', () => {
    expect(KEYS.Enter).toBe('Enter')
    expect(KEYS.Space).toBe(' ')
    expect(KEYS.Escape).toBe('Escape')
    expect(KEYS.ArrowUp).toBe('ArrowUp')
    expect(KEYS.PageUp).toBe('PageUp')
  })

  it('INTENTS exposes axis-level intent → KeyChord mappings (serializable)', () => {
    const json = JSON.stringify(INTENTS)
    expect(json).toContain('"key":"Enter"')
    expect(json).toContain('"key":"Escape"')
    expect(json).toContain('"shift":true') // gridMultiSelect rangeRight 등
    expect(json).toContain('"ctrl":true')
  })

  it('matchChord respects modifiers', () => {
    expect(matchChord(k('a', { ctrl: true }), { key: 'a', ctrl: true })).toBe(true)
    expect(matchChord(k('a'), { key: 'a', ctrl: true })).toBe(false)  // missing ctrl
    expect(matchChord(k('a', { ctrl: true, shift: true }), { key: 'a', ctrl: true })).toBe(false) // extra shift
  })

  it('matchKey ignores modifiers', () => {
    expect(matchKey(k('Enter', { ctrl: true }), 'Enter')).toBe(true)
    expect(matchKey(k('Enter'), [{ key: 'Enter' }, { key: ' ' }])).toBe(true)
  })
})

describe('axes pull from SSOT (regression guard)', () => {
  const data = {
    entities: { a: {}, b: {} },
    relationships: {},
    meta: { root: ['a', 'b'] },
  }

  it('activate fires for INTENTS.activate.trigger keys', () => {
    INTENTS.activate.trigger.forEach((chord) => {
      const events = activate(data, 'a', k(chord.key))
      expect(events).toEqual([{ type: 'activate', id: 'a' }])
    })
  })

  it('escape fires for INTENTS.escape.close keys', () => {
    INTENTS.escape.close.forEach((chord) => {
      const events = escape(data, 'a', k(chord.key))
      expect(events).toEqual([{ type: 'open', id: 'a', open: false }])
    })
  })

  it('navigate.vertical respects INTENTS.navigate.vertical.next', () => {
    const events = navigate('vertical')(data, 'a', k(INTENTS.navigate.vertical.next.key))
    expect(events).toEqual([{ type: 'navigate', id: 'b' }])
  })

  it('activate ignores click without payload (test sanity)', () => {
    const events = activate(data, 'a', clickTrigger())
    expect(events).toEqual([{ type: 'activate', id: 'a' }])
  })

  it('matchChord rejects modifier-less Enter when chord requires ctrl', () => {
    expect(matchChord(k('Enter'), { key: 'Enter', ctrl: true })).toBe(false)
  })
})
