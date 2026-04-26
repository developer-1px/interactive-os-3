#!/usr/bin/env node
/**
 * PreToolUse guard — Write/Edit 직전 변경 파일에 직렬화 누수가 있으면 차단.
 *
 * 차단 대상 파일: src/routes/** + src/ds/ui/7-pattern/**
 * 새로 들어가는 위반만 막기는 어렵기에, 변경 후 콘텐츠가 정한 패턴을 포함하면 차단.
 * 기존 빨간 파일에는 적용하지 않기 위해 changed-only / 신규 파일만 검사한다.
 *
 * stdin: { tool_input: { file_path, content?, new_string? }, ... }
 * stdout: 차단 사유 (exit 2 시 차단)
 */
import { readFileSync, existsSync } from 'node:fs'

let payload = ''
process.stdin.on('data', (c) => { payload += c })
process.stdin.on('end', () => {
  let input
  try { input = JSON.parse(payload) } catch { process.exit(0) }
  const ti = input?.tool_input ?? {}
  const file = ti.file_path
  if (!file || !/\.(tsx|ts)$/.test(file)) process.exit(0)
  if (!/\/(src\/routes\/|src\/ds\/ui\/entity\/)/.test(file)) process.exit(0)

  // 새 콘텐츠 — Write 의 content 또는 Edit 의 new_string
  const next = ti.content ?? ti.new_string ?? ''
  if (!next) process.exit(0)

  // 기존 파일이 이미 같은 위반을 가지고 있으면 회귀 아님 (기존 위반 보존)
  const prev = existsSync(file) ? readFileSync(file, 'utf8') : ''

  const violations = []
  const checks = [
    [/\bcloneElement\b/, 'cloneElement (children 변형 금지)'],
    [/\bChildren\.(map|toArray|forEach|count|only)\b/, 'Children.* (children 변형 금지)'],
    [/\b(content|body|text|label|title|meta|footer|extra|actions)\s*:\s*<\s*[A-Za-z>]/, 'JSX literal in entity data'],
    [/\b(onClick|onChange|onInput|onSelect|onSort|onSubmit|onKeyDown|onKeyUp|onFocus|onBlur)\s*:\s*(?:\([^)]*\)|\w+)\s*=>/, 'inline closure in entity data (onEvent intent ID로 환원)'],
    [/\bprops\s*:\s*\{[^}]*<[A-Za-z]/, 'JSX in props payload'],
  ]
  for (const [re, msg] of checks) {
    const inNext = re.test(next)
    const inPrev = re.test(prev)
    if (inNext && !inPrev) violations.push(msg)
  }

  // 규칙: src/routes/** 페이지는 definePage + Renderer 선언형으로 일원화한다.
  // raw <main>/<section aria-roledescription>로 페이지 레이아웃을 직접 조립하면 차단.
  // 하위 widget 파일(Sidebar/Columns/Preview 등)은 <main>을 쓰지 않으므로 제외된다.
  if (/\/src\/routes\//.test(file)) {
    const rawShellRe = /<main\b/
    const hasDefinePage = /\bdefinePage\s*\(/
    const nextHasShell = rawShellRe.test(next)
    const prevHasShell = rawShellRe.test(prev)
    const nextHasDefinePage = hasDefinePage.test(next)
    if (nextHasShell && !nextHasDefinePage && !(prevHasShell && !hasDefinePage.test(prev))) {
      violations.push(
        'src/routes 페이지는 definePage(entities tree) + Renderer 선언형이 canonical — raw <main>/JSX 조립 금지. ' +
        '예) export function Page() { return <Renderer page={definePage({ ... })} /> }'
      )
    }
  }

  if (violations.length > 0) {
    console.error('🔴 직렬화 원칙 위반 (직렬화 가능한 선언적 코드):')
    for (const v of violations) console.error(`   - ${v}`)
    console.error('가이드: 핸들러는 onEvent intent ID, 콘텐츠는 string|구조화 객체로. /antipattern 참고.')
    process.exit(2)
  }
  process.exit(0)
})
