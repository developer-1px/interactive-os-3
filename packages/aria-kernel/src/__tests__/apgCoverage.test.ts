/**
 * APG ↔ axis chord coverage matrix — Issue #123 (EPIC #121).
 *
 * 비교 차원:
 *   APG: APG_KEYBOARD_SPEC[pattern].chord  (W3C/WAI-ARIA 정본)
 *   IMPL: 패턴이 advertise 하는 axis chord set  (구현 정본)
 *
 * 정규화:
 *   - chord alias 정규화 1회 적용 (Spacebar→Space, Control/Meta+X → $mod+X)
 *   - per-pattern allowlist 로 known 의도 확장은 ⚠️ 카운트에서 제외
 *   - apgWaive 로 focusTrap 같은 명령형 mechanic 은 ❌ 카운트에서 일시 면제
 *
 * Gap 분류:
 *   - apgGap  (APG − IMPL − waive): 누락 — 추가 구현 필요 (강한 신호)
 *   - implExtra (IMPL − APG − allow): 정합 외 chord — drift 신호
 *
 * 본 테스트는 정규화 + allowlist 후 매트릭스를 스냅샷 으로 drift 게이트.
 */

import { describe, expect, it } from 'vitest'
import { APG_KEYBOARD_SPEC } from '../spec/apgKeyboardSpec'
import { IMPL_CHORDS } from '../spec/implChords'
import { normalizeChordSet, normalizeChord } from '../spec/normalizeChord'
import {
  PATTERN_EXTRA_ALLOW,
  PATTERN_APG_WAIVE,
  UNIVERSAL_EXTRA,
} from '../spec/apgCoverageAllowlist'

const minus = (a: Set<string>, b: Set<string>): string[] =>
  [...a].filter((x) => !b.has(x)).sort()

type Row = {
  pattern: string
  apg: number
  impl: number
  apgGap: string[]
  implExtra: string[]
}

const buildMatrix = (): Row[] => {
  const universalExtra = new Set(UNIVERSAL_EXTRA.map(normalizeChord))
  return Object.keys(APG_KEYBOARD_SPEC).sort().map((pattern) => {
    const apg = normalizeChordSet(APG_KEYBOARD_SPEC[pattern].map((e) => e.chord))
    const impl = normalizeChordSet(IMPL_CHORDS[pattern]?.() ?? [])
    const allow = new Set([
      ...universalExtra,
      ...(PATTERN_EXTRA_ALLOW[pattern] ?? []).map(normalizeChord),
    ])
    const waive = new Set((PATTERN_APG_WAIVE[pattern] ?? []).map(normalizeChord))
    const apgGap = minus(apg, impl).filter((c) => !waive.has(c))
    const implExtra = minus(impl, apg).filter((c) => !allow.has(c))
    return { pattern, apg: apg.size, impl: impl.size, apgGap, implExtra }
  })
}

describe('APG ↔ axis chord coverage (Issue #123)', () => {
  it('every SPEC pattern has an IMPL_CHORDS routing entry', () => {
    const missing = Object.keys(APG_KEYBOARD_SPEC).filter((p) => !(p in IMPL_CHORDS))
    expect(missing).toEqual([])
  })

  it('coverage matrix matches snapshot (drift gate)', () => {
    const matrix = buildMatrix().map((r) => ({
      pattern: r.pattern,
      apgGap: r.apgGap,
      implExtra: r.implExtra,
    }))
    expect(matrix).toMatchSnapshot()
  })

  it('prints matrix summary', () => {
    const rows = buildMatrix()
    const summary = rows.map((r) => ({
      pattern: r.pattern,
      apg: r.apg,
      impl: r.impl,
      gap: r.apgGap.length,
      extra: r.implExtra.length,
    }))
    // eslint-disable-next-line no-console
    console.table(summary)
    expect(rows.length).toBe(Object.keys(APG_KEYBOARD_SPEC).length)
  })
})
