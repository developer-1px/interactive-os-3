import { describe, expect, it } from 'vitest'
import { multiSelectToggle, singleSelect } from './selection'
import { fromTree } from './fromTree'
import { FOCUS, getFocus, type NormalizedData } from '../types'

const list = (): NormalizedData =>
  fromTree(
    [
      { id: 'a', label: 'A', selected: true },
      { id: 'b', label: 'B' },
      { id: 'c', label: 'C' },
    ],
    {
      getId: (n) => n.id,
      toData: (n) => ({ label: n.label, selected: n.selected }),
      focusId: 'a',
    },
  )

describe('singleSelect reducer', () => {
  it('marks activate target selected and clears others', () => {
    const next = singleSelect(list(), { type: 'activate', id: 'b' })
    expect(next.entities.a?.data?.selected).toBe(false)
    expect(next.entities.b?.data?.selected).toBe(true)
    expect(next.entities.c?.data?.selected).toBeFalsy()
  })

  it('moves FOCUS to activate target (selection follows focus)', () => {
    const next = singleSelect(list(), { type: 'activate', id: 'c' })
    expect(getFocus(next)).toBe('c')
  })

  it('returns same reference when activate hits already-selected id and focus matches', () => {
    const data: NormalizedData = {
      ...list(),
      entities: {
        ...list().entities,
        [FOCUS]: { id: FOCUS, data: { id: 'a' } },
      },
    }
    expect(singleSelect(data, { type: 'activate', id: 'a' })).toBe(data)
  })

  it('ignores non-activate events', () => {
    const data = list()
    expect(singleSelect(data, { type: 'select', id: 'b' })).toBe(data)
    expect(singleSelect(data, { type: 'navigate', id: 'b' })).toBe(data)
  })
})

describe('multiSelectToggle reducer', () => {
  it('toggles selected on `select` events without touching siblings', () => {
    const next = multiSelectToggle(list(), { type: 'select', id: 'b' })
    expect(next.entities.a?.data?.selected).toBe(true) // untouched
    expect(next.entities.b?.data?.selected).toBe(true) // toggled on
    expect(next.entities.c?.data?.selected).toBeFalsy()
  })

  it('toggles off when already selected', () => {
    const next = multiSelectToggle(list(), { type: 'select', id: 'a' })
    expect(next.entities.a?.data?.selected).toBe(false)
  })

  it('ignores `activate` events (vocabulary separation from singleSelect)', () => {
    const data = list()
    expect(multiSelectToggle(data, { type: 'activate', id: 'b' })).toBe(data)
  })

  it('does not move FOCUS — caller composes navigate separately', () => {
    const data = list()
    const next = multiSelectToggle(data, { type: 'select', id: 'b' })
    expect(getFocus(next)).toBe('a')
  })

  it('single + multi reducers can coexist in one composition (no vocabulary collision)', () => {
    const data = list()
    const afterActivate = multiSelectToggle(singleSelect(data, { type: 'activate', id: 'b' }), {
      type: 'activate',
      id: 'b',
    })
    expect(afterActivate.entities.b?.data?.selected).toBe(true) // only single applied
    const afterSelect = singleSelect(multiSelectToggle(afterActivate, { type: 'select', id: 'c' }), {
      type: 'select',
      id: 'c',
    })
    expect(afterSelect.entities.b?.data?.selected).toBe(true) // multi added c without disturbing single's b
    expect(afterSelect.entities.c?.data?.selected).toBe(true)
  })
})
