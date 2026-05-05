import { z } from 'zod'

export const Card = z.object({ title: z.string() })
export type Card = z.infer<typeof Card>

export const Column = z.object({
  title: z.string(),
  cards: z.array(Card),
})
export type Column = z.infer<typeof Column>

export const Board = z.object({
  title: z.string(),
  columns: z.array(Column),
})
export type Board = z.infer<typeof Board>

export const SAMPLE: Board = {
  title: 'Roadmap',
  columns: [
    {
      title: 'Backlog',
      cards: [
        { title: 'Spec drag-free move' },
        { title: 'Decide column min-width' },
      ],
    },
    {
      title: 'In progress',
      cards: [
        { title: 'Implement Listbox per column' },
        { title: 'Wire cut/paste cross-column' },
      ],
    },
    {
      title: 'Done',
      cards: [
        { title: 'zod-crud subscribe(changes, focusNodeId)' },
        { title: 'Outliner example' },
      ],
    },
  ],
}
