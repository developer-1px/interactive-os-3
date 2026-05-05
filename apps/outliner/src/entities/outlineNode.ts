import { z } from 'zod'

/**
 * OutlineNode — 재귀 outline. zod-crud 의 JsonNode id 를 outline node id 로 그대로 사용.
 * 각 OutlineNode 는 zod-crud `JsonDoc.nodes` 안의 한 object node 와 1:1 대응.
 */
export type OutlineNode = { text: string; children: OutlineNode[] }

export const OutlineNode: z.ZodType<OutlineNode> = z.object({
  text: z.string(),
  get children() {
    return z.array(OutlineNode)
  },
})

export const SAMPLE: OutlineNode = {
  text: 'Welcome to the outliner',
  children: [
    { text: 'Press Enter to add a sibling', children: [] },
    { text: 'Press Tab to indent, Shift+Tab to outdent', children: [] },
    {
      text: 'Cmd+C / Cmd+X / Cmd+V — clipboard',
      children: [
        { text: 'paste-as-sibling: Cmd+V', children: [] },
        { text: 'paste-as-child:   Cmd+Shift+V', children: [] },
      ],
    },
    { text: 'Cmd+Z / Cmd+Shift+Z — undo / redo', children: [] },
    { text: 'Backspace — delete', children: [] },
  ],
}
