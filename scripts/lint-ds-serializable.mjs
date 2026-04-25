#!/usr/bin/env node
/**
 * lint-ds-serializable — definePage / NormalizedData 빌더 안의 직렬화 누수 감사.
 *
 * 원칙: definePage entities tree는 JSON으로 환원 가능해야 한다.
 *   - JSX 리터럴 (<Tag>, <>) 금지 — 데이터에 JSX 박지 마라
 *   - inline 화살표 함수 () => 금지 — 핸들러는 onEvent intent ID로 환원
 *   - cloneElement / Children.* 금지 (ds 외에서도)
 *
 * 대상: src/routes/** (ds/ 자체는 lint-ds-contracts 가 본다).
 * 트리거 파일: definePage 호출 또는 NormalizedData 반환 빌더를 포함하는 .tsx/.ts.
 *
 * WARN 모드: 위반을 보고하지만 exit 0. 새 위반 차단은 PreToolUse 훅이 담당.
 */
import { readdirSync, readFileSync, statSync } from 'node:fs'
import { join, relative } from 'node:path'

const ROOT = process.cwd()
const SRC = join(ROOT, 'src/routes')

const walk = (dir, out = []) => {
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    const p = join(dir, e.name)
    if (e.isDirectory()) walk(p, out)
    else if (/\.(tsx|ts)$/.test(e.name)) out.push(p)
  }
  return out
}

const isBuilderFile = (src) =>
  /\bdefinePage\s*\(/.test(src) ||
  /:\s*NormalizedData\b/.test(src) ||
  /\bentities\s*:\s*\{/.test(src)

const stripStringsAndComments = (src) =>
  src
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/\/\/[^\n]*/g, '')
    .replace(/`(?:\\.|[^`\\])*`/g, '``')
    .replace(/"(?:\\.|[^"\\])*"/g, '""')
    .replace(/'(?:\\.|[^'\\])*'/g, "''")

const findings = []

for (const file of walk(SRC)) {
  const raw = readFileSync(file, 'utf8')
  if (!isBuilderFile(raw)) continue
  const src = stripStringsAndComments(raw)
  const rel = relative(ROOT, file)
  const lines = src.split('\n')

  lines.forEach((line, i) => {
    const ln = i + 1

    // (1) entity data 안 JSX literal: content: <... 또는 content: <>
    if (/\b(content|children|label|title|body|text|meta|footer|extra|actions)\s*:\s*<\s*[A-Za-z>]/.test(line)) {
      findings.push(`🟡 ${rel}:${ln} — JSX literal in entity data (직렬화 불가, content 등은 string|구조화 객체)`)
    }

    // (2) inline 화살표 함수 — entity data props 안 핸들러
    //    onClick: () => / onChange: (e) => / onSort: (...) =>
    if (/\b(onClick|onChange|onInput|onSelect|onSort|onSubmit|onKeyDown|onKeyUp|onFocus|onBlur)\s*:\s*(?:\([^)]*\)|\w+)\s*=>/.test(line)) {
      findings.push(`🟡 ${rel}:${ln} — inline closure in entity data (onEvent intent ID로 환원하라)`)
    }

    // (3) JSX in props payload: props: { ..., content: <... }
    if (/\bprops\s*:\s*\{[^}]*<[A-Za-z]/.test(line)) {
      findings.push(`🟡 ${rel}:${ln} — JSX in props payload (component=Ui props는 직렬화 가능 해야)`)
    }

    // (4) cloneElement / Children.*
    if (/\bcloneElement\b/.test(line)) {
      findings.push(`🔴 ${rel}:${ln} — cloneElement (children 변형 금지)`)
    }
    if (/\bChildren\.(map|toArray|forEach|count|only)\b/.test(line)) {
      findings.push(`🔴 ${rel}:${ln} — Children.* 사용 (children 변형 금지)`)
    }
  })
}

if (findings.length > 0) {
  console.log(findings.join('\n'))
  console.log('')
}
const red = findings.filter((f) => f.startsWith('🔴')).length
const yellow = findings.length - red
console.log(`ds-serializable: ${red} hatch, ${yellow} drift`)
// WARN-only 모드: 새 위반 차단은 PreToolUse 훅에서.
process.exit(0)
