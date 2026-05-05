import type { JsonDoc, NodeId } from 'zod-crud'
import type { NormalizedData } from '@p/headless'

/**
 * flattenOutline — JsonDoc 의 object 노드만 뽑아 NormalizedData 로 평탄화.
 * outline 표시는 *object 노드* = outline item. text 를 entity.label 로 노출.
 */
export function flattenOutline(doc: JsonDoc): NormalizedData {
  const entities: NormalizedData['entities'] = {}
  const relationships: NormalizedData['relationships'] = {}

  const walk = (objId: NodeId) => {
    const obj = doc.nodes[objId]
    if (!obj || obj.type !== 'object') return
    const text = obj.children
      .map((cid) => doc.nodes[cid])
      .find((n) => n?.key === 'text')?.value
    const childrenArr = obj.children
      .map((cid) => doc.nodes[cid])
      .find((n) => n?.key === 'children')
    entities[objId] = { label: typeof text === 'string' ? text : '' }
    const kids = childrenArr?.children ?? []
    if (kids.length) {
      relationships[objId] = [...kids]
      for (const cid of kids) walk(cid)
    }
  }
  walk(doc.rootId)

  return { entities, relationships, meta: { root: [doc.rootId] } }
}
