const isMac = typeof navigator !== 'undefined' && /mac/i.test(navigator.platform)

/** chord-string → display 형태. `mod` → ⌘/Ctrl, modifier 토큰 기호화. */
export const fmtChord = (chord: string): string =>
  chord
    .split('+')
    .map((part) => {
      const lower = part.toLowerCase()
      if (lower === 'mod') return isMac ? '⌘' : 'Ctrl'
      if (lower === 'shift') return '⇧'
      if (lower === 'alt') return isMac ? '⌥' : 'Alt'
      if (lower === 'ctrl') return 'Ctrl'
      if (lower === 'meta') return '⌘'
      return part.charAt(0).toUpperCase() + part.slice(1)
    })
    .join('+')
