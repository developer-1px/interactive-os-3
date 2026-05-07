[**@p/aria-kernel v0.0.2**](../../README.md)

***

[@p/aria-kernel](../../modules.md) / [index](../README.md) / singleExpand

# Variable: singleExpand

> `const` **singleExpand**: [`Reducer`](../type-aliases/Reducer.md)

Defined in: [state/expansion.ts:12](https://github.com/developer-1px/interactive-os-3/blob/df2fd60ab01d60b9b40970c0425e92e7e2956ce8/packages/aria-kernel/src/state/expansion.ts#L12)

singleExpand — 한 항목이 열리면 같은 부모의 형제는 모두 닫는 reducer fragment.
APG accordion 의 single-open invariant.

## Example

```ts
composeReducers(reduce, singleExpand)
```
