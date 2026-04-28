/**
 * semantic/ — sys tokens (semantic role).
 *
 * de facto 2층 (Material 3 / Carbon):
 *   - ref(raw, 인자=숫자 scale): `tokens/scalar/` — pad, neutral, elev, tint, mix, dim
 *   - sys(semantic, 인자=named slot/role): 이 폴더 — text, surface, border, accent, font, weight, radius, ...
 *
 * **레이어 완전 분리** — scalar re-export ❌. raw 가 필요하면 `from '@p/ds/tokens/scalar'` 직접.
 * widget 은 가능하면 semantic 만 쓰고, raw 는 명시적 import 로 의도 표시.
 */
export * from './css'
export * from './typography'
export * from './spacing'
export * from './shape'
export * from './color'
export * from './state'
export * from './motion'
export * from './elevation'
export * from './control'
export * from './layout'
export * from './iconography'
export * from './zIndex'
export * from './focus'
export * from './breakpoint'
