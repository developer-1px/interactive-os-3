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
    kind: 'non-semantic-color',
    level: 'warn',
    hint: 'non-semantic 색 토큰 — role 기반 semantic 사용 (text/surface/border/accent/status…). 같은 수치라도 의미 다르면 별 role 로 등재. neutral/tint/mix/dim 은 preset·foundations 내부 전용',
    test: (line) => /(?<![\w-])(neutral|tint|mix|dim)\s*\(/.test(line) && !/^\s*(import|export)\b/.test(line),
  },
  {
    kind: 'raw-palette-var',
    level: 'error',
    hint: 'raw palette CSS var 직접 참조 금지 — var(--ds-neutral-N · --ds-tone-* · --ds-step-scale 등) 은 L0 raw scale. semantic 토큰(text/surface/accent…) 또는 fn 사용',
    test: (line) =>
      /var\(\s*--ds-(neutral-[0-9]|tone(?:-hue|-chroma|-tint)?|step-scale|hue|density|depth)\b/.test(line),
  },
  {
    kind: 'hex',
    level: 'error',
    hint: '#hex 리터럴 금지 — var(--ds-*) 또는 fn/palette 경유',
    test: (line) => /#[0-9a-fA-F]{3,8}\b/.test(line),
  },
  {
    kind: 'raw-color',
    level: 'error',
    hint: 'raw 색 함수 금지 — fn/palette의 fg/accent/status/tint/mix/dim 사용',
    test: (line) => {
      const cleaned = stripColorMixSpace(line)
      return /\b(rgb|rgba|hsl|hsla|oklch|oklab)\s*\(/.test(cleaned)
    },
  },
  {
    kind: 'raw-mask',
    level: 'warn',
    hint: 'raw mask/-webkit-mask — fn/icon의 icon(token, size) 또는 indicator(...) 사용 (icon square invariant)',
    test: (line) => /\b(-webkit-mask|mask)\s*:/.test(line) && !/mask-type|mask-mode|mask-repeat|mask-position|mask-size|mask-origin|mask-clip|mask-composite/.test(line),
  },
  {
    kind: 'radius-literal',
    level: 'warn',
    hint: 'border-radius 리터럴 — radius("sm"|"md"|"lg"|"pill") 사용. 같은 수치라도 의미 다르면 별 role 토큰으로 등재 (50%·999px·9999px 모두 pill 로 통일)',
    test: (line) => {
      const m = line.match(/border-radius\s*:\s*([^;${]+)/)
      if (!m) return false
      const val = m[1].trim()
      if (val === '0' || val === '0px') return false
      if (/\$\{/.test(val)) return false
      if (/var\(/.test(val)) return false
      if (/^[123]px$/.test(val)) return false
      return /\d/.test(val)
    },
  },
  {
    kind: 'font-weight-literal',
    level: 'warn',
    hint: 'font-weight 숫자 리터럴 — weight("regular"|"medium"|"semibold"|"bold"|"extrabold") 사용. 같은 수치라도 의미 다르면 별 role 토큰으로 등재',
    test: (line) => {
      const m = line.match(/font-weight\s*:\s*([^;${]+)/)
      if (!m) return false
      const val = m[1].trim()
      if (/\$\{/.test(val)) return false
      if (/var\(/.test(val)) return false
      if (/^(inherit|normal|bold|lighter|bolder)$/.test(val)) return false
      return /\d/.test(val)
    },
  },
  {
    kind: 'typography-scale',
    level: 'warn',
    hint: 'font(scale)·weight(scale) 직접 호출 — t-shirt 스케일은 이름만 semantic. role 어휘 (type.label · type.amount · type.period 등) 사용. 새 role 필요하면 foundations/typography/role.ts 에 등재',
    test: (line) => {
      // import/export 라인은 이름만 등장하는 거라 무시
      if (/^\s*(import|export)\b/.test(line)) return false
      // ${font('xl')} or ${weight('semibold')} 형태 — 실제 호출만 잡고 type.* 정의 라인은 제외 (foundations 정의는 SKIP_PATHS 로 격리됨)
      return /(?<![\w.])font\s*\(\s*['"](?:xs|sm|md|lg|xl|2xl)['"]\s*\)/.test(line) ||
             /(?<![\w.])weight\s*\(\s*['"](?:regular|medium|semibold|bold|extrabold)['"]\s*\)/.test(line)
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
        findings.push({ kind: r.kind, level: r.level ?? 'error', ln: i + 1, hint: r.hint, snippet: line.trim().slice(0, 100) })
      }
    }
  }
  return findings
}
