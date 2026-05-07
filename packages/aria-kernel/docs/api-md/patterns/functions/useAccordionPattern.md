[**@p/aria-kernel v0.0.2**](../../README.md)

***

[@p/aria-kernel](../../modules.md) / [patterns](../README.md) / useAccordionPattern

# Function: useAccordionPattern()

> **useAccordionPattern**(`data`, `onEvent?`, `opts?`): `object`

Defined in: [patterns/accordion.ts:27](https://github.com/developer-1px/interactive-os-3/blob/df2fd60ab01d60b9b40970c0425e92e7e2956ce8/packages/aria-kernel/src/patterns/accordion.ts#L27)

accordion — APG `/accordion/` recipe.
https://www.w3.org/WAI/ARIA/apg/patterns/accordion/

`meta.expanded` 가 expanded 항목 SSoT. `single` mode 는 패턴이 형제 자동
collapse 를 emit. activate(click) → expand toggle.

## Parameters

### data

[`NormalizedData`](../../index/interfaces/NormalizedData.md)

### onEvent?

(`e`) => `void`

### opts?

[`AccordionOptions`](../interfaces/AccordionOptions.md) = `{}`

## Returns

`object`

### buttonProps

> **buttonProps**: (`id`) => [`ItemProps`](../type-aliases/ItemProps.md)

#### Parameters

##### id

`string`

#### Returns

[`ItemProps`](../type-aliases/ItemProps.md)

### headingProps

> **headingProps**: (`id`) => [`ItemProps`](../type-aliases/ItemProps.md)

#### Parameters

##### id

`string`

#### Returns

[`ItemProps`](../type-aliases/ItemProps.md)

### items

> **items**: [`BaseItem`](../interfaces/BaseItem.md) & `object`[]

### regionProps

> **regionProps**: (`id`) => [`ItemProps`](../type-aliases/ItemProps.md)

#### Parameters

##### id

`string`

#### Returns

[`ItemProps`](../type-aliases/ItemProps.md)

### rootProps

> **rootProps**: [`RootProps`](../type-aliases/RootProps.md)
