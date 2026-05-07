[**@p/aria-kernel v0.0.2**](../../README.md)

***

[@p/aria-kernel](../../modules.md) / [patterns](../README.md) / DisclosureOptions

# Interface: DisclosureOptions

Defined in: [patterns/disclosure.ts:10](https://github.com/developer-1px/interactive-os-3/blob/df2fd60ab01d60b9b40970c0425e92e7e2956ce8/packages/aria-kernel/src/patterns/disclosure.ts#L10)

Options for [disclosurePattern](../functions/disclosurePattern.md).

## Properties

### idPrefix?

> `optional` **idPrefix?**: `string`

Defined in: [patterns/disclosure.ts:13](https://github.com/developer-1px/interactive-os-3/blob/df2fd60ab01d60b9b40970c0425e92e7e2956ce8/packages/aria-kernel/src/patterns/disclosure.ts#L13)

***

### onOpenChange?

> `optional` **onOpenChange?**: (`open`) => `void`

Defined in: [patterns/disclosure.ts:12](https://github.com/developer-1px/interactive-os-3/blob/df2fd60ab01d60b9b40970c0425e92e7e2956ce8/packages/aria-kernel/src/patterns/disclosure.ts#L12)

controlled fallback — host 가 onEvent reducer 로 EXPANDED 흡수 안 할 때 직접 받음.

#### Parameters

##### open

`boolean`

#### Returns

`void`
