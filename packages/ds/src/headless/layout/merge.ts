/**
 * merge — entity-level 합성. 같은 id가 들어오면 뒤가 이긴다(slot 치환 패턴).
 * relationships의 같은 부모 키도 뒤가 이긴다(전체 교체). 동일 부모에 자식
 * 추가가 필요하면 명시적으로 spread한 fragment을 써라.
 */
import type { NormalizedData } from '../types'

export function merge(...frags: NormalizedData[]): NormalizedData {
  const entities: NormalizedData['entities'] = {}
  const relationships: NormalizedData['relationships'] = {}
  for (const f of frags) {
    for (const [id, e] of Object.entries(f.entities)) entities[id] = e
    for (const [pid, kids] of Object.entries(f.relationships)) relationships[pid] = kids
  }
  return { entities, relationships }
}
