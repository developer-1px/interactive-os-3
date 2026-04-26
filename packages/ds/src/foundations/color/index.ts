/**
 * color/ — Color foundations.
 *
 * 3-tier 위계 (de facto Material 3 / Radix / Primer / Spectrum):
 *   palette (raw scale + transforms) → semantic (의미 토큰) → pair (bg/fg 쌍 강제)
 *
 * 모두 token (값 반환). mixin 없음 — 색은 selector에 직접 안 들어감.
 * widget은 semantic·pair만 import. palette은 theme/preset/내부에서만 소비.
 */
// palette tier(neutral/dim/mix/tint/fg)는 `ds/palette/color`로 이관됨.
// 이 파일은 sys tier(semantic + pair)만 노출한다. raw scale 호환은 root foundations/index.ts에서.
export * from './semantic'
export * from './pair'
export * from './code'
