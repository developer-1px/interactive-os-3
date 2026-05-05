import { describe, expect, it } from 'vitest'

import type { NormalizedData } from '../types'

import { fromKeyMap } from './axis'
import { INTENTS, KEYS } from './keys'

const data = { entities: {}, relationships: {}, meta: {} } as NormalizedData
const trigger = (k: string): string => k === ' ' ? 'Space' : k

describe('fromKeyMap — template form (intent-form UiEvent)', () => {
  it('injects focusId into id-less template on chord match', () => {
    const axis = fromKeyMap([
      [INTENTS.activate.trigger, { type: 'activate' }],
    ])
    expect(axis(data, 'item-1', trigger(KEYS.Enter))).toEqual([{ type: 'activate', id: 'item-1' }])
  })

  it('returns null on chord miss', () => {
    const axis = fromKeyMap([
      [INTENTS.activate.trigger, { type: 'activate' }],
    ])
    expect(axis(data, 'item-1', trigger(KEYS.ArrowDown))).toBeNull()
  })

  it('emits multiple UiEvents when template is an array', () => {
    const axis = fromKeyMap([
      [INTENTS.activate.trigger, [{ type: 'navigate' as const, id: 'x' }, { type: 'activate' as const }]],
    ])
    const out = axis(data, 'item-1', trigger(KEYS.Enter))
    expect(out).toEqual([
      { type: 'navigate', id: 'x' }, // 명시 id 는 유지
      { type: 'activate', id: 'item-1' }, // id 없음 → focusId 주입
    ])
  })

  it('does NOT overwrite explicit id on the template', () => {
    const axis = fromKeyMap([
      [INTENTS.activate.trigger, { type: 'navigate' as const, id: 'fixed' }],
    ])
    expect(axis(data, 'item-1', trigger(KEYS.Enter))).toEqual([{ type: 'navigate', id: 'fixed' }])
  })

  it('still accepts legacy KeyHandler function form (migration compat)', () => {
    const axis = fromKeyMap([
      [INTENTS.activate.trigger, (_d, id) => [{ type: 'select', id }]],
    ])
    expect(axis(data, 'item-1', trigger(KEYS.Enter))).toEqual([{ type: 'select', id: 'item-1' }])
  })
})
