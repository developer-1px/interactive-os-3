[**@p/aria-kernel v0.0.2**](../../README.md)

***

[@p/aria-kernel](../../modules.md) / [patterns](../README.md) / useTreeGridPattern

# Function: useTreeGridPattern()

> **useTreeGridPattern**(`data`, `onEvent?`, `opts?`): `object`

Defined in: [patterns/treeGrid.ts:40](https://github.com/developer-1px/interactive-os-3/blob/df2fd60ab01d60b9b40970c0425e92e7e2956ce8/packages/aria-kernel/src/patterns/treeGrid.ts#L40)

treeGrid — APG `/treegrid/` recipe.
https://www.w3.org/WAI/ARIA/apg/patterns/treegrid/

Focus stays on rows; cells expose grid semantics through rowheader/gridcell + aria-colindex.

## Parameters

### data

[`NormalizedData`](../../index/interfaces/NormalizedData.md)

### onEvent?

(`e`) => `void`

### opts?

[`TreeGridOptions`](../interfaces/TreeGridOptions.md) = `{}`

## Returns

`object`

### columnheaderProps

> **columnheaderProps**: (`colIndex`) => [`ItemProps`](../type-aliases/ItemProps.md)

#### Parameters

##### colIndex

`number`

#### Returns

[`ItemProps`](../type-aliases/ItemProps.md)

### gridcellProps

> **gridcellProps**: (`rowId`, `colIndex`) => [`ItemProps`](../type-aliases/ItemProps.md)

#### Parameters

##### rowId

`string`

##### colIndex

`number`

#### Returns

[`ItemProps`](../type-aliases/ItemProps.md)

### headerRowProps

> **headerRowProps**: [`ItemProps`](../type-aliases/ItemProps.md)

### items

> **items**: [`TreeItem`](../interfaces/TreeItem.md)[]

### rowheaderProps

> **rowheaderProps**: (`rowId`) => [`ItemProps`](../type-aliases/ItemProps.md)

#### Parameters

##### rowId

`string`

#### Returns

[`ItemProps`](../type-aliases/ItemProps.md)

### rowProps

> **rowProps**: (`id`) => [`ItemProps`](../type-aliases/ItemProps.md)

#### Parameters

##### id

`string`

#### Returns

[`ItemProps`](../type-aliases/ItemProps.md)

### treegridProps

> **treegridProps**: [`RootProps`](../type-aliases/RootProps.md)
