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
export type TextScale = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl'
export type ElevationLevel = 0 | 1 | 2 | 3
export type ZSlot = 'base' | 'dropdown' | 'sticky' | 'overlay' | 'modal' | 'toast' | 'tooltip'
export type SizeScale = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl'

export type DsPreset = {
  id: string
  seed: {
    hue: number
    density: number
    depth: number
    /** neutral 톤 hue (oklch). 70 = warm/papery (Notion·Apple Pages 톤),
     *  250 = cool/screeny (Linear 톤). 미설정 시 70. */
    toneHue?: number
    /** neutral 톤 chroma (oklch). 0~0.04 권장. 미설정 시 0.018 (감지 임계 근처). */
    toneChroma?: number
    /** hued chip이 CanvasText에 섞이는 비율 (0~100). 미설정 시 18 (감지 임계). */
    toneTint?: number
    /** neutral 1~9 곡선 배율. 0.5~1.6 권장. 1=default, <1=soft 대비, >1=punchy 대비. */
    stepScale?: number
  }
  color: {
    fg: TokenRef
    bg: TokenRef
    border: TokenRef
    muted: TokenRef
    accent: TokenRef
    // "on-*" = 해당 채도 색 위에 올라가는 텍스트 전경. bg/fg를 쌍으로 묶어
    // preset 정의 시점에 contrast를 결정한다. 소비처는 fn/pair의 tone(name)으로
    // 두 값을 한 번에 적용 → 한쪽만 쓰고 다른 쪽을 빼먹는 누락을 구조적으로 방지.
    accentOn?: TokenRef   // 기본 '#fff'
    // Semantic status colors — Badge / Field error / inline indicators가 공유.
    // 없으면 accent로 폴백.
    success?: TokenRef
    successOn?: TokenRef  // 기본 '#fff'
    warning?: TokenRef
    warningOn?: TokenRef  // 기본 '#000' (warning은 밝은 톤이라 검정이 안전)
    danger?: TokenRef
    dangerOn?: TokenRef   // 기본 '#fff'
    // Neutral scale — 1(가장 약한 tint) ~ 9(가장 강한 텍스트)로 계층. muted/border는
    // 이 스케일에서 파생 가능. preset에 없으면 CanvasText 기반 color-mix로 폴백.
    neutral?: Partial<Record<'1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9', TokenRef>>
    traffic?: { close: TokenRef; min: TokenRef; max: TokenRef }
  }
  space: { unit: string }
  radius: Record<RadiusScale, string>
  /** 강조 테두리 두께 — focus-ring · active indicator · slider thumb 공통.
   *  hairline(border 토큰)보다 한 단 두꺼운 ladder. 미정의 시 default '2px'. */
  focusRingWidth?: string
  /** focus-ring outline-offset. 미정의 시 default '2px'. */
  focusRingOffset?: string
  text: Record<TextScale, string>
  /** box size scale — width/height for icon · avatar · thumbnail · control. */
  size: Record<SizeScale, string>
  font: { sans: string; mono: string }
  leading: { normal: number; tight: number; tracking: string }
  /** Heading ladder — h1~h6 size·leading. preset 갈아끼우면 모든 prose/parts 헤딩 자동 따라옴.
   *  미정의 시 default ladder (1.5em / 1.25em / 1.125em / 1em / 1em / 1em). */
  heading?: {
    size?: [string, string, string, string, string, string]
    leading?: [string, string, string, string, string, string]
  }
  /** letter-spacing scale — heading dramatic tight + uppercase caps.
   *  미정의 시 default (-0.02em..0.06em). */
  tracking?: {
    tightest?: string
    tighter?: string
    tight?: string
    normal?: string
    wide?: string
    caps?: string
  }
  elevation: Record<ElevationLevel, Layer[]>
  /** z-index stack ladder. base < dropdown < sticky < overlay < modal < toast < tooltip.
   *  미정의 시 default (0/1000/1100/1200/1300/1400/1500). */
  zIndex?: Partial<Record<ZSlot, number>>
  shell: {
    inset: string
    radius: string
    chromeH: string
    sidebarW: string
    columnW: string
    previewW: string
    trafficSize: string
    /** mobile shell mode 임계 폭. 이 값 이하 viewport는 mobile shell 분기.
     *  L0(viewport)만 이 값을 본다. L1 shell CSS는 var(--ds-shell-mobile-max)로 참조,
     *  L2/L3는 viewport 모름(@container 사용). */
    mobileMax: string
  }
  darkShadowMultiplier?: number
}
