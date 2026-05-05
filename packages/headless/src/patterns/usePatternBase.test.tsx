import { describe, it, expect } from 'vitest'
import { renderHook } from '@testing-library/react'
import { fromList, fromTree } from '../state/fromTree'
import { composeAxes, navigate, activate } from '../axes'
import { usePatternBase } from './usePatternBase'

const data = fromList([
  { id: 'a', label: 'A' },
  { id: 'b', label: 'B', disabled: true },
  { id: 'c', label: 'C', selected: true },
])

const axis = composeAxes(navigate('vertical'), activate)

describe('usePatternBase', () => {
  it('returns ids derived from containerId (default ROOT)', () => {
    const { result } = renderHook(() => usePatternBase(data, axis, undefined))
    expect(result.current.ids).toEqual(['a', 'b', 'c'])
  })

  it('exposes focusId/bindFocus/delegate from useRovingTabIndex', () => {
    const { result } = renderHook(() => usePatternBase(data, axis, undefined))
    expect(typeof result.current.bindFocus).toBe('function')
    expect(typeof result.current.delegate.onKeyDown).toBe('function')
    expect(result.current.focusId === null || typeof result.current.focusId === 'string').toBe(true)
  })

  it('honors custom containerId', () => {
    const nested = fromTree([
      { id: 'parent', label: 'P', children: [
        { id: 'x', label: 'X', children: [] },
        { id: 'y', label: 'Y', children: [] },
      ] },
    ])
    const { result } = renderHook(() => usePatternBase(nested, axis, undefined, { containerId: 'parent' }))
    expect(result.current.ids).toEqual(['x', 'y'])
  })
})
