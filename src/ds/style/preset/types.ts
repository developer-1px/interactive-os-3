export type TokenRef =
  | string
  | { mix: [string, number, string] }

export type Layer = {
  x: number
  y: number
  blur: number
  spread: number
  color: TokenRef
}

export type RadiusScale = 'sm' | 'md' | 'lg' | 'pill'
export type TextScale = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl'
export type ElevationLevel = 0 | 1 | 2 | 3

export type DsPreset = {
  id: string
  seed: { hue: number; density: number; depth: number }
  color: {
    fg: TokenRef
    bg: TokenRef
    border: TokenRef
    muted: TokenRef
    accent: TokenRef
    traffic?: { close: TokenRef; min: TokenRef; max: TokenRef }
  }
  space: { unit: string }
  radius: Record<RadiusScale, string>
  text: Record<TextScale, string>
  font: { sans: string; mono: string }
  leading: { normal: number; tight: number; tracking: string }
  elevation: Record<ElevationLevel, Layer[]>
  shell: {
    inset: string
    radius: string
    chromeH: string
    sidebarW: string
    columnW: string
    previewW: string
    trafficSize: string
  }
  darkShadowMultiplier?: number
}
