/**
 * fmtKey — chord 의 key 부분을 사람이 읽기 좋은 글리프로.
 * (probe/dedupe 는 phase 7 (PRD #38) 에서 폐기. axis.chords / axisKeys 직접 사용.)
 */
const KEY_GLYPH: Record<string, string> = {
  ' ': 'Space',
  ArrowUp: '↑',
  ArrowDown: '↓',
  ArrowLeft: '←',
  ArrowRight: '→',
  Escape: 'Esc',
  a: 'A–Z',
  '<printable>': 'A–Z',
}

export const fmtKey = (k: string) => KEY_GLYPH[k] ?? k
