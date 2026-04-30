import { useEffect, useMemo, useState } from 'react'
import { useParams } from '@tanstack/react-router'
import { Renderer, definePage, ROOT, type NormalizedData } from '@p/ds'
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

  const page: NormalizedData = useMemo(() => {
    const proseHtml =
      text == null ? '<p aria-busy="true">로드 중…</p>' :
      total === 0 ? '<p>슬라이드가 없습니다. <code>---</code> 로 분할된 마크다운이 필요합니다.</p>' :
      html ?? ''
    const counter = total > 0 ? `${index + 1} / ${total}` : '0 / 0'
    return definePage({
      entities: {
        [ROOT]: { id: ROOT, data: {} },
        main:    { id: 'main',    data: { type: 'Main',    roledescription: 'slides-app', label: 'Slides 뷰어' } },
        stage:   { id: 'stage',   data: { type: 'Section', roledescription: 'slide-stage', label: '슬라이드' } },
        prose:   { id: 'prose',   data: { type: 'Ui',      component: 'Prose', props: { html: proseHtml, 'aria-label': '슬라이드 본문' } } },
        nav:     { id: 'nav',     data: { type: 'Footer',  flow: 'split', label: '슬라이드 네비' } },
        thumbs:  { id: 'thumbs',  data: { type: 'Ui',      component: 'Block', content: <ThumbnailStrip slides={deck?.slides ?? []} activeIndex={index} onJump={setIndex} /> } },
        counter: { id: 'counter', data: { type: 'Text',    variant: 'small', content: counter } },
      },
      relationships: {
        [ROOT]: ['main'],
        main: ['stage', 'nav'],
        stage: ['prose'],
        nav: ['thumbs', 'counter'],
      },
    })
  }, [text, total, html, index, deck])

  return <Renderer page={page} />
}

function useText(path: string) {
  const [loaded, setLoaded] = useState<{ path: string; text: string }>()
  useEffect(() => {
    let alive = true
    loadText(path).then((t) => { if (alive) setLoaded({ path, text: t }) })
    return () => { alive = false }
  }, [path])
  return loaded?.path === path ? loaded.text : null
}
