// ds raw-value 룰 — lint(디렉토리 스캐너)와 hook(Write/Edit 단일 파일)이 공유.
// 원칙: 모든 색·반경은 fn/palette·radius() 또는 var(--ds-*)를 거친다 (preset 스왑 안전성).

export const ALLOW_COMMENT = (line) => {
  const t = line.trim()
  return t.startsWith('//') || t.startsWith('*') || t.startsWith('/*')
}

// color-mix(in <space>, ...) 의 색공간 키워드는 함수 호출이 아님 — interpolation에서 제외
export const stripColorMixSpace = (line) =>
  line.replace(/color-mix\s*\(\s*in\s+(oklch|oklab|srgb|srgb-linear|lab|lch|hsl|xyz|xyz-d50|xyz-d65|display-p3)\b/gi, 'color-mix(in <space>')

export const rules = [
  {
    kind: 'hex',
    hint: '#hex 리터럴 금지 — var(--ds-*) 또는 fn/palette 경유',
    test: (line) => /#[0-9a-fA-F]{3,8}\b/.test(line),
  },
  {
    kind: 'raw-color',
    hint: 'raw 색 함수 금지 — fn/palette의 fg/accent/status/tint/mix/dim 사용',
    test: (line) => {
      const cleaned = stripColorMixSpace(line)
      return /\b(rgb|rgba|hsl|hsla|oklch|oklab)\s*\(/.test(cleaned)
    },
  },
  {
    kind: 'raw-mask',
    hint: 'raw mask/-webkit-mask 금지 — fn/icon의 icon(token, size) 또는 indicator(...) 사용 (icon square invariant)',
    test: (line) => /\b(-webkit-mask|mask)\s*:/.test(line) && !/mask-type|mask-mode|mask-repeat|mask-position|mask-size|mask-origin|mask-clip|mask-composite/.test(line),
  },
  {
    kind: 'radius-literal',
    hint: 'border-radius 리터럴 금지 — radius("sm"|"md"|"lg"|"pill") 사용',
    test: (line) => {
      const m = line.match(/border-radius\s*:\s*([^;${]+)/)
      if (!m) return false
      const val = m[1].trim()
      if (val === '0' || val === '0px') return false
      if (/^\d+%/.test(val)) return false
      if (/\$\{/.test(val)) return false
      if (/var\(/.test(val)) return false
      if (/^[123]px$/.test(val)) return false
      return /\d/.test(val)
    },
  },
]

// 단일 파일 텍스트를 라인 단위로 스캔. 블록 주석 안의 위반은 무시.
export function scanText(text) {
  const findings = []
  const lines = text.split('\n')
  let inBlock = false
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    if (inBlock) {
      if (/\*\//.test(line)) inBlock = false
      continue
    }
    if (/\/\*/.test(line) && !/\*\/.*$/.test(line)) { inBlock = true; continue }
    if (ALLOW_COMMENT(line)) continue
    for (const r of rules) {
      if (r.test(line)) {
        findings.push({ kind: r.kind, ln: i + 1, hint: r.hint, snippet: line.trim().slice(0, 100) })
      }
    }
  }
  return findings
}
