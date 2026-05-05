import type { JsonDoc, JsonNode, NodeId } from 'zod-crud'
import type { NormalizedData } from '@p/headless'

/**
 * OutlineItem — 화면용으로 평탄화한 outline node 표현.
 * zod-crud `JsonDoc` 은 모든 JSON 토큰(object/array/string/number) 을 별개 JsonNode 로
 * 보유한다. outline 표시는 **object node 만** 뽑아서 트리로 평탄화한다.
 * 각 outline 노드의 자식은 그 object 의 `children` array node 의 children.
 */
export interface OutlineItem extends Record<string, unknown> {
  id: NodeId
  text: string
  /** 빈 배열도 id 가 존재 — Enter(create-sibling) 에서 부모의 array id 로 사용. */
  childrenArrayId: NodeId | null
  /** outline 트리에서의 부모 object node id (root 는 null). */
  parentObjectId: NodeId | null
}

const findChild = (
  doc: JsonDoc,
  parentId: NodeId,
  key: string | number,
): JsonNode | undefined => {
  const parent = doc.nodes[parentId]
  if (!parent) return undefined
  return parent.children.map((cid) => doc.nodes[cid]).find((n) => n?.key === key)
}

export function flattenOutline(doc: JsonDoc): {
  data: NormalizedData<OutlineItem>
  items: OutlineItem[]
} {
  const entities: Record<string, OutlineItem> = {}
  const relationships: Record<string, string[]> = {}
  const items: OutlineItem[] = []

  const walk = (objId: NodeId, parentObjectId: NodeId | null) => {
    const obj = doc.nodes[objId]
    if (!obj || obj.type !== 'object') return
    const textNode = findChild(doc, objId, 'text')
    const childrenArr = findChild(doc, objId, 'children')
    const item: OutlineItem = {
      id: objId,
      text: typeof textNode?.value === 'string' ? textNode.value : '',
      childrenArrayId: childrenArr?.id ?? null,
      parentObjectId,
    }
    entities[objId] = item
    items.push(item)
    if (childrenArr && childrenArr.children.length) {
      relationships[objId] = [...childrenArr.children]
      for (const cid of childrenArr.children) walk(cid, objId)
    }
  }
  walk(doc.rootId, null)

  return {
    data: { entities, relationships, meta: { root: [doc.rootId] } },
    items,
  }
}
