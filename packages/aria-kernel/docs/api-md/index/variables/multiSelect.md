[**@p/aria-kernel v0.0.2**](../../README.md)

***

[@p/aria-kernel](../../modules.md) / [index](../README.md) / multiSelect

# Variable: multiSelect

> `const` **multiSelect**: [`Axis`](../type-aliases/Axis.md)

Defined in: [axes/multiSelect.ts:19](https://github.com/developer-1px/interactive-os-3/blob/df2fd60ab01d60b9b40970c0425e92e7e2956ce8/packages/aria-kernel/src/axes/multiSelect.ts#L19)

multiSelect — `aria-multiselectable` axis. anchor-range, Ctrl+A, Shift+Click.
single-select 단일 토글은 별도 `select` axis. activate (default action) 와도 분리.
Click/Space toggle, Shift+Arrow / Shift+Click anchor-range, Ctrl/Meta+A all.
Emits `select` (per-id toggle) and `selectMany` (batch).

Range semantics — de facto (Mac Finder · Shopify · Radix · React Aria):
  anchor..current = selected · everything outside that range = deselected.
  anchor is set by the most recent `select` event (reduce.ts handles).

APG: https://www.w3.org/WAI/ARIA/apg/patterns/listbox/  (Selection)
