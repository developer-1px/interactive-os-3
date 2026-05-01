#!/usr/bin/env node
// nested-only invariant lint
//
// Invariant:
//   *.style.ts 의 각 css`...` 템플릿은 top-level rule 1개만 가진다.
//   나머지는 `&` 로 nested 되어야 컴포넌트 lifecycle 에 묶이고
//   dead-selector / cross-component 추적이 가능해진다.
//
// Mode: soft-launch + baseline.
//   현재 위반 = baseline 등록분만 통과. 신규 위반 = exit 1.
//   `--update-baseline` 플래그로 baseline 재생성.
import { readdirSync, readFileSync, writeFileSync, existsSync } from 'node:fs'
import { join, relative } from 'node:path'

const ROOT = new URL('..', import.meta.url).pathname
const BASELINE = join(ROOT, 'scripts/lint-ds-nested-only.baseline.json')
const SCAN_DIR = join(ROOT, 'packages/ds/src')

function* walk(p) {
  for (const e of readdirSync(p, { withFileTypes: true })) {
    const next = join(p, e.name)
    if (e.isDirectory()) yield* walk(next)
    else if (e.isFile() && /\.style\.ts$/.test(e.name)) yield next
  }
}

function lineOf(text, index) {
  let n = 1
  for (let i = 0; i < index; i++) if (text.charCodeAt(i) === 10) n++
  return n
}

// Strip /* */ block comments and ${...} interpolations (with brace balancing).
function stripCss(src) {
  let out = ''
  let i = 0
  while (i < src.length) {
    if (src[i] === '/' && src[i + 1] === '*') {
      const end = src.indexOf('*/', i + 2)
      i = end < 0 ? src.length : end + 2
      continue
    }
    if (src[i] === '$' && src[i + 1] === '{') {
      let depth = 1
      i += 2
      while (i < src.length && depth > 0) {
        if (src[i] === '{') depth++
        else if (src[i] === '}') depth--
        i++
      }
      out += '_'
      continue
    }
    out += src[i++]
  }
  return out
}

// Find each css`...` template. Returns [{ inner, start }] where start = offset of inner in original file.
function findCssTemplates(text) {
  const results = []
  const re = /\bcss\s*`/g
  let m
  while ((m = re.exec(text))) {
    const start = m.index + m[0].length
    let i = start
    while (i < text.length) {
      const c = text[i]
      if (c === '\\') { i += 2; continue }
      if (c === '`') break
      if (c === '$' && text[i + 1] === '{') {
        let depth = 1
        i += 2
        while (i < text.length && depth > 0) {
          if (text[i] === '{') depth++
          else if (text[i] === '}') depth--
          i++
        }
        continue
      }
      i++
    }
    results.push({ inner: text.slice(start, i), start })
  }
  return results
}

// Count top-level rule blocks. Returns array of { offset } for each top-level `{`.
function topLevelOpens(stripped) {
  const opens = []
  let depth = 0
  for (let i = 0; i < stripped.length; i++) {
    const c = stripped[i]
    if (c === '{') {
      if (depth === 0) opens.push(i)
      depth++
    } else if (c === '}') {
      depth--
    }
  }
  return opens
}

function scanFile(file, rel) {
  const text = readFileSync(file, 'utf8')
  const findings = []
  for (const tpl of findCssTemplates(text)) {
    const stripped = stripCss(tpl.inner)
    const opens = topLevelOpens(stripped)
    if (opens.length <= 1) continue
    // Report each excess top-level brace beyond the first.
    for (let k = 1; k < opens.length; k++) {
      // Translate stripped offset back to original file offset (approximate — stripping replaces
      // ${...} with `_` and removes /**/, both monotonic so absolute line is close enough).
      // For accuracy, walk original tpl.inner with same logic to map.
      const origOffset = mapOffset(tpl.inner, opens[k])
      findings.push({
        file: rel,
        line: lineOf(text, tpl.start + origOffset),
      })
    }
  }
  return findings
}

// Map a stripped-offset back to original-offset by replaying the same skip logic.
function mapOffset(src, strippedTarget) {
  let i = 0
  let s = 0
  while (i < src.length && s < strippedTarget) {
    if (src[i] === '/' && src[i + 1] === '*') {
      const end = src.indexOf('*/', i + 2)
      i = end < 0 ? src.length : end + 2
      continue
    }
    if (src[i] === '$' && src[i + 1] === '{') {
      let depth = 1
      i += 2
      while (i < src.length && depth > 0) {
        if (src[i] === '{') depth++
        else if (src[i] === '}') depth--
        i++
      }
      s++
      continue
    }
    i++
    s++
  }
  return i
}

const all = []
for (const file of walk(SCAN_DIR)) {
  const rel = relative(ROOT, file)
  all.push(...scanFile(file, rel))
}

// Signature is per-file (not per-line) — multiple violations in one file collapse to 1 entry.
const sigOf = (f) => f.file
const sigs = [...new Set(all.map(sigOf))].sort()

if (process.argv.includes('--update-baseline')) {
  writeFileSync(BASELINE, JSON.stringify({ files: sigs }, null, 2) + '\n')
  console.log(`baseline updated — ${sigs.length} file(s)`)
  process.exit(0)
}

const baseline = existsSync(BASELINE)
  ? new Set((JSON.parse(readFileSync(BASELINE, 'utf8')).files || []))
  : new Set()

const novel = all.filter((f) => !baseline.has(sigOf(f)))

if (novel.length === 0) {
  const skipped = all.length - novel.length
  console.log(`nested-only: ok${skipped ? ` (baseline allowed ${skipped} pre-existing)` : ''}`)
  process.exit(0)
}

console.error('nested-only: NEW violations\n')
for (const f of novel) {
  console.error(`  ${f.file}:${f.line}  — extra top-level rule (must nest with &)`)
}
console.error(`\n${novel.length} new violation(s). Wrap siblings under one root with & nesting,`)
console.error('or run `node scripts/lint-ds-nested-only.mjs --update-baseline` to accept (discouraged).')
process.exit(1)
