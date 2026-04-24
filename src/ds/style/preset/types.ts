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
    // Semantic status colors — Badge / Field error / inline indicators가 공유.
    // 없으면 accent로 폴백.
    success?: TokenRef
    warning?: TokenRef
    danger?: TokenRef
    // Gray scale — 1(가장 약한 tint) ~ 9(가장 강한 텍스트)로 계층. muted/border는
    // 이 스케일에서 파생 가능. preset에 없으면 CanvasText 기반 color-mix로 폴백.
    gray?: Partial<Record<'1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9', TokenRef>>
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
