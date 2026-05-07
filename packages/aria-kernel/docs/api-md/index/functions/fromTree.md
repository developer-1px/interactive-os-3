[**@p/aria-kernel v0.0.2**](../../README.md)

***

[@p/aria-kernel](../../modules.md) / [index](../README.md) / fromTree

# Function: fromTree()

> **fromTree**\<`T`\>(`roots`, `opts?`): [`NormalizedData`](../interfaces/NormalizedData.md)

Defined in: [state/fromTree.ts:8](https://github.com/developer-1px/interactive-os-3/blob/df2fd60ab01d60b9b40970c0425e92e7e2956ce8/packages/aria-kernel/src/state/fromTree.ts#L8)

fromTree — convention-based tree builder. Input is `{id, children?, ...rest}` —
id and children are reserved keys; rest becomes the entity's user data.
No callbacks. No options for shape transformation.

## Type Parameters

### T

`T` *extends* `object`

## Parameters

### roots

`T`[]

### opts?

#### expanded?

`string`[]

#### focusId?

`string` \| `null`

## Returns

[`NormalizedData`](../interfaces/NormalizedData.md)
