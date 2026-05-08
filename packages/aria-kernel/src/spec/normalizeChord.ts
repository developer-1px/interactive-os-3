/**
 * normalizeChord — chord 문자열 alias 정규화.
 *
 * APG 정본 ↔ axis spec ↔ demo meta.keys 비교에서 의미 같은 alias 가 다른 row 로 깨지는
 * 것을 방지한다 (issue #123 follow-up).
 *
 * 정규화 규칙:
 *   - 'Spacebar' / ' ' → 'Space'
 *   - 'Control+X' / 'Meta+X' → '$mod+X'  (Mac Cmd ↔ Win Ctrl 통합)
 *   - key 부분 case 보존 (Enter ≠ enter, 'a' ≠ 'A')
 *   - modifier 순서: $mod < Alt < Shift  (정규형)
 *
 * 본 함수는 매트릭스 비교에서만 호출 — axis 정의 코드의 chord 문자열은 변형하지 않는다.
 */

const MOD_ORDER = ['$mod', 'Control', 'Meta', 'Alt', 'Shift'] as const

const normalizeKey = (key: string): string => {
  if (key === 'Spacebar' || key === ' ') return 'Space'
  // single-letter (a-z, A-Z): lowercase 화 — tinykeys 매칭이 case-insensitive 라
  // axis 가 'a' / 'A' 양쪽을 advertise 해도 한 row 로 합친다.
  if (key.length === 1 && /^[A-Za-z]$/.test(key)) return key.toLowerCase()
  return key
}

/**
 * Control / Meta → $mod 통합. 매트릭스가 OS 분기를 별도 row 로 쪼개지 않게 한다.
 *
 * 단, `multiSelect` 처럼 OS 분기를 의도적으로 분리 advertise 한 axis 에서도 본 함수는
 * 양쪽을 `$mod` 로 정규화하므로 매트릭스 row 가 합쳐진다 — 의도와 정합 (memory: pit
 * of success).
 */
const collapseMod = (parts: string[]): string[] => {
  const hasCtrl = parts.includes('Control')
  const hasMeta = parts.includes('Meta')
  if (!hasCtrl && !hasMeta) return parts
  return ['$mod', ...parts.filter((p) => p !== 'Control' && p !== 'Meta' && p !== '$mod')]
}

const sortMods = (parts: string[]): string[] => {
  const mods = parts.filter((p) => (MOD_ORDER as readonly string[]).includes(p))
  const key = parts.find((p) => !(MOD_ORDER as readonly string[]).includes(p)) ?? ''
  mods.sort((a, b) => MOD_ORDER.indexOf(a as typeof MOD_ORDER[number]) - MOD_ORDER.indexOf(b as typeof MOD_ORDER[number]))
  return [...mods, key]
}

export const normalizeChord = (chord: string): string => {
  const parts = chord.split('+')
  const key = parts[parts.length - 1]
  const mods = parts.slice(0, -1)
  const collapsed = collapseMod(mods)
  const normalizedKey = normalizeKey(key)
  return sortMods([...collapsed, normalizedKey]).join('+')
}

/** Set 변환 시 정규화 1회 적용. */
export const normalizeChordSet = (chords: Iterable<string>): Set<string> => {
  const out = new Set<string>()
  for (const c of chords) out.add(normalizeChord(c))
  return out
}
