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
    return h.codeToHtml(code, {
      lang: use,
      themes: { light: 'github-light', dark: 'github-dark' },
    })
  } catch {
    return ''
  }
}
