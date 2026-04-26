/**
 * dsCss 정적 분석 — 순수 문자열 파서.
 * scripts/audit-ds-css.ts (소스 스캔) 와 src/ds/index.ts (런타임 가드) 가 공유한다.
 *
 * native CSS nesting 미사용 가정 — at-rule 안쪽만 한 단계 더 파싱.
 * @file 마커: /*@ds:src <path>*\/ 주석을 만나면 이후 rule 들의 source 가 그 path.
 */

export type Rule = { selector: string; body: string; source?: string }

function stripComments(s: string): string {
  return s.replace(/\/\*[\s\S]*?\*\//g, '')
}

export function parseRules(src: string, source?: string): Rule[] {
  const out: Rule[] = []
  const s = stripComments(src)
  let i = 0
  let buf = ''
  while (i < s.length) {
    const c = s[i]
    if (c === '{') {
      const selector = buf.trim()
      buf = ''
      let depth = 1
      i++
      const start = i
      while (i < s.length && depth > 0) {
        if (s[i] === '{') depth++
        else if (s[i] === '}') depth--
        if (depth > 0) i++
      }
      const body = s.slice(start, i)
      i++
      if (selector.startsWith('@media') || selector.startsWith('@supports') || selector.startsWith('@layer')) {
        for (const r of parseRules(body, source)) out.push(r)
      } else if (selector.length > 0 && !selector.startsWith('@')) {
        out.push({ selector, body: body.trim(), source })
      }
    } else {
      buf += c
      i++
    }
  }
  return out
}

/** segment 배열 → 모든 rule (source 자동 부착) */
export function parseSegments(segments: ReadonlyArray<readonly [string, string]>): Rule[] {
  const all: Rule[] = []
  for (const [source, css] of segments) for (const r of parseRules(css, source)) all.push(r)
  return all
}

// ── selector / body 정규화 ─────────────────────────────────────────────
export const normSelector = (sel: string) =>
  sel.replace(/\s+/g, ' ').replace(/\s*,\s*/g, ',').replace(/\s*([>+~])\s*/g, '$1').trim()

export function splitTopLevel(s: string, sep: string): string[] {
  const out: string[] = []
  let depth = 0, start = 0
  for (let i = 0; i < s.length; i++) {
    const c = s[i]
    if (c === '(' || c === '[') depth++
    else if (c === ')' || c === ']') depth--
    else if (c === sep && depth === 0) {
      out.push(s.slice(start, i))
      start = i + 1
    }
  }
  out.push(s.slice(start))
  return out
}

export const splitSelectorList = (sel: string) =>
  splitTopLevel(sel, ',').map((s) => s.trim()).filter(Boolean)

export const normDecls = (body: string): string =>
  body
    .split(';')
    .map((d) => d.trim())
    .filter(Boolean)
    .map((d) => d.replace(/\s+/g, ' '))
    .sort()
    .join(';')

export function depthOf(sel: string): number {
  let flat = sel
  for (let k = 0; k < 5; k++) {
    const next = flat.replace(/:where\(([^()]*)\)/g, '$1').replace(/:is\(([^()]*)\)/g, '$1')
    if (next === flat) break
    flat = next
  }
  let depth = 1
  let parens = 0, brackets = 0, prevWS = false
  for (let i = 0; i < flat.length; i++) {
    const c = flat[i]
    if (c === '(') parens++
    else if (c === ')') parens--
    else if (c === '[') brackets++
    else if (c === ']') brackets--
    else if (parens === 0 && brackets === 0) {
      if (c === '>' || c === '+' || c === '~') { depth++; prevWS = false }
      else if (c === ' ') {
        if (!prevWS) {
          const next = flat[i + 1], prev = flat[i - 1]
          if (next && prev && /[\w*[\]:.#-]/.test(prev) && /[\w*[\]:.#-]/.test(next)) depth++
        }
        prevWS = true
      } else prevWS = false
    } else prevWS = false
  }
  return depth
}

// ── duplicate 분석 ─────────────────────────────────────────────────────
export type Duplicate = { selector: string; sources: string[]; count: number }

export function findDuplicateSelectors(rules: Rule[]): Duplicate[] {
  const bucket = new Map<string, Rule[]>()
  for (const r of rules) {
    const key = normSelector(r.selector)
    const arr = bucket.get(key) ?? []
    arr.push(r)
    bucket.set(key, arr)
  }
  const out: Duplicate[] = []
  for (const [selector, rs] of bucket) {
    if (rs.length < 2) continue
    const sources = [...new Set(rs.map((r) => r.source ?? '<unknown>'))]
    // cross-source 중복만 보고. 같은 파일 내 의도적 분할은 노이즈.
    if (sources.length < 2 && rs.length <= 2) continue
    out.push({ selector, sources, count: rs.length })
  }
  return out.sort((a, b) => b.count - a.count)
}
