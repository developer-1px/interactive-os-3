[**@p/aria-kernel v0.0.2**](../../README.md)

***

[@p/aria-kernel](../../modules.md) / [patterns](../README.md) / useRadioGroupPattern

# Function: useRadioGroupPattern()

> **useRadioGroupPattern**(`data`, `onEvent?`, `opts?`): `object`

Defined in: [patterns/radioGroup.ts:39](https://github.com/developer-1px/interactive-os-3/blob/df2fd60ab01d60b9b40970c0425e92e7e2956ce8/packages/aria-kernel/src/patterns/radioGroup.ts#L39)

radioGroup — APG `/radio/` recipe.
https://www.w3.org/WAI/ARIA/apg/patterns/radio/

항상 selection-follows-focus (APG 강제). single-select.

## Parameters

### data

[`NormalizedData`](../../index/interfaces/NormalizedData.md)

### onEvent?

(`e`) => `void`

### opts?

[`RadioGroupOptions`](../interfaces/RadioGroupOptions.md) = `{}`

## Returns

`object`

### items

> **items**: [`BaseItem`](../interfaces/BaseItem.md)[]

### radioProps

> **radioProps**: (`id`) => [`ItemProps`](../type-aliases/ItemProps.md)

#### Parameters

##### id

`string`

#### Returns

[`ItemProps`](../type-aliases/ItemProps.md)

### rootProps

> **rootProps**: [`RootProps`](../type-aliases/RootProps.md)
