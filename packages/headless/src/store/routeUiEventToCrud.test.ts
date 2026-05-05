import { describe, expect, it } from 'vitest'
import { routeUiEventToCrud, type CrudPort } from './routeUiEventToCrud'

const makeCrud = (): CrudPort & { log: string[] } => {
  const log: string[] = []
  return {
    log,
    snapshot: () => ({ tag: 'snap' }),
    insertAfter: (s, v) => { log.push(`insertAfter ${s} ${String(v)}`); return null },
    appendChild: (p, v) => { log.push(`appendChild ${p} ${String(v)}`); return null },
    update: (id, v) => { log.push(`update ${id} ${String(v)}`); return null },
    delete: (id) => { log.push(`delete ${id}`); return null },
    copy:   (id) => { log.push(`copy ${id}`);   return null },
    cut:    (id) => { log.push(`cut ${id}`);    return null },
    paste:  (id, o) => { log.push(`paste ${id} ${o?.mode ?? '-'} ${o?.index ?? '-'}`); return null },
    undo:   () => { log.push('undo'); return null },
    redo:   () => { log.push('redo'); return null },
  }
}

describe('routeUiEventToCrud', () => {
  it('routes 9 edit events 1:1 to CrudPort ops', () => {
    const c = makeCrud()
    routeUiEventToCrud(c, { type: 'insertAfter', siblingId: 'a', value: 'v' })
    routeUiEventToCrud(c, { type: 'appendChild', parentId: 'p', value: 'v' })
    routeUiEventToCrud(c, { type: 'update', id: 'a', value: 'v' })
    routeUiEventToCrud(c, { type: 'remove', id: 'a' })
    routeUiEventToCrud(c, { type: 'copy', id: 'a' })
    routeUiEventToCrud(c, { type: 'cut',  id: 'a' })
    routeUiEventToCrud(c, { type: 'paste', targetId: 'a', mode: 'child', index: 2 })
    routeUiEventToCrud(c, { type: 'undo' })
    routeUiEventToCrud(c, { type: 'redo' })
    expect(c.log).toEqual([
      'insertAfter a v',
      'appendChild p v',
      'update a v',
      'delete a',
      'copy a', 'cut a',
      'paste a child 2',
      'undo', 'redo',
    ])
  })

  it('returns undefined for non-edit events (host responsibility)', () => {
    const c = makeCrud()
    expect(routeUiEventToCrud(c, { type: 'navigate', id: 'a' })).toBeUndefined()
    expect(routeUiEventToCrud(c, { type: 'activate', id: 'a' })).toBeUndefined()
    expect(routeUiEventToCrud(c, { type: 'expand', id: 'a', open: true })).toBeUndefined()
    expect(c.log).toEqual([])
  })

  it('returns snapshot after edit op', () => {
    const c = makeCrud()
    expect(routeUiEventToCrud(c, { type: 'undo' })).toEqual({ tag: 'snap' })
  })
})
