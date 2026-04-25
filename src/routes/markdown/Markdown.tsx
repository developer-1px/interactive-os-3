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
    if (text == null) { setHtml(null); return }
    let alive = true
    renderMarkdown(text).then((h) => { if (alive) setHtml(h) })
    return () => { alive = false }
  }, [text])

  return (
    <main aria-roledescription="markdown-app">
      <nav aria-label="경로" data-flow="cluster">
        <Link to="/finder/$" params={{ _splat: '' }}>← Finder</Link>
        <code>{path}</code>
      </nav>
      {text == null ? (
        <article aria-busy="true">로드 중…</article>
      ) : html == null ? (
        <article aria-busy="true" />
      ) : (
        <article data-flow="prose" dangerouslySetInnerHTML={{ __html: html }} />
      )}
    </main>
  )
}

function useText(path: string) {
  const [text, setText] = useState<string | null>(null)
  useEffect(() => {
    let alive = true
    setText(null)
    loadText(path).then((t) => { if (alive) setText(t) })
    return () => { alive = false }
  }, [path])
  return text
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
