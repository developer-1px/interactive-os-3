/**
 * Category meta — co-located SSOT for foundations·palette 카테고리 분류.
 *
 * 각 `tokens/foundations/<cat>/_category.ts` · `tokens/palette/<cat>.category.ts`
 * 가 default export 한다. canvas 의 tokenGroups · PaletteSection 은
 * `import.meta.glob` 으로 자동 수집 — 카테고리 추가/라벨 변경 시 canvas 코드
 * 수정 0곳.
 *
 * lane meta 와 동일 패턴 (defineLane). standard 는 그 카테고리가 수렴한
 * 외부 디자인시스템 표준 (de facto reference) 표기.
 */
export type CategoryMeta = {
  label: string
  standard: string
}

export function defineCategory(meta: CategoryMeta): CategoryMeta {
  return meta
}
