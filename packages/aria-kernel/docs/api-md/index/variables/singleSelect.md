[**@p/aria-kernel v0.0.2**](../../README.md)

***

[@p/aria-kernel](../../modules.md) / [index](../README.md) / singleSelect

# Variable: singleSelect

> `const` **singleSelect**: [`Reducer`](../type-aliases/Reducer.md)

Defined in: [state/selection.ts:19](https://github.com/developer-1px/interactive-os-3/blob/df2fd60ab01d60b9b40970c0425e92e7e2956ce8/packages/aria-kernel/src/state/selection.ts#L19)

singleSelect — single-selection reducer fragment.

On `select` (axis: select) or `activate` (axis: activate, default action):
 - marks `e.id` as selected, clears others (`selected: false`)
 - moves focus to `e.id` ("selected = focused" — APG single-select semantics)

Both events are accepted so single-select hosts can compose `select` axis
(ARIA-correct vocabulary: aria-selected) or rely on `activate` (default
action that also selects, e.g. tabs/menu) without diverging reducers.

APG-aligned: tabs / listbox(single) / radio / menu / menubar follow this.

Compose with `reduce`:
  const myReduce = composeReducers(reduce, singleSelect)
