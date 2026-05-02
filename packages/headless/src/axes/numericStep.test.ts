import { describe, expect, it } from 'vitest'
import { numericStep } from './numericStep'
import { keyTrigger } from '../trigger'
import { ROOT, type NormalizedData } from '../types'

const key = (k: string) => keyTrigger({ key: k })

const slider = (value = 50, min = 0, max = 100, step = 5): NormalizedData => ({
  entities: {
    [ROOT]: { id: ROOT },
    s: { id: 's', data: { value, min, max, step } },
  },
  relationships: { [ROOT]: ['s'] },
})

describe('numericStep axis — horizontal', () => {
  const axis = numericStep('horizontal')

  it('ArrowRight increments by step', () => {
    expect(axis(slider(50), 's', key('ArrowRight'))).toEqual([{ type: 'value', id: 's', value: 55 }])
  })

  it('ArrowUp also increments (horizontal slider Up = larger)', () => {
    expect(axis(slider(50), 's', key('ArrowUp'))).toEqual([{ type: 'value', id: 's', value: 55 }])
  })

  it('ArrowLeft decrements by step', () => {
    expect(axis(slider(50), 's', key('ArrowLeft'))).toEqual([{ type: 'value', id: 's', value: 45 }])
  })

  it('clamps to max', () => {
    expect(axis(slider(98), 's', key('ArrowRight'))).toEqual([{ type: 'value', id: 's', value: 100 }])
  })

  it('clamps to min', () => {
    expect(axis(slider(2), 's', key('ArrowLeft'))).toEqual([{ type: 'value', id: 's', value: 0 }])
  })

  it('returns null when already at boundary (no-op)', () => {
    expect(axis(slider(100), 's', key('ArrowRight'))).toBeNull()
    expect(axis(slider(0), 's', key('ArrowLeft'))).toBeNull()
  })

  it('Home jumps to min, End jumps to max', () => {
    expect(axis(slider(50), 's', key('Home'))).toEqual([{ type: 'value', id: 's', value: 0 }])
    expect(axis(slider(50), 's', key('End'))).toEqual([{ type: 'value', id: 's', value: 100 }])
  })

  it('PageUp/PageDown step ×10', () => {
    expect(axis(slider(50), 's', key('PageUp'))).toEqual([{ type: 'value', id: 's', value: 100 }])
    expect(axis(slider(50), 's', key('PageDown'))).toEqual([{ type: 'value', id: 's', value: 0 }])
  })
})

describe('numericStep axis — vertical', () => {
  const axis = numericStep('vertical')

  it('only ArrowUp/Down respond (left/right ignored)', () => {
    expect(axis(slider(50), 's', key('ArrowUp'))).toEqual([{ type: 'value', id: 's', value: 55 }])
    expect(axis(slider(50), 's', key('ArrowDown'))).toEqual([{ type: 'value', id: 's', value: 45 }])
    expect(axis(slider(50), 's', key('ArrowRight'))).toBeNull()
    expect(axis(slider(50), 's', key('ArrowLeft'))).toBeNull()
  })
})

describe('numericStep axis — defaults', () => {
  it('falls back to step=1 when entity has no step', () => {
    const axis = numericStep('horizontal')
    const data: NormalizedData = {
      entities: { [ROOT]: { id: ROOT }, s: { id: 's', data: { value: 5 } } },
      relationships: { [ROOT]: ['s'] },
    }
    expect(axis(data, 's', key('ArrowRight'))).toEqual([{ type: 'value', id: 's', value: 6 }])
  })

  it('non-key triggers ignored', () => {
    const axis = numericStep('horizontal')
    expect(axis(slider(50), 's', { kind: 'click' })).toBeNull()
  })
})
