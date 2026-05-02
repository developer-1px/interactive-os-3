import { useEffect, useState } from 'react'
import { useParams } from '@tanstack/react-router'
import { useShortcut } from '@p/headless/key/useShortcut'
import { loadText, renderMarkdown } from '@p/fs'
import { splitMarkdown } from '../features/split'
import { ThumbnailStrip } from './ThumbnailStrip'

export function Slides() {
  const { _splat } = useParams({ strict: false }) as { _splat?: string }
  const path = _splat ? '/' + _splat : '/docs/slides-sample.md'
  const text = useText(path)

  const deck = text == null ? null : splitMarkdown(path, text)
  const total = deck?.slides.length ?? 0
  const [index, setIndex] = useState(0)

  useEffect(() => { setIndex(0) }, [path])

  const next = () => setIndex((i) => Math.min(i + 1, total - 1))
  const prev = () => setIndex((i) => Math.max(i - 1, 0))
  useShortcut('ArrowRight', next)
  useShortcut('PageDown',   next)
  useShortcut('Space',      next)
  useShortcut('ArrowLeft',  prev)
  useShortcut('PageUp',     prev)
  useShortcut('Home',       () => setIndex(0))
  useShortcut('End',        () => setIndex(Math.max(total - 1, 0)))

  const [html, setHtml] = useState<string | null>(null)
  useEffect(() => {
    const slide = deck?.slides[index]
    if (!slide) { setHtml(null); return }
    let alive = true
    renderMarkdown(slide.source).then((h) => { if (alive) setHtml(h) })
    return () => { alive = false }
  }, [deck, index])

  const proseHtml: string =
    text == null ? '<p aria-busy="true">로드 중…</p>' :
    total === 0 ? '<p>슬라이드가 없습니다. <code>---</code> 로 분할된 마크다운이 필요합니다.</p>' :
    html ?? ''
  const counter = total > 0 ? `${index + 1} / ${total}` : '0 / 0'

  return (
    <main
      aria-roledescription="slides-app"
      aria-label="Slides 뷰어"
      className="grid h-svh w-full grid-rows-[1fr_auto] bg-neutral-50"
    >
      <section
        aria-roledescription="slide-stage"
        aria-label="슬라이드"
        className="grid place-items-center overflow-hidden p-8"
      >
        <article
          aria-label="슬라이드 본문"
          dangerouslySetInnerHTML={{ __html: proseHtml }}
          className="aspect-video w-[min(100%,calc((100svh-9rem)*16/9))] max-h-[calc(100%-1rem)] overflow-auto rounded border border-neutral-200 bg-white p-12 shadow-2xl"
        />
      </section>
      <footer
        aria-label="슬라이드 네비"
        className="grid grid-cols-[1fr_auto] items-center gap-3 border-t border-neutral-200 bg-white px-4 py-2 text-sm"
      >
        <ThumbnailStrip slides={deck?.slides ?? []} activeIndex={index} onJump={setIndex} />
        <small className="tabular-nums text-neutral-500">{counter}</small>
      </footer>
    </main>
  )
}

function useText(path: string) {
  const [loaded, setLoaded] = useState<{ path: string; text: string }>()
  useEffect(() => {
    let alive = true
    loadText(path).then((t) => { if (alive && typeof t === 'string') setLoaded({ path, text: t }) })
    return () => { alive = false }
  }, [path])
  return loaded?.path === path ? loaded.text : null
}
