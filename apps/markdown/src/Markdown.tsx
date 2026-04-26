import { useEffect, useMemo, useState } from 'react'
import { marked } from 'marked'
import { useParams } from '@tanstack/react-router'
import { Renderer, definePage, ROOT, type NormalizedData } from '@p/ds'
import { loadText } from '@p/fs'

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

async function renderMarkdown(src: string): Promise<string> {
  const renderer = new marked.Renderer()
  renderer.code = ({ text, lang }) => {
    const safeLang = lang || 'txt'
    return `<pre data-lang="${escapeAttr(safeLang)}"><code>${escapeHtml(text)}</code></pre>`
  }
  return marked.parse(stripFrontmatter(src), { async: true, renderer })
}

function stripFrontmatter(src: string): string {
  const m = src.match(/^---\r?\n[\s\S]*?\r?\n---\r?\n/)
  return m ? src.slice(m[0].length) : src
}

function escapeHtml(s: string): string {
  return s.replace(/[&<>]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c] as string))
}
function escapeAttr(s: string): string {
  return s.replace(/["&<>]/g, (c) => ({ '"': '&quot;', '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c] as string))
}
