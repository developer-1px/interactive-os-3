import { describe, expect, it } from 'vitest'

import { isNavigateByDir, isNavigateById, UiEventSchema } from './schema'
import type { UiEvent } from './types'

describe('UiEventSchema — navigate (id ⊕ dir)', () => {
  it('accepts result-form: { type:"navigate", id }', () => {
    expect(() => UiEventSchema.parse({ type: 'navigate', id: 'a' })).not.toThrow()
  })

  it('accepts intent-form: { type:"navigate", dir }', () => {
    expect(() => UiEventSchema.parse({ type: 'navigate', dir: 'next' })).not.toThrow()
  })

  it('rejects when neither id nor dir is present', () => {
    expect(() => UiEventSchema.parse({ type: 'navigate' })).toThrow()
  })

  it('rejects when both id and dir are present', () => {
    expect(() => UiEventSchema.parse({ type: 'navigate', id: 'a', dir: 'next' })).toThrow()
  })
})

describe('navigate narrowing helpers', () => {
  it('isNavigateById matches result-form only', () => {
    const byId: UiEvent = { type: 'navigate', id: 'a' }
    const byDir: UiEvent = { type: 'navigate', dir: 'next' }
    const other: UiEvent = { type: 'activate', id: 'a' }
    expect(isNavigateById(byId)).toBe(true)
    expect(isNavigateById(byDir)).toBe(false)
    expect(isNavigateById(other)).toBe(false)
  })

  it('isNavigateByDir matches intent-form only', () => {
    const byId: UiEvent = { type: 'navigate', id: 'a' }
    const byDir: UiEvent = { type: 'navigate', dir: 'next' }
    const other: UiEvent = { type: 'activate', id: 'a' }
    expect(isNavigateByDir(byId)).toBe(false)
    expect(isNavigateByDir(byDir)).toBe(true)
    expect(isNavigateByDir(other)).toBe(false)
  })
})
