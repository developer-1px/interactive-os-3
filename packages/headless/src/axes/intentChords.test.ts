/**
 * INTENT_CHORDS 와 기존 INTENTS 의 등가성 검증.
 * 둘 다 같은 chord 집합을 표현해야 함 (마이그 기간 SSOT 일치 보장).
 */
import { describe, expect, it } from 'vitest'
import { INTENT_CHORDS } from './intentChords'
import { parseChord } from './chord'
import { INTENTS } from './keys'

describe('INTENT_CHORDS — string mirror of INTENTS', () => {
  it('escape.close', () => {
    expect(parseChord(INTENT_CHORDS.escape.close)).toEqual({ key: 'Escape' })
  })

  it('activate.trigger', () => {
    expect(INTENT_CHORDS.activate.trigger.map(parseChord))
      .toEqual([{ key: 'Enter' }, { key: ' ' }])
  })

  it('navigate.vertical', () => {
    expect(parseChord(INTENT_CHORDS.navigate.vertical.prev)).toEqual({ key: 'ArrowUp' })
    expect(parseChord(INTENT_CHORDS.navigate.vertical.next)).toEqual({ key: 'ArrowDown' })
  })

  it('gridNavigate.gridStart — Control+Home', () => {
    expect(parseChord(INTENT_CHORDS.gridNavigate.gridStart))
      .toEqual({ key: 'Home', ctrl: true })
  })

  it('gridMultiSelect.selectAll — 4 variants (case + Mac/PC)', () => {
    const parsed = INTENT_CHORDS.gridMultiSelect.selectAll.map(parseChord)
    expect(parsed).toEqual([
      { key: 'a', ctrl: true },
      { key: 'A', ctrl: true },
      { key: 'a', meta: true },
      { key: 'A', meta: true },
    ])
  })

  it('tab.backward — Shift+Tab', () => {
    expect(parseChord(INTENT_CHORDS.tab.backward)).toEqual({ key: 'Tab', shift: true })
  })

  it('matches existing INTENTS escape.close shape', () => {
    // INTENTS.escape.close = [{key:'Escape'}], INTENT_CHORDS.escape.close = "Escape"
    const oldChord = INTENTS.escape.close[0]
    const newParsed = parseChord(INTENT_CHORDS.escape.close)
    expect(newParsed.key).toBe(oldChord.key)
  })
})
