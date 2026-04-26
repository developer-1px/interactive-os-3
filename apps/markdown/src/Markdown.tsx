import { useEffect, useMemo, useState } from 'react'
import { useParams } from '@tanstack/react-router'
import { Renderer, definePage, ROOT, type NormalizedData } from '@p/ds'
import { loadText, renderMarkdown } from '@p/fs'

export function Markdown() {
  const { _splat } = useParams({ strict: false }) as { _splat?: string }
  const path = '/' + (_splat ?? '')
  const text = useText(path)
  const [html, setHtml] = useState<string | null>(null)

  useEffect(() => {
    if (text == null) return
    let alive = true
    renderMarkdown(text).then((h) => { if (alive) setHtml(h) })
    return () => { alive = false }
  }, [text])

  const page: NormalizedData = useMemo(() => {
    const proseHtml =
      text == null ? '<p aria-busy="true">로드 중…</p>' :
      html == null ? '' :
      html
    return definePage({
      entities: {
        [ROOT]: { id: ROOT, data: {} },
        main: { id: 'main', data: { type: 'Main', flow: 'prose', roledescription: 'markdown-app', label: 'Markdown 뷰어' } },
        nav:  { id: 'nav',  data: { type: 'Nav',  flow: 'cluster', label: '경로' } },
        backLink: { id: 'backLink', data: { type: 'Ui', component: 'Link', props: { to: '/finder/$', params: { _splat: '' }, label: '← Finder' } } },
        pathText: { id: 'pathText', data: { type: 'Text', variant: 'small', content: path } },
        prose: { id: 'prose', data: { type: 'Ui', component: 'Prose', props: { html: proseHtml, 'aria-label': '문서 본문' } } },
      },
      relationships: {
        [ROOT]: ['main'],
        main: ['nav', 'prose'],
        nav: ['backLink', 'pathText'],
      },
    })
  }, [path, text, html])

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

