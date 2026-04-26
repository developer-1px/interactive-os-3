/**
 * Frontmatter 파서 — md 파일의 `--- ... ---` YAML 블록 추출.
 *
 * aria/scripts/mddb/extractContent.ts 포팅. ds는 yaml deps 없으므로 docs에서
 * 실제 사용되는 형태(scalar + 인라인 배열 [a, b] + - list)만 처리하는 mini parser.
 *
 * @invariant pure sync — 파일 IO 없음
 * @invariant tags 추출 우선순위: rawFrontmatter.tags 배열만 (하단 hashtag 미지원 — aria 결정과 동일)
 * @invariant 빈 파일·미완 frontmatter 도 throw 하지 않는다 (best-effort)
 */

const FRONTMATTER_RE = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/

export type RawFrontmatter = Record<string, unknown>

export type FrontmatterExtract = {
  /** 첫 # heading 텍스트 (코드블록 제외). frontmatter.title 보다 후순위 */
  title?: string
  rawFrontmatter?: RawFrontmatter
  body: string
  hasFrontmatterBlock: boolean
  parseError?: string
}

export function extractFrontmatter(source: string): FrontmatterExtract {
  const result: FrontmatterExtract = { body: source, hasFrontmatterBlock: false }

  const fm = FRONTMATTER_RE.exec(source)
  if (fm) {
    result.hasFrontmatterBlock = true
    result.body = fm[2]
    try {
      result.rawFrontmatter = parseMiniYaml(fm[1])
    } catch (e) {
      result.parseError = (e as Error).message
    }
  }

  // body 첫 # heading (코드블록 제외)
  const lines = result.body.split('\n')
  let inFence = false
  for (const line of lines) {
    if (/^(```|~~~)/.test(line)) { inFence = !inFence; continue }
    if (inFence) continue
    const m = line.match(/^# +(.+?)\s*$/)
    if (m) { result.title = m[1].trim(); break }
  }

  return result
}

/**
 * Mini YAML — frontmatter에 실제로 쓰이는 형태만 처리.
 *   - `key: value` (scalar)
 *   - `key: [a, b, c]` (인라인 배열)
 *   - `key:\n  - a\n  - b` (list 형태 — 2-space indent)
 *   - `key: 'quoted'` / `key: "quoted"` 따옴표 제거
 *   - `#` 라인 주석은 무시
 *
 * 중첩 객체는 지원 안 함 — frontmatter는 평탄하다는 mddb 결정과 동일.
 */
function parseMiniYaml(src: string): RawFrontmatter {
  const out: RawFrontmatter = {}
  const lines = src.split(/\r?\n/)

  let i = 0
  while (i < lines.length) {
    const raw = lines[i]
    const line = raw.replace(/\s+#.*$/, '').trimEnd()
    i++
    if (!line.trim() || line.trimStart().startsWith('#')) continue

    const m = line.match(/^([A-Za-z_][\w-]*)\s*:\s*(.*)$/)
    if (!m) continue
    const [, key, rest] = m

    if (rest === '') {
      // multi-line list
      const items: string[] = []
      while (i < lines.length) {
        const next = lines[i]
        const lm = next.match(/^\s+-\s*(.*)$/)
        if (!lm) break
        items.push(stripQuotes(lm[1].trim()))
        i++
      }
      out[key] = items
    } else if (rest.startsWith('[') && rest.endsWith(']')) {
      out[key] = rest.slice(1, -1)
        .split(',')
        .map((s) => stripQuotes(s.trim()))
        .filter(Boolean)
    } else {
      out[key] = stripQuotes(rest)
    }
  }

  return out
}

function stripQuotes(v: string): string {
  if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) {
    return v.slice(1, -1)
  }
  return v
}

/**
 * DocFrontmatter — ds에서 소비하는 표준 필드. aria mddb schema의 핵심 부분만.
 * 모든 필드 optional — 파일이 frontmatter를 갖지 않을 수 있다.
 */
export type DocFrontmatter = {
  id?: string
  type?: string
  slug?: string
  title?: string
  tags?: string[]
  created?: string
  updated?: string
  status?: string
  project?: string
  layer?: string
  summary?: string
}

export function normalizeFrontmatter(raw: RawFrontmatter | undefined): DocFrontmatter {
  if (!raw) return {}
  const str = (k: string): string | undefined => {
    const v = raw[k]
    return typeof v === 'string' && v.length > 0 ? v : undefined
  }
  const arr = (k: string): string[] | undefined => {
    const v = raw[k]
    if (Array.isArray(v)) return v.filter((x): x is string => typeof x === 'string' && x.length > 0)
    return undefined
  }
  return {
    id: str('id'),
    type: str('type'),
    slug: str('slug'),
    title: str('title'),
    tags: arr('tags'),
    created: str('created'),
    updated: str('updated'),
    status: str('status'),
    project: str('project'),
    layer: str('layer'),
    summary: str('summary'),
  }
}
