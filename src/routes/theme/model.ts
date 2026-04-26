/**
 * Theme Creator 모델 + localStorage 영속.
 *
 * 토큰 출처: src/ds/style/preset/apply.ts
 *   --ds-tone-hue / --ds-tone-chroma / --ds-tone-tint /
 *   --ds-step-scale / --ds-hue / --ds-density
 */

export const initial = {
  toneHue: 70,
  toneChroma: 0.018,
  toneTint: 18,
  stepScale: 1,
  accentHue: 260,
  density: 1,
} as const

export type ThemeState = { -readonly [K in keyof typeof initial]: number }

export const VAR_MAP: Record<keyof ThemeState, string> = {
  toneHue: '--ds-tone-hue',
  toneChroma: '--ds-tone-chroma',
  toneTint: '--ds-tone-tint',
  stepScale: '--ds-step-scale',
  accentHue: '--ds-hue',
  density: '--ds-density',
}

export const STORAGE_KEY = 'ds-theme-overrides'

export const loadOverrides = (): ThemeState => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return { ...initial }
    const parsed = JSON.parse(raw) as Partial<Record<string, number>>
    const out = { ...initial } as ThemeState
    for (const k of Object.keys(initial) as Array<keyof ThemeState>) {
      const v = parsed[VAR_MAP[k]]
      if (typeof v === 'number') out[k] = v
    }
    return out
  } catch {
    return { ...initial }
  }
}
