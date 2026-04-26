import { createHighlighter, type Highlighter } from 'shiki'

const LANGS = [
  'ts', 'tsx', 'js', 'jsx', 'json', 'yaml', 'toml',
  'css', 'scss', 'sass', 'html', 'xml', 'md', 'mdx', 'bash',
] as const

let hl: Promise<Highlighter> | null = null
function get(): Promise<Highlighter> {
  if (!hl) {
    hl = createHighlighter({
      themes: ['github-light', 'github-dark'],
      langs: LANGS as unknown as string[],
    })
  }
  return hl
}

export async function highlightCode(code: string, lang: string): Promise<string> {
  const h = await get()
  const loaded = h.getLoadedLanguages()
  const use = loaded.includes(lang as never) ? lang : 'txt'
  try {
    const html = h.codeToHtml(code, {
      lang: use,
      themes: { light: 'github-light', dark: 'github-dark' },
    })
    // shiki는 <pre class="shiki"><code>…</code></pre> 형태를 반환하지만
    // 우리 CodeView가 이미 <pre>로 감싸므로 outer <pre>를 벗겨 중첩을 제거한다.
    return html.replace(/^<pre[^>]*>/, '').replace(/<\/pre>$/, '')
  } catch {
    return ''
  }
}
