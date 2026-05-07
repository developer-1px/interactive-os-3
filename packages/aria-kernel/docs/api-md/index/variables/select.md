[**@p/aria-kernel v0.0.2**](../../README.md)

***

[@p/aria-kernel](../../modules.md) / [index](../README.md) / select

# Variable: select

> `const` **select**: [`Axis`](../type-aliases/Axis.md)

Defined in: [axes/select.ts:16](https://github.com/developer-1px/interactive-os-3/blob/df2fd60ab01d60b9b40970c0425e92e7e2956ce8/packages/aria-kernel/src/axes/select.ts#L16)

select — single-select chord (`Space` / click). Emits `{type:'select', id}`.
APG `/listbox/` `/treeview/` single-select 의 manual 모드에 매핑.

`aria-selected` 만 책임. `Enter` (default action) 은 activate 가 보유 — 합성
순서로 분리: composeAxes(..., select, ..., activate) → Space 는 select 흡수,
Enter 는 activate 로 fall-through.

focus-driven selection-follows-focus 는 `gesture/selectionFollowsFocus` 가
navigate→select 변환으로 담당. select axis 는 manual chord 만.
