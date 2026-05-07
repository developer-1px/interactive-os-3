[**@p/aria-kernel v0.0.2**](../../README.md)

***

[@p/aria-kernel](../../modules.md) / [index](../README.md) / Reducer

# Type Alias: Reducer

> **Reducer** = (`d`, `e`) => [`NormalizedData`](../interfaces/NormalizedData.md)

Defined in: [state/compose.ts:5](https://github.com/developer-1px/interactive-os-3/blob/df2fd60ab01d60b9b40970c0425e92e7e2956ce8/packages/aria-kernel/src/state/compose.ts#L5)

`(data, event) → next data` — NormalizedData 위에 UiEvent 를 적용하는 pure 함수.

## Parameters

### d

[`NormalizedData`](../interfaces/NormalizedData.md)

### e

[`UiEvent`](UiEvent.md)

## Returns

[`NormalizedData`](../interfaces/NormalizedData.md)
