#!/usr/bin/env node
/**
 * audit-axis-completeness — EPIC #95 Layer 3
 *
 * 한 번 실행으로 axis-completeness invariant 의 모든 위반을 표면화. 종료 oracle:
 * exit 0 = 위반 0 (수렴). exit 1 = 위반 N개 (다음 iteration 필요).
 *
 * 검사:
 *  1. apps/site/src/demos -- escape hatch (skipKeys/skipFor.../noopIn...) 부재
 *  2. packages/headless/src/axes/emits.ts subset of packages/headless/src/state/handles.ts
 *     (REDUCE_PRESETS 합집합 cover)
 *
 * 사용:
 *   node scripts/auditAxisCompleteness.mjs        # 콘솔 리포트
 *   node scripts/auditAxisCompleteness.mjs --json # JSON
 */
import { readFileSync, readdirSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.resolve(__dirname, '..')

// ───── Check 1: demo test escape hatches ─────
const demosDir = path.join(root, 'apps/site/src/demos')
const testFiles = readdirSync(demosDir)
  .filter((f) => f.endsWith('.test.tsx') && !f.startsWith('_'))

const ESCAPE_HATCH_PAT = /\b(skipKeys|skipFor[A-Za-z]+|noopIn[A-Za-z]+|skipList)\b/

const escapeHatchViolations = []
for (const f of testFiles) {
  const lines = readFileSync(path.join(demosDir, f), 'utf8').split('\n')
  lines.forEach((line, i) => {
    if (line.trim().startsWith('//') || line.trim().startsWith('*')) return
    if (ESCAPE_HATCH_PAT.test(line)) {
      escapeHatchViolations.push({ file: f, line: i + 1, content: line.trim() })
    }
  })
}

// ───── Check 2: axis emits ⊆ reducer handles ─────
// emits.ts / handles.ts 에서 정적 카탈로그 추출 (간단한 파싱).
const emitsFile = readFileSync(
  path.join(root, 'packages/headless/src/axes/emits.ts'), 'utf8',
)
const handlesFile = readFileSync(
  path.join(root, 'packages/headless/src/state/handles.ts'), 'utf8',
)

const extractList = (src, varName) => {
  const re = new RegExp(`${varName}[^=]*=\\s*\\[([^\\]]*)\\]`, 's')
  const m = src.match(re)
  if (!m) return []
  return [...m[1].matchAll(/'([a-zA-Z]+)'/g)].map((mm) => mm[1])
}

const allAxisEmits = {}
const axisVars = [
  'activateEmits', 'escapeEmits', 'navigateEmits', 'typeaheadEmits',
  'multiSelectEmits', 'numericStepEmits', 'gridNavigateEmits', 'submenuEmits',
  'toggleEmits', 'treeExpandEmits', 'treeNavigateEmits', 'pageNavigateEmits',
  'expandEmits', 'selectEmits', 'gridMultiSelectEmits',
]
for (const v of axisVars) {
  allAxisEmits[v.replace('Emits', '')] = extractList(emitsFile, v)
}

const handleVars = [
  'reduceHandles', 'singleSelectHandles', 'singleCurrentHandles',
  'multiSelectToggleHandles', 'checkToggleHandles', 'singleCheckHandles', 'setValueHandles',
]
const allHandles = new Set()
for (const v of handleVars) {
  for (const t of extractList(handlesFile, v)) allHandles.add(t)
}

const axisCoverageViolations = []
for (const [axisName, emits] of Object.entries(allAxisEmits)) {
  for (const t of emits) {
    if (!allHandles.has(t)) {
      axisCoverageViolations.push({ axis: axisName, type: t })
    }
  }
}

// ───── Output ─────
const report = {
  escapeHatchViolations,
  axisCoverageViolations,
  total: escapeHatchViolations.length + axisCoverageViolations.length,
}

const argv = process.argv.slice(2)
if (argv.includes('--json')) {
  process.stdout.write(JSON.stringify(report, null, 2) + '\n')
} else {
  if (report.total === 0) {
    process.stdout.write('✅ axis-completeness — 0 violations (converged)\n')
  } else {
    process.stdout.write(`❌ axis-completeness — ${report.total} violation(s)\n\n`)
    if (escapeHatchViolations.length > 0) {
      process.stdout.write(`◇ escape hatch in demo tests (${escapeHatchViolations.length}):\n`)
      for (const v of escapeHatchViolations) {
        process.stdout.write(`  ${v.file}:${v.line}  ${v.content}\n`)
      }
      process.stdout.write('\n')
    }
    if (axisCoverageViolations.length > 0) {
      process.stdout.write(`◇ axis emit not handled by any reducer preset (${axisCoverageViolations.length}):\n`)
      for (const v of axisCoverageViolations) {
        process.stdout.write(`  ${v.axis} → '${v.type}'\n`)
      }
      process.stdout.write('\n')
    }
    process.stdout.write('Next iteration: fix one violation, re-run audit.\n')
  }
}

process.exit(report.total === 0 ? 0 : 1)
