[**@p/aria-kernel v0.0.2**](../../README.md)

***

[@p/aria-kernel](../../modules.md) / [index](../README.md) / fromList

# Function: fromList()

> **fromList**(`items`): [`NormalizedData`](../interfaces/NormalizedData.md)

Defined in: [state/fromTree.ts:37](https://github.com/developer-1px/interactive-os-3/blob/df2fd60ab01d60b9b40970c0425e92e7e2956ce8/packages/aria-kernel/src/state/fromTree.ts#L37)

fromList — flat array to NormalizedData.
Items may omit `id`; in that case a synthetic id `__0`, `__1`, ... is assigned.
All non-id keys become entity data.

## Parameters

### items

`Record`\<`string`, `unknown`\>[]

## Returns

[`NormalizedData`](../interfaces/NormalizedData.md)
