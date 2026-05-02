import { describe, expect, it } from 'vitest'
import {
  composeGestures,
  expandBranchOnActivate,
  expandOnActivate,
  navigateOnActivate,
  selectionFollowsFocus,
} from './index'
import { fromTree } from '../state/fromTree'
import { EXPANDED, type NormalizedData, type UiEvent } from '../types'

const list = (): NormalizedData =>
  fromTree(
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

const tree = (expandedIds: string[] = []): NormalizedData =>
  fromTree(
    [
      { id: 'p', label: 'P', kids: [{ id: 'k', label: 'K' }] },
      { id: 'leaf', label: 'Leaf' },
    ],
    {
      getId: (n) => n.id,
      getKids: (n) => n.kids,
      toData: (n) => ({ label: n.label }),
      expandedIds,
    },
  )

describe('navigateOnActivate', () => {
  it('expands activate to navigate + activate', () => {
    expect(navigateOnActivate(list(), { type: 'activate', id: 'a' })).toEqual([
      { type: 'navigate', id: 'a' },
      { type: 'activate', id: 'a' },
    ])
  })

  it('passes other events through unchanged', () => {
    const e: UiEvent = { type: 'navigate', id: 'a' }
    expect(navigateOnActivate(list(), e)).toEqual([e])
  })
})

describe('selectionFollowsFocus', () => {
  it('expands navigate to navigate + activate (single-select sff)', () => {
    expect(selectionFollowsFocus(list(), { type: 'navigate', id: 'a' })).toEqual([
      { type: 'navigate', id: 'a' },
      { type: 'activate', id: 'a' },
    ])
  })

  it('does not activate disabled targets — focus passes, activation skipped', () => {
    expect(selectionFollowsFocus(list(), { type: 'navigate', id: 'b' })).toEqual([
      { type: 'navigate', id: 'b' },
    ])
  })

  it('passes non-navigate events through', () => {
    const e: UiEvent = { type: 'activate', id: 'a' }
    expect(selectionFollowsFocus(list(), e)).toEqual([e])
  })
})

describe('expandBranchOnActivate', () => {
  it('on a leaf — converts activate to navigate + activate (no expand)', () => {
    expect(expandBranchOnActivate(tree(), { type: 'activate', id: 'leaf' })).toEqual([
      { type: 'navigate', id: 'leaf' },
      { type: 'activate', id: 'leaf' },
    ])
  })

  it('on a closed branch — navigate + expand:open=true (no activate)', () => {
    expect(expandBranchOnActivate(tree(), { type: 'activate', id: 'p' })).toEqual([
      { type: 'navigate', id: 'p' },
      { type: 'expand', id: 'p', open: true },
    ])
  })

  it('on an open branch — navigate + expand:open=false (toggle close)', () => {
    expect(expandBranchOnActivate(tree(['p']), { type: 'activate', id: 'p' })).toEqual([
      { type: 'navigate', id: 'p' },
      { type: 'expand', id: 'p', open: false },
    ])
  })
})

describe('expandOnActivate', () => {
  it('treats every activate as expand toggle (accordion: items themselves expandable)', () => {
    expect(expandOnActivate(tree(), { type: 'activate', id: 'leaf' })).toEqual([
      { type: 'navigate', id: 'leaf' },
      { type: 'expand', id: 'leaf', open: true },
    ])
  })

  it('toggles open ↔ close based on EXPANDED set', () => {
    const data: NormalizedData = {
      ...tree(),
      entities: { ...tree().entities, [EXPANDED]: { id: EXPANDED, data: { ids: ['leaf'] } } },
    }
    expect(expandOnActivate(data, { type: 'activate', id: 'leaf' })).toEqual([
      { type: 'navigate', id: 'leaf' },
      { type: 'expand', id: 'leaf', open: false },
    ])
  })
})

describe('composeGestures', () => {
  it('chains helpers left-to-right, fanning each emitted event through subsequent helpers', () => {
    const fn = composeGestures(navigateOnActivate, selectionFollowsFocus)
    // activate → navigateOnActivate → [navigate, activate]
    // each then through selectionFollowsFocus:
    //   navigate → [navigate, activate]
    //   activate → [activate]
    expect(fn(list(), { type: 'activate', id: 'a' })).toEqual([
      { type: 'navigate', id: 'a' },
      { type: 'activate', id: 'a' },
      { type: 'activate', id: 'a' },
    ])
  })

  it('empty composition returns identity', () => {
    const fn = composeGestures()
    const e: UiEvent = { type: 'activate', id: 'a' }
    expect(fn(list(), e)).toEqual([e])
  })
})
