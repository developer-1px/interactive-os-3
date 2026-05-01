import { Listbox, fromList, type UiEvent } from '@p/ds'
import type { Slide } from '../entities/schema'

/** 썸네일 필름스트립 — 현재 deck 의 슬라이드 N장을 16:9 미니 카드로 나열.
 *  각 썸네일은 "1 · 첫 줄 헤딩" 라벨. activate → 해당 index 로 점프. */
export function ThumbnailStrip({
  slides, activeIndex, onJump,
}: { slides: Slide[]; activeIndex: number; onJump: (i: number) => void }) {
  const data = fromList(
    slides.map((s, i) => ({
      id: String(i),
      label: `${i + 1}`,
      title: firstHeading(s.source),
      selected: i === activeIndex,
    })),
  )
  const onEvent = (e: UiEvent) => {
    if (e.type === 'activate' && typeof e.id === 'string') {
      const i = Number(e.id)
      if (Number.isInteger(i) && i >= 0 && i < slides.length) onJump(i)
    }
  }
  return (
    <nav data-part="thumbnails" aria-label="슬라이드 썸네일">
      <Listbox data={data} onEvent={onEvent} aria-label="썸네일" />
    </nav>
  )
}

function firstHeading(src: string): string {
  for (const line of src.split('\n')) {
    const m = line.match(/^#+\s+(.+)/)
    if (m) return m[1].trim()
    const t = line.trim()
    if (t.length > 0) return t.slice(0, 40)
  }
  return ''
}
