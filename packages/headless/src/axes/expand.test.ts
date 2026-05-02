import { describe, expect, it } from 'vitest'
import { expand } from './expand'
import { fromTree } from '../state/fromTree'
import { keyTrigger } from '../trigger'

const key = (k: string) => keyTrigger({ key: k })

const data = fromTree(
  [
    {
      id: 'a',
      label: 'A',
      kids: [
        { id: 'a1', label: 'A1' },
        { id: 'a2', label: 'A2', disabled: true },
        { id: 'a3', label: 'A3' },
      ],
    },
    { id: 'b', label: 'B' },
  ],
  {
    getId: (n) => n.id,
    getKids: (n) => n.kids,
    toData: (n) => ({ label: n.label, disabled: n.disabled }),
  },
)

describe('expand axis', () => {
  it('ArrowRight on a branch emits expand:open + navigate to first enabled child', () => {
    expect(expand(data, 'a', key('ArrowRight'))).toEqual([
      { type: 'expand', id: 'a', open: true },
      { type: 'navigate', id: 'a1' },
    ])
  })

  it('ArrowRight on a branch skips disabled children when picking first', () => {
    const onlyDisabled = fromTree(
      [{ id: 'p', label: 'P', kids: [{ id: 'k1', label: 'K1', disabled: true }, { id: 'k2', label: 'K2' }] }],
      { getId: (n) => n.id, getKids: (n) => n.kids, toData: (n) => ({ label: n.label, disabled: n.disabled }) },
    )
    expect(expand(onlyDisabled, 'p', key('ArrowRight'))).toEqual([
      { type: 'expand', id: 'p', open: true },
      { type: 'navigate', id: 'k2' },
    ])
  })

  it('Enter and Space also open a branch', () => {
    const out = expand(data, 'a', key('Enter'))
    expect(out?.[0]).toEqual({ type: 'expand', id: 'a', open: true })
    expect(expand(data, 'a', key(' '))?.[0]).toEqual({ type: 'expand', id: 'a', open: true })
  })

  it('ArrowRight on a leaf returns null (no children to open)', () => {
    expect(expand(data, 'b', key('ArrowRight'))).toBeNull()
  })

  it('ArrowLeft on a child closes the parent and moves focus there', () => {
    expect(expand(data, 'a1', key('ArrowLeft'))).toEqual([
      { type: 'expand', id: 'a', open: false },
      { type: 'navigate', id: 'a' },
    ])
  })

  it('ArrowLeft on a top-level item returns null (no parent above ROOT)', () => {
    expect(expand(data, 'a', key('ArrowLeft'))).toBeNull()
    expect(expand(data, 'b', key('ArrowLeft'))).toBeNull()
  })

  it('disabled branches are not openable', () => {
    const disabledBranch = fromTree(
      [{ id: 'p', label: 'P', disabled: true, kids: [{ id: 'k', label: 'K' }] }],
      { getId: (n) => n.id, getKids: (n) => n.kids, toData: (n) => ({ label: n.label, disabled: n.disabled }) },
    )
    expect(expand(disabledBranch, 'p', key('ArrowRight'))).toBeNull()
  })

  it('non-key triggers ignored', () => {
    expect(expand(data, 'a', { kind: 'click' })).toBeNull()
  })
})
