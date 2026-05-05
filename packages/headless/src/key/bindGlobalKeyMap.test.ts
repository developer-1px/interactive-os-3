/** @vitest-environment jsdom */
import { afterEach, describe, expect, it, vi } from 'vitest'

import { INTENTS, KEYS } from '../axes/keys'
import type { UiEvent } from '../types'

import { bindGlobalKeyMap } from './bindGlobalKeyMap'

const fire = (init: KeyboardEventInit & { target?: HTMLElement }) => {
  const ev = new KeyboardEvent('keydown', { bubbles: true, cancelable: true, ...init })
  if (init.target) {
    init.target.dispatchEvent(ev)
  } else {
    window.dispatchEvent(ev)
  }
  return ev
}

describe('bindGlobalKeyMap', () => {
  let unbind: (() => void) | undefined
  afterEach(() => { unbind?.(); unbind = undefined })

  it('emits the composed UiEvent on chord match', () => {
    const onEvent = vi.fn<(e: UiEvent) => void>()
    unbind = bindGlobalKeyMap(
      [[INTENTS.activate.trigger, { type: 'palette.open' as never }]] as never,
      onEvent,
    )
    fire({ key: KEYS.Enter })
    expect(onEvent).toHaveBeenCalledWith({ type: 'palette.open' })
  })

  it('does not fire on non-matching chord', () => {
    const onEvent = vi.fn()
    unbind = bindGlobalKeyMap(
      [[{ key: 'k', meta: true }, { type: 'palette.open' as never }]] as never,
      onEvent,
    )
    fire({ key: 'k' }) // no meta modifier
    expect(onEvent).not.toHaveBeenCalled()
  })

  it('skips modifier-less chord while inside editable element', () => {
    const onEvent = vi.fn()
    unbind = bindGlobalKeyMap(
      [[{ key: 'a' }, { type: 'app.find' as never }]] as never,
      onEvent,
    )
    const input = document.createElement('input')
    document.body.appendChild(input)
    fire({ key: 'a', target: input })
    expect(onEvent).not.toHaveBeenCalled()
    input.remove()
  })

  it('still fires modifier chord even inside editable', () => {
    const onEvent = vi.fn()
    unbind = bindGlobalKeyMap(
      [[{ key: 'k', meta: true }, { type: 'palette.open' as never }]] as never,
      onEvent,
    )
    const input = document.createElement('input')
    document.body.appendChild(input)
    fire({ key: 'k', metaKey: true, target: input })
    expect(onEvent).toHaveBeenCalledWith({ type: 'palette.open' })
    input.remove()
  })
})
