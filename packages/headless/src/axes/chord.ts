/**
 * Chord — tinykeys de facto string syntax.
 *
 *   "Escape" · "Shift+Tab" · "Meta+c" · "ArrowDown" · "Space" · "$mod+s"
 *
 * 형식: `[Modifier+]*Key`. Modifier ∈ {Shift, Control, Alt, Meta} (case-insensitive).
 * Key = KeyboardEvent.key 값 그대로 (대소문자 보존). `Space` alias = `" "`.
 * `$mod` magic = Mac → Meta, 그 외 → Control.
 *
 * 100% JSON serializable. devtools/문서/grep 가독.
 */

export type Chord = string

export type ParsedChord = {
  key: string
  ctrl?: true
  alt?: true
  meta?: true
  shift?: true
}

const SPACE = ' '

const detectMac = (): boolean => {
  if (typeof navigator === 'undefined') return false
  return /Mac|iPod|iPhone|iPad/.test(navigator.platform)
}

/**
 * parseChord — tinykeys string → ParsedChord. modifier 순서 무관, case-insensitive.
 *
 * `$mod` magic: Mac=Meta, 그 외=Control. opts.isMac 으로 override 가능 (test/SSR).
 */
export const parseChord = (s: Chord, opts: { isMac?: boolean } = {}): ParsedChord => {
  const isMac = opts.isMac ?? detectMac()
  // 마지막 '+' 이후를 key 로 (그 자체가 key 인 '+' 케이스도 포함).
  const lastPlus = s.lastIndexOf('+')
  const key = lastPlus === -1 ? s : s.slice(lastPlus + 1) || '+'
  const modPart = lastPlus === -1 ? '' : s.slice(0, lastPlus + (key === '+' ? 0 : 0))
  const mods = new Set(
    modPart
      .split('+')
      .filter((p) => p.length > 0)
      .map((p) => p.toLowerCase()),
  )
  // $mod 처리
  if (mods.has('$mod')) {
    mods.delete('$mod')
    mods.add(isMac ? 'meta' : 'ctrl')
  }
  // ctrl/control 정규화
  if (mods.has('control')) {
    mods.delete('control')
    mods.add('ctrl')
  }

  const result: ParsedChord = { key: key === 'Space' ? SPACE : key }
  if (mods.has('ctrl'))  result.ctrl  = true
  if (mods.has('alt'))   result.alt   = true
  if (mods.has('meta'))  result.meta  = true
  if (mods.has('shift')) result.shift = true
  return result
}

/** matchChord — KeyboardEvent vs Chord. modifier flag 가 정확히 일치해야 함. */
export const matchChord = (e: KeyboardEvent, chord: Chord, opts?: { isMac?: boolean }): boolean => {
  const c = parseChord(chord, opts)
  return e.key === c.key
    && Boolean(e.ctrlKey)  === Boolean(c.ctrl)
    && Boolean(e.altKey)   === Boolean(c.alt)
    && Boolean(e.metaKey)  === Boolean(c.meta)
    && Boolean(e.shiftKey) === Boolean(c.shift)
}
