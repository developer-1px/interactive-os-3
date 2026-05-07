[**@p/aria-kernel v0.0.2**](../../README.md)

***

[@p/aria-kernel](../../modules.md) / [index](../README.md) / multiSelectToggle

# Variable: multiSelectToggle

> `const` **multiSelectToggle**: [`Reducer`](../type-aliases/Reducer.md)

Defined in: [state/selection.ts:66](https://github.com/developer-1px/interactive-os-3/blob/df2fd60ab01d60b9b40970c0425e92e7e2956ce8/packages/aria-kernel/src/state/selection.ts#L66)

multiSelectToggle — toggles `selected` on `select` (per-id) and `selectMany`
(batch). Batch path is O(N) with a single entities spread regardless of N.
APG-aligned: listbox(multi), tree(multi), checkbox group.
