import { z } from 'zod'

/** 슬라이드 1장 — 분할된 마크다운 조각 */
export const SlideSchema = z.object({
  index: z.number().int().nonnegative(),
  source: z.string(),
})
export type Slide = z.infer<typeof SlideSchema>

/** Deck — 마크다운 1개 파일이 분할되어 만들어진 슬라이드 묶음 */
export const DeckSchema = z.object({
  path: z.string(),
  slides: z.array(SlideSchema),
})
export type Deck = z.infer<typeof DeckSchema>
