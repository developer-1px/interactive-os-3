#!/usr/bin/env node
// ds 위반 린트 — 앱 코드에서 escape hatch / classless 위반 / inline-style 스캔.
// 제외: src/ds/ (생성 규약), src/controls/ (ds 부품 정의 자체).
import { readdirSync, readFileSync, statSync } from 'node:fs'
import { join, relative } from 'node:path'

const ROOT = new URL('..', import.meta.url).pathname
const SRC = join(ROOT, 'src')
const SKIP_DIRS = new Set(['ds', 'controls', 'node_modules', 'dist', '.claude'])

// 심각도 정의 — 위에서부터 먼저 매칭
const rules = [
  { level: '🔴', kind: 'Hatch ',
    test: (line) => {
      // role="..." — 단, aria-roledescription 은 제외
      if (/aria-roledescription\s*=/.test(line)) return false
      return /(^|[\s{(])role\s*=\s*["']/.test(line)
    },
    hint: 'raw role= (ds role 신설로 대체)' },
  { level: '🔴', kind: 'Hatch ',
    test: (line) => /className\s*=/.test(line),
    hint: 'className= (classless 위반)' },
  { level: '🟡', kind: 'Inline',
    test: (line) => /\bstyle\s*=\s*\{\s*\{/.test(line),
    hint: 'inline style (토큰/ds.css로 이동 후보)' },
  { level: '🟢', kind: 'Local ',
    test: (line) => /aria-roledescription\s*=\s*["']/.test(line),
    hint: '앱-로컬 role (누적 시 ds role 승격 후보)' },
]

function* walk(dir) {
  for (const name of readdirSync(dir)) {
    if (SKIP_DIRS.has(name)) continue
    const p = join(dir, name)
    const s = statSync(p)
    if (s.isDirectory()) yield* walk(p)
    else if (/\.(tsx|ts)$/.test(name)) yield p
  }
}

const findings = []
const counts = { '🔴': 0, '🟡': 0, '🟢': 0 }

for (const file of walk(SRC)) {
  const text = readFileSync(file, 'utf8')
  const lines = text.split('\n')
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    const trimmed = line.trim()
    if (trimmed.startsWith('//') || trimmed.startsWith('*')) continue
    for (const r of rules) {
      if (r.test(line)) {
        findings.push({ level: r.level, kind: r.kind, file, ln: i + 1, hint: r.hint, snippet: trimmed.slice(0, 80) })
        counts[r.level]++
        break
      }
    }
  }
}

// 심각도 내림차순 → 파일:라인
const order = { '🔴': 0, '🟡': 1, '🟢': 2 }
findings.sort((a, b) => order[a.level] - order[b.level] || a.file.localeCompare(b.file) || a.ln - b.ln)

for (const f of findings) {
  const loc = `${relative(ROOT, f.file)}:${f.ln}`.padEnd(42)
  console.log(`${f.level} ${f.kind}  ${loc}  ${f.hint}`)
  console.log(`                                            ${f.snippet}`)
}

console.log()
console.log(`요약 — 🔴 Hatch: ${counts['🔴']}  🟡 Inline: ${counts['🟡']}  🟢 Local: ${counts['🟢']}  (총 ${findings.length})`)

process.exit(counts['🔴'] > 0 ? 1 : 0)
