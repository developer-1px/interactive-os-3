import { createJsonCrud } from 'zod-crud'
import { outlinerSpec } from './outliner.spec'

/** zod-crud singleton — outliner.spec.entity 로 schema-aware CRUD. */
export const crud = createJsonCrud(outlinerSpec.schema.entity, outlinerSpec.schema.initial, {
  focusFilter: (doc, id) => doc.nodes[id]?.type === 'object',
  defaultFor: () => outlinerSpec.schema.emptyValue,
})
