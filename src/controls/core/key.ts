export interface KeySpec {
  key: string
  ctrl?: boolean
  alt?: boolean
  meta?: boolean
  shift?: boolean
}

export const isPrintable = (k: KeySpec): boolean =>
  k.key.length === 1 && /\S/.test(k.key) && !k.ctrl && !k.alt && !k.meta

export const fromKeyboardEvent = (e: {
  key: string; ctrlKey: boolean; altKey: boolean; metaKey: boolean; shiftKey: boolean
}): KeySpec => ({
  key: e.key, ctrl: e.ctrlKey, alt: e.altKey, meta: e.metaKey, shift: e.shiftKey,
})
