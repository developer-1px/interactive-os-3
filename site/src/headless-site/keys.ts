/**
 * SSoT keyboard-key derivation utilities.
 *
 * `probe(axis)` 가 axis 에 합성 KeyTrigger 를 던져 응답 키를 자동 수집한다.
 * axis 가 SSoT — 키 변경하면 칩이 자동 갱신.
 *
 * 패턴 별 사용은 각 demo 의 `meta.keys` 함수가 owns (co-location). 이 파일은
 * 도구만 제공한다.
 */
import { ROOT, type Axis, type NormalizedData } from '@p/headless'

const PROBE_KEYS = [
  'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight',
  'Home', 'End', 'PageUp', 'PageDown',
  'Enter', ' ', 'Escape', 'Tab',
  // single printable char — typeahead axis 가 응답하면 'A–Z' 로 glyph.
  'a',
]

const dummy: NormalizedData = {
  entities: {
    [ROOT]: { id: ROOT },
    a: { id: 'a', data: { label: 'a', value: 50, min: 0, max: 100, step: 5 } },
    b: { id: 'b', data: { label: 'b' } },
    c: { id: 'c', data: { label: 'c', children: ['d'] } },
    d: { id: 'd', data: { label: 'd' } },
  },
  relationships: { [ROOT]: ['a', 'b', 'c'], c: ['d'] },
}

export function probe(axis: Axis): string[] {
  const out: string[] = []
  for (const key of PROBE_KEYS) {
    try {
      const r = axis(dummy, 'a', { kind: 'key', key })
      if (Array.isArray(r) && r.length > 0) out.push(key)
    } catch {
      /* axis threw — treat as no-response */
    }
  }
  return out
}

const KEY_GLYPH: Record<string, string> = {
  ' ': 'Space',
  ArrowUp: '↑',
  ArrowDown: '↓',
  ArrowLeft: '←',
  ArrowRight: '→',
  Escape: 'Esc',
  a: 'A–Z',
}

export const fmtKey = (k: string) => KEY_GLYPH[k] ?? k

export const dedupe = <T>(xs: T[]) => Array.from(new Set(xs))
