#!/usr/bin/env node
/**
 * PreToolUse guard — Write/Edit 직전 변경 콘텐츠가 ds raw-value 룰을 위반하면 차단.
 *
 * 차단 범위 (lint-ds-values와 동일):
 *  - src/ds/style/widgets/**, src/ds/style/shell/**, src/ds/style/states.ts
 * 제외:
 *  - src/ds/fn/**, src/ds/style/preset/** (토큰 정의 소스)
 *
 * 룰: scripts/lib/ds-value-rules.mjs (hex / raw-color / raw-mask / radius-literal)
 *
 * 회귀 보호: prev에 이미 있던 위반은 통과 (기존 빨간 줄 보존, 새로 들어가는 위반만 차단).
 *
 * stdin: { tool_input: { file_path, content?, new_string? }, ... }
 * stdout: 차단 사유 (exit 2 시 차단)
 */
import { readFileSync, existsSync } from 'node:fs'
import { scanText } from '../lib/ds-value-rules.mjs'

const SCAN_RE = /\/src\/ds\/style\/(widgets|shell)\/|\/src\/ds\/style\/states\.ts$/
const SKIP_RE = /\/src\/ds\/fn\/|\/src\/ds\/style\/preset\//

let payload = ''
process.stdin.on('data', (c) => { payload += c })
process.stdin.on('end', () => {
  let input
  try { input = JSON.parse(payload) } catch { process.exit(0) }
  const ti = input?.tool_input ?? {}
  const file = ti.file_path
  if (!file || !/\.(tsx|ts)$/.test(file)) process.exit(0)
  if (SKIP_RE.test(file)) process.exit(0)
  if (!SCAN_RE.test(file)) process.exit(0)

  const next = ti.content ?? ti.new_string ?? ''
  if (!next) process.exit(0)

  const prev = existsSync(file) ? readFileSync(file, 'utf8') : ''

  // Edit는 new_string만 들어오므로 단편을 단독 스캔하면 false positive 가능.
  // 안전하게: prev 전체 + next 단편을 합친 "예상 결과"가 아닌, 단편 자체에서 발견된 위반 중
  //   prev에 같은 패턴이 한 번이라도 있으면 회귀 아님으로 판정.
  const nextFindings = scanText(next)
  if (nextFindings.length === 0) process.exit(0)

  const prevFindings = scanText(prev)
  const prevKinds = new Set(prevFindings.map((f) => `${f.kind}::${f.snippet}`))

  const regressions = nextFindings.filter((f) => !prevKinds.has(`${f.kind}::${f.snippet}`))
  if (regressions.length === 0) process.exit(0)

  console.error('🔴 ds raw-value 룰 위반 (Stylelint ⑤ 강제 도구 계층):')
  for (const f of regressions) {
    console.error(`   - [${f.kind}] ${f.hint}`)
    console.error(`     ↳ ${f.snippet}`)
  }
  console.error('가이드: var(--ds-*), fn/palette(fg/accent/status/tint/mix/dim), radius(...) 사용. ' +
    '룰: scripts/lib/ds-value-rules.mjs')
  process.exit(2)
})
