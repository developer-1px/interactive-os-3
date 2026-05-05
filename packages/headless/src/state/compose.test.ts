import { describe, expect, it } from 'vitest'

import type { NormalizedData, UiEvent } from '../types'

import { composeReducers, type Reducer } from './compose'

const baseData: NormalizedData = {
  entities: { a: { id: 'a' }, b: { id: 'b' } },
  relationships: { ROOT: ['a', 'b'] },
  meta: {},
}

describe('composeReducers', () => {
  it('runs reducers left-to-right, each seeing the previous output', () => {
    // navigate slice — focus 갱신
    const navigate: Reducer = (d, e) =>
      e.type === 'navigate' && 'id' in e && e.id
        ? { ...d, meta: { ...d.meta, focus: e.id } }
        : d

    // selection slice — anchor 도 같이 박는 도메인 조합 (focus 결과를 본 뒤)
    const selection: Reducer = (d, e) =>
      e.type === 'navigate' ? { ...d, meta: { ...d.meta, selectAnchor: d.meta?.focus ?? null } } : d

    const composed = composeReducers(navigate, selection)
    const next = composed(baseData, { type: 'navigate', id: 'a' } as UiEvent)

    expect(next.meta?.focus).toBe('a')
    expect(next.meta?.selectAnchor).toBe('a') // selection 이 navigate 결과를 본 증거
  })

  it('passes data through unchanged when no reducer recognises the event', () => {
    const navigate: Reducer = (d, e) =>
      e.type === 'navigate' && 'id' in e && e.id ? { ...d, meta: { ...d.meta, focus: e.id } } : d
    const expand: Reducer = (d, e) => (e.type === 'expand' ? d : d) // 명시 identity

    const composed = composeReducers(navigate, expand)
    const next = composed(baseData, { type: 'activate', id: 'a' } as UiEvent)

    // 둘 다 모르는 type → identity. 데이터/메타 그대로.
    expect(next.meta?.focus).toBeUndefined()
    expect(next.entities).toBe(baseData.entities)
  })
})
