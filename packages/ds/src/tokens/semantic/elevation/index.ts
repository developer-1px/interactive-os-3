/**
 * elevation/ — 깊이(elevation) sys 레이어 + grouping mixin.
 *   shadow.ts    → token: shadow() — preset.shadow 호환 alias.
 *   grouping.ts  → recipe: grouping(d) — bg+border+box-shadow 풀 사양 css 블록.
 *
 * raw scalar `elev(d)`는 `ds/scalar/elev`로 이관됨.
 * grouping은 selector 인자를 받지 않는 recipe(현재 부모 selector 안에서 평탄 삽입).
 */
export * from './shadow'
export * from './grouping'
