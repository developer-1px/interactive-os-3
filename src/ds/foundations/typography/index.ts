/**
 * typography/ — font scalar tokens. mixin 없음.
 *   scale.ts      → token: font('sm'), leading(...), weight(...) — 기본 var.
 *   heading.ts    → headingSize / headingFluid / trackingScale / underlineOffset.
 *   proximity.ts  → proximity() / inset() — Gestalt 시맨틱 마진/패딩.
 *   rhythm.ts     → emRatio() / progressInline() — em 기반 size ratio.
 */
export * from './scale'
export * from './heading'
export * from './proximity'
export * from './rhythm'
