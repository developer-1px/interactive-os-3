// @ts-nocheck
import { describe, it, expect } from 'vitest'
import { readdirSync, readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

/**
 * Phase 10 invariant — patterns/*.ts must contain 0 KeyChord object literals.
 * All chord registries declare tinykeys strings ("Enter", "Shift+Tab", "Click").
 */
describe('KeyChord literal 0 invariant (PRD #38 phase 10)', () => {
  it('no `{ key: KEYS.X }` literal in src/patterns/*.ts', () => {
    const dir = dirname(fileURLToPath(import.meta.url))
    const files = readdirSync(dir).filter(
      (f: string) => f.endsWith('.ts') && !f.endsWith('.test.ts') && !f.endsWith('.test.tsx'),
    )
    const offenders: string[] = []
    for (const f of files) {
      const src = readFileSync(join(dir, f), 'utf8')
      const matches = src.match(/\{\s*key:\s*KEYS\./g)
      if (matches) offenders.push(`${f} (${matches.length})`)
    }
    expect(offenders).toEqual([])
  })
})
