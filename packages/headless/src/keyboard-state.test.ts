import { afterEach, describe, expect, it, vi } from 'vitest'
import { activate, composeAxes, multiSelect, navigate, numericStep, treeExpand, treeNavigate, typeahead } from './axes'
import { fromTree } from './state/fromTree'
import { reduceWithDefaults, reduceWithMultiSelect } from './state/defaults'
import { keyTrigger } from './trigger'
import { EXPANDED, FOCUS, getExpanded, getFocus, ROOT, type NormalizedData, type UiEvent } from './types'

const key = (keyName: string) => keyTrigger({ key: keyName })
const modKey = (keyName: string, mods: Partial<Parameters<typeof keyTrigger>[0]> = {}) =>
  keyTrigger({ key: keyName, ...mods })

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

const applySingle = (data: NormalizedData, events: UiEvent[] | null) =>
  (events ?? []).reduce(reduceWithDefaults, data)

const applyMulti = (data: NormalizedData, events: UiEvent[] | null) =>
  (events ?? []).reduce(reduceWithMultiSelect, data)

const selectedIds = (data: NormalizedData) =>
  Object.entries(data.entities)
    .filter(([id, entity]) => !id.startsWith('__') && entity.data?.selected)
    .map(([id]) => id)

describe('keyboard input to state contract', () => {
  afterEach(() => {
    vi.useRealTimers()
  })

  it('moves roving focus with Arrow keys and skips disabled siblings', () => {
    const data = listData()
    const axis = navigate('vertical')

    const next = applySingle(data, axis(data, 'bravo', key('ArrowDown')))
    expect(getFocus(next)).toBe('delta')

    const wrapped = applySingle(next, axis(next, 'delta', key('ArrowDown')))
    expect(getFocus(wrapped)).toBe('alpha')
  })

  it('selects an enabled item from keyboard activation', () => {
    const data = listData()
    const axis = composeAxes(navigate('vertical'), activate)
    const next = applySingle(data, axis(data, 'bravo', key('Enter')))

    expect(getFocus(next)).toBe('bravo')
    expect(next.entities.alpha?.data?.selected).toBe(false)
    expect(next.entities.bravo?.data?.selected).toBe(true)
  })

  it('does not activate disabled items', () => {
    const data = listData()
    const axis = composeAxes(navigate('vertical'), activate)
    const next = applySingle(data, axis(data, 'charlie', key('Enter')))

    expect(getFocus(next)).toBe('alpha')
    expect(selectedIds(next)).toEqual(['alpha'])
  })

  it('moves focus by printable typeahead', () => {
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

    const first = applySingle(data, typeahead(data, 'alpha', key('b')))
    expect(getFocus(first)).toBe('bravo')

    vi.setSystemTime(1_100)
    const second = applySingle(first, typeahead(first, 'bravo', key('r')))
    expect(getFocus(second)).toBe('bravo')
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

    const opened = applySingle(data, treeExpand(data, 'docs', key('ArrowRight')))
    expect([...getExpanded(opened)]).toEqual(['docs'])

    const childFocused = applySingle(opened, treeExpand(opened, 'docs', key('ArrowRight')))
    expect(getFocus(childFocused)).toBe('guide')

    const nextVisible = applySingle(childFocused, treeNavigate(childFocused, 'guide', key('ArrowDown')))
    expect(getFocus(nextVisible)).toBe('api')
  })

  it('moves from a tree leaf to the next visible item with ArrowRight', () => {
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
        focusId: 'guide',
        expandedIds: ['docs'],
      },
    )

    const next = applySingle(data, treeExpand(data, 'guide', key('ArrowRight')))
    expect(getFocus(next)).toBe('api')
  })

  it('keeps multi-select range behavior stable across keyboard and pointer input', () => {
    let data = fromTree(
      [
        { id: 'a', label: 'A' },
        { id: 'b', label: 'B' },
        { id: 'c', label: 'C', disabled: true },
        { id: 'd', label: 'D' },
        { id: 'e', label: 'E' },
      ],
      {
        getId: (n) => n.id,
        toData: (n) => ({ label: n.label, disabled: n.disabled }),
        focusId: 'a',
      },
    )

    data = applyMulti(data, multiSelect(data, 'a', modKey(' ', {})))
    data = applyMulti(data, multiSelect(data, 'a', modKey('ArrowDown', { shift: true })))
    data = applyMulti(data, multiSelect(data, 'b', modKey('ArrowDown', { shift: true })))
    expect(getFocus(data)).toBe('d')
    expect(selectedIds(data)).toEqual(['a', 'b', 'd'])

    data = applyMulti(data, multiSelect(data, 'd', { kind: 'click', shift: true }))
    expect(selectedIds(data)).toEqual(['a', 'b', 'd'])
  })

  it('selects all enabled siblings with platform select-all keys', () => {
    const data = fromTree(
      [
        { id: 'a', label: 'A' },
        { id: 'b', label: 'B', disabled: true },
        { id: 'c', label: 'C' },
      ],
      {
        getId: (n) => n.id,
        toData: (n) => ({ label: n.label, disabled: n.disabled }),
      },
    )

    const ctrl = applyMulti(data, multiSelect(data, 'a', modKey('a', { ctrl: true })))
    const meta = applyMulti(data, multiSelect(data, 'a', modKey('A', { meta: true })))

    expect(selectedIds(ctrl)).toEqual(['a', 'c'])
    expect(selectedIds(meta)).toEqual(['a', 'c'])
  })

  it('applies numeric keyboard steps to the final value', () => {
    let data: NormalizedData = {
      entities: {
        [ROOT]: { id: ROOT },
        slider: { id: 'slider', data: { value: 50, min: 0, max: 100, step: 5 } },
      },
      relationships: { [ROOT]: ['slider'] },
    }
    const horizontal = numericStep('horizontal')
    const vertical = numericStep('vertical')

    data = applySingle(data, horizontal(data, 'slider', key('ArrowRight')))
    expect(data.entities.slider?.data?.value).toBe(55)

    data = applySingle(data, vertical(data, 'slider', key('ArrowDown')))
    expect(data.entities.slider?.data?.value).toBe(50)

    data = applySingle(data, horizontal(data, 'slider', key('End')))
    expect(data.entities.slider?.data?.value).toBe(100)

    data = applySingle(data, horizontal(data, 'slider', key('PageDown')))
    expect(data.entities.slider?.data?.value).toBe(50)
  })
})
