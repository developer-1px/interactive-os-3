import { describe, expect, it } from 'vitest'
import { fromFlatTree } from './fromFlatTree'

describe('fromFlatTree', () => {
  it('builds NormalizedData from a zod-crud-shaped JsonDoc', () => {
    const nodes = {
      n1: { id: 'n1', type: 'object', children: ['n2', 'n3'] },
      n2: { id: 'n2', type: 'string', children: [] as string[] },
      n3: { id: 'n3', type: 'array', children: ['n4'] },
      n4: { id: 'n4', type: 'number', children: [] as string[] },
    }
    const data = fromFlatTree(nodes, 'n1', { children: (n) => n.children })

    expect(data.entities.n1).toEqual(nodes.n1)
    expect(data.entities.n4).toEqual(nodes.n4)
    expect(data.relationships.n1).toEqual(['n2', 'n3'])
    expect(data.relationships.n3).toEqual(['n4'])
    expect(data.relationships.n2).toBeUndefined()
    expect(data.meta?.root).toEqual(['n1'])
  })

  it('walks only reachable nodes from rootId', () => {
    const nodes = {
      r: { id: 'r', kids: ['a'] },
      a: { id: 'a', kids: [] as string[] },
      orphan: { id: 'orphan', kids: [] as string[] },
    }
    const data = fromFlatTree(nodes, 'r', { children: (n) => n.kids })
    expect(Object.keys(data.entities).sort()).toEqual(['a', 'r'])
  })

  it('passes meta options through (focusId, expanded)', () => {
    const nodes = { r: { id: 'r', children: [] as string[] } }
    const data = fromFlatTree(nodes, 'r', { children: (n) => n.children }, {
      focusId: 'r',
      expanded: ['r'],
    })
    expect(data.meta?.focus).toBe('r')
    expect(data.meta?.expanded).toEqual(['r'])
  })

  it('survives unknown rootId without throwing', () => {
    const data = fromFlatTree({} as Record<string, { children: string[] }>, 'missing', {
      children: (n) => n.children,
    })
    expect(data.entities).toEqual({})
    expect(data.meta?.root).toEqual(['missing'])
  })
})
