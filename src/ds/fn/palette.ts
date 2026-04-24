/**
 * Palette 소비 래퍼.
 *
 * 원칙: **항상 var(--...) 참조를 반환, 값을 resolve하지 않는다.**
 *   applyPreset()으로 런타임에 토큰을 갈아도 모든 widget이 즉시 따라오기 위함.
 *
 * fn/state의 selected/hover와 동일한 레벨 — "반복되는 표현을 의미 단위 함수로 단일화".
 * color-mix 수식이나 var 이름을 widget 안에 리터럴로 적지 말고 여기 한 곳에서만 조립한다.
 */

// ── 값 접근자 ───────────────────────────────────────────────────────────
export type Gray = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9

/** gray scale — 1(가장 약함) ~ 9(가장 강함). 텍스트 위계, border 계층에 사용. */
export const fg        = (n: Gray = 9) => `var(--ds-gray-${n})`

export const accent    = () => `var(--ds-accent)`
export const onAccent  = () => `var(--ds-accent-on)`

export type StatusTone = 'success' | 'warning' | 'danger'
export const status    = (t: StatusTone) => `var(--ds-${t})`

export const border    = () => `var(--ds-border)`
export const muted     = () => `var(--ds-muted)`
export const bg        = () => `var(--ds-bg)`

// ── 반복 수식 ───────────────────────────────────────────────────────────
/** 색을 알파만 낮춘 반투명 버전 — 배경 tint, focus ring 외곽 등 */
export const tint      = (color: string, pct: number) =>
  `color-mix(in oklab, ${color} ${pct}%, transparent)`

/** 두 색 사이 보간 — gray 단계 파생이나 커스텀 mix용 */
export const mix       = (a: string, pct: number, b: string = 'Canvas') =>
  `color-mix(in oklab, ${a} ${pct}%, ${b})`

/** 현재 색(currentColor)을 살짝 죽인 톤 — label/caption/muted text */
export const dim       = (pct: number, base: string = 'transparent') =>
  `color-mix(in oklab, currentColor ${pct}%, ${base})`
