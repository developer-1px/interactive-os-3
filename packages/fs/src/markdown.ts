import { marked } from 'marked'
import { extractFrontmatter } from './frontmatter'

/**
 * Markdown → HTML 정본 통로. frontmatter 는 extractFrontmatter 로 분리하여
 * body 만 렌더 — 첫 줄 `---` 이 HR 로, frontmatter 내용이 H2 로 mis-parse 되는
 * 결함을 한 곳에서 차단한다.
 *
 * @invariant code block 은 raw text 보존 (Prism 같은 highlighter 가 별도로 처리).
 *            lang 은 data-lang 속성에 escape 후 부착.
 */
export async function renderMarkdown(src: string): Promise<string> {
  const { body } = extractFrontmatter(src)
  const renderer = new marked.Renderer()
  renderer.code = ({ text, lang }) => {
    const safeLang = lang || 'txt'
    return `<pre data-lang="${escapeAttr(safeLang)}"><code>${escapeHtml(text)}</code></pre>`
  }
  return marked.parse(body, { async: true, renderer })
}

function escapeHtml(s: string): string {
  return s.replace(/[&<>]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c] as string))
}

function escapeAttr(s: string): string {
  return s.replace(/["&<>]/g, (c) => ({ '"': '&quot;', '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c] as string))
}
