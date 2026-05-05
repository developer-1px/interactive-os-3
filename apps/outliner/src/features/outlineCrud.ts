import { createJsonCrud } from 'zod-crud'
import { OutlineNode, SAMPLE } from '../entities/outlineNode'

/**
 * focusFilter — outline 의미 있는 노드(object) 만 focus 후보. array/string 중간 노드 skip.
 * defaultFor — 패턴이 value 없이 보내는 insertAfter/appendChild 의 schema-aware 기본값.
 */
export const crud = createJsonCrud(OutlineNode, SAMPLE, {
  focusFilter: (doc, id) => doc.nodes[id]?.type === 'object',
  defaultFor: () => ({ text: '', children: [] }),
})
