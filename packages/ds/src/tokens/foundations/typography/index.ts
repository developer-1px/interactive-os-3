/**
 * typography/ — font scalar tokens. mixin 없음.
 *   scale.ts      → token: font('sm'), leading(...), weight(...) — 기본 var.
 *   heading.ts    → headingSize / headingFluid / trackingScale / underlineOffset.
 *   rhythm.ts     → emRatio() / progressInline() — em 기반 size ratio.
 *
 * Note: proximity/inset 은 spacing/ 도메인으로 이전됐다.
 */
export * from './scale'
export * from './heading'
export * from './rhythm'
