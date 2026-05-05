/** @vitest-environment jsdom */
import { renderHook } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { KEYS } from '../axes/keys'
import type { UiEvent } from '../types'

import { useKeyMap } from './useKeyMap'

const fire = (init: KeyboardEventInit & { target?: HTMLElement }) => {
  const ev = new KeyboardEvent('keydown', { bubbles: true, cancelable: true, ...init })
  if (init.target) init.target.dispatchEvent(ev)
  else window.dispatchEvent(ev)
}

describe('useKeyMap', () => {
  afterEach(() => { document.body.innerHTML = '' })

  it('binds keydown and unbinds on unmount', () => {
    const onEvent = vi.fn<(e: UiEvent) => void>()
    const km = [[{ key: 'k', meta: true }, { type: 'palette.open' as never }]] as never
    const { unmount } = renderHook(() => useKeyMap(km, onEvent))

    fire({ key: 'k', metaKey: true })
    expect(onEvent).toHaveBeenCalledWith({ type: 'palette.open' })

    unmount()
    onEvent.mockClear()
    fire({ key: 'k', metaKey: true })
    expect(onEvent).not.toHaveBeenCalled()
  })

  it('inherits editable guard — modifier-less chord ignored inside input', () => {
    const onEvent = vi.fn()
    const km = [[{ key: 'a' }, { type: 'app.find' as never }]] as never
    renderHook(() => useKeyMap(km, onEvent))
    const input = document.createElement('input')
    document.body.appendChild(input)
    fire({ key: 'a', target: input })
    expect(onEvent).not.toHaveBeenCalled()
  })

  it('matches Enter chord at window scope', () => {
    const onEvent = vi.fn()
    const km = [[{ key: KEYS.Enter }, { type: 'app.confirm' as never }]] as never
    renderHook(() => useKeyMap(km, onEvent))
    fire({ key: KEYS.Enter })
    expect(onEvent).toHaveBeenCalledWith({ type: 'app.confirm' })
  })
})
