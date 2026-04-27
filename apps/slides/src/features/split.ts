import { DeckSchema, type Deck } from '../entities/schema'

/** 정본: `^---$` 수평선 1개가 슬라이드 경계.
 *  Marpit/Slidev/Deckset 수렴 표준. CANONICAL.md "마크다운→슬라이드 분할" 항목.
 *
 *  - 줄 단독 `---`만 경계 (인라인 `---` 무시)
 *  - 빈 슬라이드는 제외
 *  - frontmatter 슬라이드 메타(`---\nlayout: x\n---`)는 후속 — 현 minimal은 본문만 */
export function splitMarkdown(path: string, text: string): Deck {
  const parts = text.split(/\r?\n---\r?\n/)
  const slides = parts
    .map((s, i) => ({ index: i, source: s.trim() }))
    .filter((s) => s.source.length > 0)
    .map((s, i) => ({ index: i, source: s.source }))
  return DeckSchema.parse({ path, slides })
}
