[**@p/aria-kernel v0.0.2**](../../README.md)

***

[@p/aria-kernel](../../modules.md) / [patterns](../README.md) / useTreePattern

# Function: useTreePattern()

> **useTreePattern**(`data`, `onEvent?`, `opts?`): `object`

Defined in: [patterns/tree.ts:39](https://github.com/developer-1px/interactive-os-3/blob/df2fd60ab01d60b9b40970c0425e92e7e2956ce8/packages/aria-kernel/src/patterns/tree.ts#L39)

tree — APG `/treeview/` recipe.
https://www.w3.org/WAI/ARIA/apg/patterns/treeview/

## Parameters

### data

[`NormalizedData`](../../index/interfaces/NormalizedData.md)

### onEvent?

(`e`) => `void`

### opts?

[`TreeOptions`](../interfaces/TreeOptions.md) = `{}`

## Returns

`object`

### itemProps

> **itemProps**: (`id`) => [`ItemProps`](../type-aliases/ItemProps.md)

#### Parameters

##### id

`string`

#### Returns

[`ItemProps`](../type-aliases/ItemProps.md)

### items

> **items**: [`TreeItem`](../interfaces/TreeItem.md)[]

### rootProps

> **rootProps**: [`RootProps`](../type-aliases/RootProps.md)
