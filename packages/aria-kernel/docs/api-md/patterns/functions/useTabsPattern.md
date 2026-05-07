[**@p/aria-kernel v0.0.2**](../../README.md)

***

[@p/aria-kernel](../../modules.md) / [patterns](../README.md) / useTabsPattern

# Function: useTabsPattern()

> **useTabsPattern**(`data`, `onEvent?`, `opts?`): `object`

Defined in: [patterns/tabs.ts:31](https://github.com/developer-1px/interactive-os-3/blob/df2fd60ab01d60b9b40970c0425e92e7e2956ce8/packages/aria-kernel/src/patterns/tabs.ts#L31)

tabs — APG `/tabs/` recipe.
https://www.w3.org/WAI/ARIA/apg/patterns/tabs/

tabProps(id)·panelProps(id) 가 `aria-controls`/`aria-labelledby` 자동 연결.

## Parameters

### data

[`NormalizedData`](../../index/interfaces/NormalizedData.md)

### onEvent?

(`e`) => `void`

### opts?

[`TabsOptions`](../interfaces/TabsOptions.md) = `{}`

## Returns

`object`

### items

> **items**: [`BaseItem`](../interfaces/BaseItem.md)[]

### panelProps

> **panelProps**: (`id`) => [`ItemProps`](../type-aliases/ItemProps.md)

#### Parameters

##### id

`string`

#### Returns

[`ItemProps`](../type-aliases/ItemProps.md)

### rootProps

> **rootProps**: [`RootProps`](../type-aliases/RootProps.md)

### tabProps

> **tabProps**: (`id`) => [`ItemProps`](../type-aliases/ItemProps.md)

#### Parameters

##### id

`string`

#### Returns

[`ItemProps`](../type-aliases/ItemProps.md)
