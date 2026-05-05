/**
 * 정적 가드 — patterns/ 안 imperative 키 처리 잔재 0건 invariant.
 *
 * PRD #20 의 결과를 구조적으로 보존: declarative SSOT (axis · KeyMap · primitive)
 * 외부에서 raw `addEventListener('keydown')` · `matchKey` · `e.key === ...` 가
 * 재발하면 이 테스트가 실패한다.
 *
 * 허용 예외:
 * - focusTrap.ts — focus management primitive (자기 카테고리에서 keydown 직접 처리)
 *   axes/ · key/ · gesture/ 와 동급의 SSOT 메커니즘 본체
 */
// @ts-nocheck
import { describe, expect, it } from 'vitest'
import { readdirSync, readFileSync, statSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const PATTERNS_DIR = dirname(fileURLToPath(import.meta.url))

const EXEMPT_FILES = new Set([
  'focusTrap.ts',          // primitive 본체 — 자기 SSOT 메커니즘
])

const PATTERN_FILES = readdirSync(PATTERNS_DIR)
  .filter((f) => f.endsWith('.ts') || f.endsWith('.tsx'))
  .filter((f) => !f.includes('.test.'))
  .filter((f) => !EXEMPT_FILES.has(f))

const RESIDUE_PATTERNS: { name: string; regex: RegExp }[] = [
  { name: 'raw addEventListener("keydown")', regex: /addEventListener\(\s*['"]key(down|up|press)['"]/ },
  { name: 'matchKey direct call', regex: /\bmatchKey\s*\(/ },
  { name: 'raw e.key === comparison', regex: /\b\w+\.key\s*===/ },
]

describe('patterns/ keymap declarative SSOT invariant', () => {
  for (const file of PATTERN_FILES) {
    const path = join(PATTERNS_DIR, file)
    if (!statSync(path).isFile()) continue
    const src = readFileSync(path, 'utf8')
    for (const { name, regex } of RESIDUE_PATTERNS) {
      it(`${file} has no ${name}`, () => {
        const matches = src.split('\n')
          .map((line, i) => ({ line, n: i + 1 }))
          .filter(({ line }) => regex.test(line) && !line.trim().startsWith('//') && !line.trim().startsWith('*'))
        expect(matches).toEqual([])
      })
    }
  }
})
