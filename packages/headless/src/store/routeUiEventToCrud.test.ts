import { describe, expect, it } from 'vitest'
import { routeUiEventToCrud, type CrudPort } from './routeUiEventToCrud'

const makeCrud = (): CrudPort & {
  log: string[]
} => {
  const log: string[] = []
  return {
    log,
    snapshot: () => ({ tag: 'snap' }),
    create: (p, k, v) => { log.push(`create ${p} ${String(k)} ${String(v)}`); return null },
    update: (id, v) => { log.push(`update ${id} ${String(v)}`); return null },
    delete: (id) => { log.push(`delete ${id}`); return null },
    copy:   (id) => { log.push(`copy ${id}`);   return null },
    cut:    (id) => { log.push(`cut ${id}`);    return null },
    paste:  (id, o) => { log.push(`paste ${id} ${o?.mode ?? '-'}`); return null },
    undo:   () => { log.push('undo'); return null },
    redo:   () => { log.push('redo'); return null },
  }
}

describe('routeUiEventToCrud', () => {
  it('routes 8 edit events 1:1 to CrudPort ops', () => {
    const c = makeCrud()
    routeUiEventToCrud(c, { type: 'create', parentId: 'p', key: 'k', value: 'v' })
    routeUiEventToCrud(c, { type: 'update', id: 'a', value: 'v' })
    routeUiEventToCrud(c, { type: 'remove', id: 'a' })
    routeUiEventToCrud(c, { type: 'copy', id: 'a' })
    routeUiEventToCrud(c, { type: 'cut',  id: 'a' })
    routeUiEventToCrud(c, { type: 'paste', id: 'a', mode: 'child' })
    routeUiEventToCrud(c, { type: 'undo' })
    routeUiEventToCrud(c, { type: 'redo' })
    expect(c.log).toEqual([
      'create p k v',
      'update a v',
      'delete a',
      'copy a', 'cut a',
      'paste a child',
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
