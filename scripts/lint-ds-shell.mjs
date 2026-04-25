#!/usr/bin/env node
// ds shell-mode 분리 린트 — "viewport는 L0가 한 번만 본다" invariant.
//
// 룰:
//   R1. 라우트 코드(src/routes/**)에서 window.matchMedia 직접 호출 금지.
//        → useShellMode/<ShellSwitch>로 강제.
//   R2. ds widget CSS(src/ds/ui/**)에서 viewport @media (... -width:) 사용 금지.
//        → 컨텐츠 reflow는 @container 만 허용.
//   R3. shell CSS(src/ds/style/**, src/routes/**)에서 max-width/min-width 리터럴 폭
//        @media를 쓸 때 var(--ds-shell-mobile-max) 아닌 숫자 리터럴 금지.
import { readdirSync, readFileSync, statSync } from 'node:fs'
import { join, relative } from 'node:path'

const ROOT = new URL('..', import.meta.url).pathname

function walk(dir, out = []) {
  for (const e of readdirSync(dir)) {
    const p = join(dir, e)
    const s = statSync(p)
    if (s.isDirectory()) walk(p, out)
    else out.push(p)
  }
  return out
}

function isCode(p) { return /\.(ts|tsx|mjs|cjs|js|jsx)$/.test(p) }

const violations = []

// R1 — routes에서 window.matchMedia 금지.
// 문자열/백틱/주석 내부 언급은 제외 (문서/blurb는 위반 아님).
const isInStringOrComment = (ln, idx) => {
  const before = ln.slice(0, idx)
  // // line comment
  if (/(^|\s)\/\//.test(before) && !/['"`]/.test(before.split(/\/\//).pop() ?? '')) return true
  // 따옴표/백틱 카운트가 홀수면 string 내부
  const quoteCount = (before.match(/(?<!\\)['"`]/g) ?? []).length
  return quoteCount % 2 === 1
}
for (const f of walk(join(ROOT, 'src/routes')).filter(isCode)) {
  const src = readFileSync(f, 'utf8')
  const lines = src.split('\n')
  lines.forEach((ln, i) => {
    const m = /\b(?:window\.)?matchMedia\(/.exec(ln)
    if (!m) return
    if (isInStringOrComment(ln, m.index)) return
    violations.push({ rule: 'R1', file: relative(ROOT, f), line: i + 1, msg: 'window.matchMedia 직접 호출 — useShellMode/<ShellSwitch> 사용', text: ln.trim() })
  })
}

// R2 — ds/ui에서 viewport @media (max|min-width) 금지
const dsUiFiles = walk(join(ROOT, 'src/ds/ui')).filter(isCode)
for (const f of dsUiFiles) {
  const src = readFileSync(f, 'utf8')
  const lines = src.split('\n')
  lines.forEach((ln, i) => {
    if (/@media\s*\([^)]*\b(?:max|min)-width\b/.test(ln)) {
      violations.push({ rule: 'R2', file: relative(ROOT, f), line: i + 1, msg: 'ds widget에 viewport @media — @container 사용', text: ln.trim() })
    }
  })
}

// R3 — shell CSS에서 폭 리터럴 @media 사용 시 토큰 강제 (단순 휴리스틱)
const shellFiles = [
  ...walk(join(ROOT, 'src/ds/style')).filter(isCode),
]
for (const f of shellFiles) {
  const src = readFileSync(f, 'utf8')
  const lines = src.split('\n')
  lines.forEach((ln, i) => {
    const m = ln.match(/@media\s*\(\s*(?:max|min)-width\s*:\s*(\d+(?:\.\d+)?)(px|rem|em)/)
    if (m) {
      violations.push({ rule: 'R3', file: relative(ROOT, f), line: i + 1, msg: `shell @media에 폭 리터럴 ${m[1]}${m[2]} — var(--ds-shell-mobile-max) 사용`, text: ln.trim() })
    }
  })
}

if (violations.length === 0) {
  console.log('✅ ds-shell: viewport 단일 출처 invariant OK')
  process.exit(0)
}

console.log(`❌ ds-shell: ${violations.length}개 위반`)
for (const v of violations) {
  console.log(`  [${v.rule}] ${v.file}:${v.line}  ${v.msg}`)
  console.log(`         ${v.text}`)
}
process.exit(1)
