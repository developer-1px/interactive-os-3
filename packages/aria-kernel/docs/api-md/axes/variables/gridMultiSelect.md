[**@p/aria-kernel v0.0.2**](../../README.md)

***

[@p/aria-kernel](../../modules.md) / [axes](../README.md) / gridMultiSelect

# Variable: gridMultiSelect

> `const` **gridMultiSelect**: [`Axis`](../../index/type-aliases/Axis.md)

Defined in: [axes/gridMultiSelect.ts:20](https://github.com/developer-1px/interactive-os-3/blob/df2fd60ab01d60b9b40970c0425e92e7e2956ce8/packages/aria-kernel/src/axes/gridMultiSelect.ts#L20)

gridMultiSelect — APG `/grid/` Selection 키 매핑. focus 이동은 gridNavigate.
https://www.w3.org/WAI/ARIA/apg/patterns/grid/

입력 단위 = 현재 focus 된 cell. data 모델은 gridNavigate 와 동일 (container → row → cell).

키 매핑:
  Ctrl+Space   : 현재 cell 의 column 전체(모든 row 의 같은 colIdx cell) 선택
  Shift+Space  : 현재 cell 의 row 전체 선택
  Ctrl/Meta+A  : 모든 cell 선택
  Ctrl/Meta+클릭: 단일 cell toggle
  Shift+Arrow  : SELECT_ANCHOR(없으면 현재 cell)→ 다음 cell 을 두 모서리로 하는 사각형 영역 selectMany.
                 multiSelect 의 1D anchor-range 와 의미 일관 — 범위 밖은 deselect.
