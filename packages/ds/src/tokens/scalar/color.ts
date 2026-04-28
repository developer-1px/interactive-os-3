/**
 * Palette tier — raw 색 scale 접근 + 변환 수식.
 *
 * **widget은 직접 호출하지 않는다.** semantic tier(fn/semantic.ts)를 통해서만 색에 접근.
 * 이 파일의 함수들은 (a) preset/apply.ts (b) fn/semantic.ts (c) fn/state.ts 등
 * 시스템 내부에서만 소비된다.
 *
 * 원칙: **항상 var(--...) 참조를 반환, 값을 resolve하지 않는다.**
 *   applyPreset()으로 런타임에 토큰을 갈아도 모든 widget이 즉시 따라오기 위함.
 *
 * de facto 3-tier (Material 3 / Radix / Primer / Spectrum):
 *   scalar (raw scale) → semantic (의미 토큰) → component
 *   widget은 semantic만 import. palette은 theme 정의·preset/apply.ts·semantic.ts에서만 소비.
 */

// ── 값 접근자 (scalar tier) ─────────────────────────────────────────────
export type Neutral = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9

/**
 * neutral scale — 1(가장 약함) ~ 9(가장 강함). raw scale, semantic.ts 내부에서만.
 * @demo type=color fn=neutral args=[5] scale=[1,2,3,4,5,6,7,8,9]
 */
export const neutral = (n: Neutral = 9) => `var(--ds-neutral-${n})`

// ── 변환 수식 (utility, scalar·semantic 양쪽에서 사용) ─────────────────
/**
 * 색을 알파만 낮춘 반투명 버전 — 배경 tint, focus ring 외곽 등
 * @demo type=color fn=tint args=["var(--ds-accent)",30]
 */
export const tint      = (color: string, pct: number) =>
  `color-mix(in oklab, ${color} ${pct}%, transparent)`

/**
 * 두 색 사이 보간 — neutral 단계 파생이나 커스텀 mix용
 * @demo type=color fn=mix args=["var(--ds-accent)",50,"Canvas"]
 */
export const mix       = (a: string, pct: number, b: string = 'Canvas') =>
  `color-mix(in oklab, ${a} ${pct}%, ${b})`

/**
 * 현재 색(currentColor)을 살짝 죽인 톤. 변환 수식 — opacity가 안 되는 맥락(box-shadow/border 등)에서.
 * **텍스트 약화는 fn/pair.ts의 mute()를 쓴다.** dim()을 widget에서 텍스트에 쓰면 surface flip 시 깨진다.
 * @demo type=color fn=dim args=[50]
 */
export const dim       = (pct: number, base: string = 'transparent') =>
  `color-mix(in oklab, currentColor ${pct}%, ${base})`
