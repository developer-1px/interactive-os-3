[**@p/aria-kernel v0.0.2**](../../README.md)

***

[@p/aria-kernel](../../modules.md) / [axes](../README.md) / gridNavigate

# Variable: gridNavigate

> `const` **gridNavigate**: [`Axis`](../../index/type-aliases/Axis.md)

Defined in: [axes/gridNavigate.ts:30](https://github.com/developer-1px/interactive-os-3/blob/df2fd60ab01d60b9b40970c0425e92e7e2956ce8/packages/aria-kernel/src/axes/gridNavigate.ts#L30)

gridNavigate — APG `/grid/` 2D 셀 단위 navigation. focus 는 cell 에 있다.
Selection rect (Shift+Arrow / Ctrl+Space col / Shift+Space row) 은 gridMultiSelect.
https://www.w3.org/WAI/ARIA/apg/patterns/grid/

data 모델:
  container (= ROOT 또는 containerId)
    ├─ row entity
    │    ├─ cell entity
    │    ├─ cell entity
    │    ⋮
    ├─ row entity
    ⋮

focus 는 cell 에 있다 (treegrid 의 row focus 와 다름).

키 매핑 (data grid model, no wrap):
  ArrowLeft/Right  : 같은 row 의 prev/next cell. 양 끝에서 정지.
  ArrowUp/Down     : 인접 row 의 같은 column index cell. 양 끝에서 정지.
  Home / End       : 현재 row 의 첫/끝 cell.
  Ctrl+Home / End  : grid 의 첫 row 첫 cell / 끝 row 끝 cell.

column index 가 인접 row 보다 클 경우 가능한 마지막 cell 로 clamp (sparse row 대응).
