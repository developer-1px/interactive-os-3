[**@p/aria-kernel v0.0.2**](../../README.md)

***

[@p/aria-kernel](../../modules.md) / [index](../README.md) / composeReducers

# Function: composeReducers()

> **composeReducers**(...`rs`): [`Reducer`](../type-aliases/Reducer.md)

Defined in: [state/compose.ts:14](https://github.com/developer-1px/interactive-os-3/blob/df2fd60ab01d60b9b40970c0425e92e7e2956ce8/packages/aria-kernel/src/state/compose.ts#L14)

composeReducers — left-to-right reducer composition. Each reducer sees the
output of the previous one. Identity reducers (e.g. `reduce` for activate)
pass the data through unchanged so subsequent reducers (selection / value /
domain) can layer their semantics.

## Parameters

### rs

...[`Reducer`](../type-aliases/Reducer.md)[]

## Returns

[`Reducer`](../type-aliases/Reducer.md)
