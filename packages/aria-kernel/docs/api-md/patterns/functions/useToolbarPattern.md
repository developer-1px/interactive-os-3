[**@p/aria-kernel v0.0.2**](../../README.md)

***

[@p/aria-kernel](../../modules.md) / [patterns](../README.md) / useToolbarPattern

# Function: useToolbarPattern()

> **useToolbarPattern**(`data`, `onEvent?`, `opts?`): `object`

Defined in: [patterns/toolbar.ts:27](https://github.com/developer-1px/interactive-os-3/blob/df2fd60ab01d60b9b40970c0425e92e7e2956ce8/packages/aria-kernel/src/patterns/toolbar.ts#L27)

toolbar — APG `/toolbar/` recipe.
https://www.w3.org/WAI/ARIA/apg/patterns/toolbar/

`entity.separator: true` 항목은 roving skip + role="separator".
`entity.pressed` 는 toggle button 상태 — 데이터 owner 가 set.

## Parameters

### data

[`NormalizedData`](../../index/interfaces/NormalizedData.md)

### onEvent?

(`e`) => `void`

### opts?

[`ToolbarOptions`](../interfaces/ToolbarOptions.md) = `{}`

## Returns

`object`

### items

> **items**: [`BaseItem`](../interfaces/BaseItem.md) & `object`[]

### rootProps

> **rootProps**: [`RootProps`](../type-aliases/RootProps.md)

### toolbarItemProps

> **toolbarItemProps**: (`id`) => [`ItemProps`](../type-aliases/ItemProps.md)

#### Parameters

##### id

`string`

#### Returns

[`ItemProps`](../type-aliases/ItemProps.md)
