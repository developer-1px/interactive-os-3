/**
 * palette/ — ref tokens (raw scale).
 *
 * de facto Material 3 / Carbon: ref tokens(raw scale) vs sys tokens(semantic role) 2층.
 * 이 레이어의 export는 인자가 숫자(scale 인덱스)인 raw 함수만.
 *
 *   color.ts  → gray, fg, tint, mix, dim
 *   space.ts  → pad, rowPadding, level
 *   elev.ts   → elev
 *
 * widget은 가능하면 palette를 직접 import 하지 않고 foundations/semantic을 쓴다.
 * 단, raw scale이 명시적으로 필요한 곳(theme/preset, foundations 내부)에선 여기서.
 */
export * from './color'
export * from './space'
export * from './elev'
