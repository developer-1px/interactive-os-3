import type { JsonDoc, NodeId } from 'zod-crud'

/**
 * resolveTextNodeId — outline object node 의 `text` child 노드 id 를 찾는다.
 * outline entity 구조 (object → {text, children}) 에 결합된 도메인 헬퍼.
 */
export function resolveTextNodeId(doc: JsonDoc, objectId: NodeId): NodeId | undefined {
  const obj = doc.nodes[objectId]
  if (obj?.type !== 'object') return undefined
  return obj.children.find((cid) => doc.nodes[cid]?.key === 'text')
}
