import { describe, expect, it } from 'vitest'
import { treeExpand } from './treeExpand'
import { fromTree } from '../state/fromTree'
import { keyTrigger } from '../trigger'

const key = (k: string) => keyTrigger({ key: k })

const tree = (expandedIds: string[] = []) =>
  fromTree(
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
      expandedIds,
    },
  )

describe('treeExpand axis — ArrowRight', () => {
  it('branchClosed → expand:open=true', () => {
    expect(treeExpand(tree(), 'docs', key('ArrowRight'))).toEqual([
      { type: 'expand', id: 'docs', open: true },
    ])
  })

  it('branchOpen → navigate to first enabled child', () => {
    expect(treeExpand(tree(['docs']), 'docs', key('ArrowRight'))).toEqual([
      { type: 'navigate', id: 'guide' },
    ])
  })

  it('leaf → navigate to next visible (de facto VS Code/Finder behavior)', () => {
    expect(treeExpand(tree(['docs']), 'guide', key('ArrowRight'))).toEqual([
      { type: 'navigate', id: 'api' },
    ])
  })

  it('leaf at end of visible flat → null', () => {
    expect(treeExpand(tree(), 'blog', key('ArrowRight'))).toBeNull()
  })
})

describe('treeExpand axis — ArrowLeft', () => {
  it('branchOpen → expand:open=false (collapse)', () => {
    expect(treeExpand(tree(['docs']), 'docs', key('ArrowLeft'))).toEqual([
      { type: 'expand', id: 'docs', open: false },
    ])
  })

  it('branchClosed → navigate to parent (or null at top level)', () => {
    expect(treeExpand(tree(), 'docs', key('ArrowLeft'))).toBeNull()
  })

  it('leaf → navigate to parent', () => {
    expect(treeExpand(tree(['docs']), 'guide', key('ArrowLeft'))).toEqual([
      { type: 'navigate', id: 'docs' },
    ])
  })
})

describe('treeExpand axis — Enter / Space (toggle)', () => {
  it('branchClosed → open', () => {
    expect(treeExpand(tree(), 'docs', key('Enter'))).toEqual([
      { type: 'expand', id: 'docs', open: true },
    ])
  })

  it('branchOpen → close', () => {
    expect(treeExpand(tree(['docs']), 'docs', key('Enter'))).toEqual([
      { type: 'expand', id: 'docs', open: false },
    ])
    expect(treeExpand(tree(['docs']), 'docs', key(' '))).toEqual([
      { type: 'expand', id: 'docs', open: false },
    ])
  })

  it('leaf → null (no toggle)', () => {
    expect(treeExpand(tree(['docs']), 'guide', key('Enter'))).toBeNull()
    expect(treeExpand(tree(), 'blog', key(' '))).toBeNull()
  })
})

describe('treeExpand axis — disabled / non-mapped', () => {
  it('disabled branch ignores all keys', () => {
    const disabledTree = fromTree(
      [{ id: 'p', label: 'P', disabled: true, kids: [{ id: 'k', label: 'K' }] }],
      { getId: (n) => n.id, getKids: (n) => n.kids, toData: (n) => ({ label: n.label, disabled: n.disabled }) },
    )
    expect(treeExpand(disabledTree, 'p', key('ArrowRight'))).toBeNull()
    expect(treeExpand(disabledTree, 'p', key('Enter'))).toBeNull()
  })

  it('unrelated keys ignored', () => {
    expect(treeExpand(tree(), 'docs', key('Tab'))).toBeNull()
    expect(treeExpand(tree(), 'docs', key('a'))).toBeNull()
  })

  it('non-key triggers ignored', () => {
    expect(treeExpand(tree(), 'docs', { kind: 'click' })).toBeNull()
  })
})
