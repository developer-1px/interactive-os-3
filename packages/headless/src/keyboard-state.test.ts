import { afterEach, describe, expect, it, vi } from 'vitest'
import { activate, composeAxes, navigate, treeExpand, treeNavigate, typeahead } from './axes'
import { selectionFollowsFocus } from './gesture'
import { fromTree } from './state/fromTree'
import { composeReducers } from './state/compose'
import { reduce } from './state/reduce'
import { singleSelect } from './state/selection'
import { keyTrigger } from './trigger'
import { EXPANDED, FOCUS, getFocus, getTypeahead, ROOT, type NormalizedData } from './types'

const key = (keyName: string) => keyTrigger({ key: keyName })

const listData = (): NormalizedData =>
  fromTree(
    [
      { id: 'alpha', label: 'Alpha' },
      { id: 'bravo', label: 'Bravo' },
      { id: 'charlie', label: 'Charlie', disabled: true },
      { id: 'delta', label: 'Delta' },
    ],
    {
      getId: (n) => n.id,
      toData: (n) => ({ label: n.label, disabled: n.disabled, selected: n.id === 'alpha' }),
      focusId: 'alpha',
    },
  )

const applyEvents = (data: NormalizedData, events: ReturnType<ReturnType<typeof composeAxes>>) =>
  (events ?? []).reduce(composeReducers(reduce, singleSelect), data)

describe('keyboard input to state contract', () => {
  afterEach(() => {
    vi.useRealTimers()
  })

  it('moves roving focus with Arrow keys and skips disabled siblings', () => {
    const data = listData()
    const axis = navigate('vertical')

    const next = applyEvents(data, axis(data, 'bravo', key('ArrowDown')))
    expect(getFocus(next)).toBe('delta')

    const wrapped = applyEvents(next, axis(next, 'delta', key('ArrowDown')))
    expect(getFocus(wrapped)).toBe('alpha')
  })

  it('keeps selection as reducer state derived from activation', () => {
    const data = listData()
    const events = selectionFollowsFocus(data, { type: 'navigate', id: 'bravo' })
    const next = applyEvents(data, events)

    expect(getFocus(next)).toBe('bravo')
    expect(next.entities.alpha?.data?.selected).toBe(false)
    expect(next.entities.bravo?.data?.selected).toBe(true)
  })

  it('emits activation from Enter only for enabled leaves', () => {
    const data = listData()
    const axis = composeAxes(navigate('vertical'), activate)

    expect(axis(data, 'bravo', key('Enter'))).toEqual([{ type: 'activate', id: 'bravo' }])
    expect(axis(data, 'charlie', key('Enter'))).toBeNull()
  })

  it('accumulates printable typeahead and navigates to the matching item', () => {
    vi.useFakeTimers()
    vi.setSystemTime(1_000)

    const data = {
      ...listData(),
      entities: {
        ...listData().entities,
        [FOCUS]: { id: FOCUS, data: { id: 'alpha' } },
        [EXPANDED]: { id: EXPANDED, data: { ids: [] } },
      },
    }

    const first = applyEvents(data, typeahead(data, 'alpha', key('b')))
    expect(getFocus(first)).toBe('bravo')
    expect(getTypeahead(first).buf).toBe('b')

    vi.setSystemTime(1_100)
    const second = applyEvents(first, typeahead(first, 'bravo', key('r')))
    expect(getFocus(second)).toBe('bravo')
    expect(getTypeahead(second).buf).toBe('br')
  })

  it('updates expanded state and visible tree focus from tree keys', () => {
    const data = fromTree(
      [
        {
          id: 'docs',
          label: 'Docs',
          kids: [
            { id: 'guide', label: 'Guide' },
            { id: 'api', label: 'API' },
          ],
        },
        { id: 'blog', label: 'Blog' },
      ],
      {
        getId: (n) => n.id,
        getKids: (n) => n.kids,
        toData: (n) => ({ label: n.label }),
        focusId: 'docs',
      },
    )

    const opened = applyEvents(data, treeExpand(data, 'docs', key('ArrowRight')))
    expect(opened.entities[EXPANDED]?.data?.ids).toEqual(['docs'])

    const childFocused = applyEvents(opened, treeExpand(opened, 'docs', key('ArrowRight')))
    expect(getFocus(childFocused)).toBe('guide')

    const nextVisible = applyEvents(childFocused, treeNavigate(childFocused, 'guide', key('ArrowDown')))
    expect(getFocus(nextVisible)).toBe('api')
    expect(nextVisible.relationships[ROOT]).toEqual(['docs', 'blog'])
  })
})
