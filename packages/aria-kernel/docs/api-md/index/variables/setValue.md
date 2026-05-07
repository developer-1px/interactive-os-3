[**@p/aria-kernel v0.0.2**](../../README.md)

***

[@p/aria-kernel](../../modules.md) / [index](../README.md) / setValue

# Variable: setValue

> `const` **setValue**: [`Reducer`](../type-aliases/Reducer.md)

Defined in: [state/value.ts:10](https://github.com/developer-1px/interactive-os-3/blob/df2fd60ab01d60b9b40970c0425e92e7e2956ce8/packages/aria-kernel/src/state/value.ts#L10)

setValue — numeric `value` reducer fragment for slider / splitter / spinner.

On `value` events, writes `e.value` into `entities[e.id].value`.
Compose with `reduce`:
  const myReduce = composeReducers(reduce, setValue)
