import { useEffect, useState } from 'react'
import { Link } from '@tanstack/react-router'
import { marked } from 'marked'
import { formatDate, formatSize, getImageUrl, loadText } from './data'
import { extToIcon, extToLang, extToPreviewKind, type FsNode } from './types'
import { highlightCode } from './highlight'

const MAX_TEXT_BYTES = 512 * 1024

export function Preview({ node }: { node: FsNode | null }) {
  const show = node?.type === 'file'
  return (
    <aside aria-roledescription="preview" aria-label="미리보기" aria-hidden={!show}>
      {show && node && (
        <>
          <PreviewBody node={node} />
          <Meta node={node} />
        </>
      )}
    </aside>
  )
}

export function PreviewBody({ node }: { node: FsNode }) {
  const kind = extToPreviewKind(node.ext)
  const tooLarge = (node.size ?? 0) > MAX_TEXT_BYTES

  if (kind === 'image') {
    const src = getImageUrl(node.path)
    if (!src) return <Header node={node} note="이미지를 찾을 수 없습니다" />
    return <img src={src} alt={node.name} />
  }
  if (kind === 'binary') return <Header node={node} note="미리보기를 지원하지 않는 형식" />
  if (tooLarge) return <Header node={node} note="파일이 커서 메타만 표시합니다" />

  if (kind === 'markdown') return <MarkdownView node={node} />
  if (kind === 'code') return <CodeView node={node} />
  return <TextView node={node} />
}

function Header({ node, note }: { node: FsNode; note?: string }) {
  return (
    <header>
      <figure data-icon={extToIcon(node.ext)} aria-hidden />
      <div>
        <h2>{node.name}</h2>
        <p>{(node.ext ?? 'file').toUpperCase()} — {formatSize(node.size)}</p>
        {note && <p>{note}</p>}
      </div>
    </header>
  )
}

function Meta({ node }: { node: FsNode }) {
  return (
    <dl>
      <dt>종류</dt><dd>{node.ext || '파일'}</dd>
      <dt>경로</dt><dd title={node.path}>{node.path}</dd>
      {node.size != null && <><dt>크기</dt><dd>{formatSize(node.size)}</dd></>}
      {node.mtime && <><dt>수정일</dt><dd>{formatDate(node.mtime)}</dd></>}
    </dl>
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

function TextView({ node }: { node: FsNode }) {
  const text = useText(node.path)
  if (text == null) return <pre aria-busy="true" />
  return <pre>{text}</pre>
}

function CodeView({ node }: { node: FsNode }) {
  const text = useText(node.path)
  const lang = extToLang(node.ext)
  const [html, setHtml] = useState<string | null>(null)
  useEffect(() => {
    if (text == null) return
    let alive = true
    highlightCode(text, lang).then((h) => { if (alive) setHtml(h) })
    return () => { alive = false }
  }, [text, lang])
  if (text == null) return <pre aria-busy="true" />
  if (html == null) return <pre data-lang={lang}>{text}</pre>
  return <pre data-lang={lang} dangerouslySetInnerHTML={{ __html: html }} />
}

function MarkdownView({ node }: { node: FsNode }) {
  const text = useText(node.path)
  const [html, setHtml] = useState<string | null>(null)
  useEffect(() => {
    if (text == null) return
    let alive = true
    renderMarkdown(text).then((h) => { if (alive) setHtml(h) })
    return () => { alive = false }
  }, [text])
  if (text == null || html == null) return <article aria-busy="true" />
  return (
    <>
      <nav aria-label="마크다운 액션">
        <Link to="/markdown/$" params={{ _splat: node.path.replace(/^\//, '') }}>전체 화면으로 열기 ↗</Link>
      </nav>
      <article data-flow="prose" dangerouslySetInnerHTML={{ __html: html }} />
    </>
  )
}

async function renderMarkdown(src: string): Promise<string> {
  const renderer = new marked.Renderer()
  renderer.code = ({ text, lang }) => {
    const safeLang = lang || 'txt'
    try {
      // marked renderer는 sync — 간단히 raw 후 client에서 재하이라이트 하지 않고
      // 여기서는 plain <pre><code>로 렌더. shiki 적용은 별도 패스.
      return `<pre data-lang="${escapeAttr(safeLang)}"><code>${escapeHtml(text)}</code></pre>`
    } catch {
      return `<pre><code>${escapeHtml(text)}</code></pre>`
    }
  }
  const html = await marked.parse(src, { async: true, renderer })
  return html
}

function escapeHtml(s: string): string {
  return s.replace(/[&<>]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c] as string))
}
function escapeAttr(s: string): string {
  return s.replace(/["&<>]/g, (c) => ({ '"': '&quot;', '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c] as string))
}
