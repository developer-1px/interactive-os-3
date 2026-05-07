[**@p/aria-kernel v0.0.2**](../../README.md)

***

[@p/aria-kernel](../../modules.md) / [patterns](../README.md) / useListboxPattern

# Function: useListboxPattern()

> **useListboxPattern**(`data`, `onEvent?`, `opts?`): `object`

Defined in: [patterns/listbox.ts:48](https://github.com/developer-1px/interactive-os-3/blob/df2fd60ab01d60b9b40970c0425e92e7e2956ce8/packages/aria-kernel/src/patterns/listbox.ts#L48)

listbox — APG `/listbox/` recipe.
https://www.w3.org/WAI/ARIA/apg/patterns/listbox/

## Parameters

### data

[`NormalizedData`](../../index/interfaces/NormalizedData.md)

### onEvent?

(`e`) => `void`

### opts?

[`ListboxOptions`](../interfaces/ListboxOptions.md) = `{}`

## Returns

`object`

### items

> **items**: [`BaseItem`](../interfaces/BaseItem.md)[]

### optionProps

> **optionProps**: (`id`) => [`ItemProps`](../type-aliases/ItemProps.md)

#### Parameters

##### id

`string`

#### Returns

[`ItemProps`](../type-aliases/ItemProps.md)

### rootProps

> **rootProps**: [`RootProps`](../type-aliases/RootProps.md)
