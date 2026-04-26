import { useEffect, useState } from 'react'
import { marked } from 'marked'
import { useParams, Link } from '@tanstack/react-router'
import { loadText } from '../finder/data'

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
  const displayHtml = text == null ? null : html

  return (
    <main data-part="markdown-app">
      <nav aria-label="경로" data-flow="cluster">
        <Link to="/finder/$" params={{ _splat: '' }}>← Finder</Link>
        <code>{path}</code>
      </nav>
      {text == null ? (
        <article aria-busy="true">로드 중…</article>
      ) : displayHtml == null ? (
        <article aria-busy="true" />
      ) : (
        <article data-flow="prose" dangerouslySetInnerHTML={{ __html: displayHtml }} />
      )}
    </main>
  )
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
  return marked.parse(src, { async: true, renderer })
}

function escapeHtml(s: string): string {
  return s.replace(/[&<>]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c] as string))
}
function escapeAttr(s: string): string {
  return s.replace(/["&<>]/g, (c) => ({ '"': '&quot;', '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c] as string))
}
