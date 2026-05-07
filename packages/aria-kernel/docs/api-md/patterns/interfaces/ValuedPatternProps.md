[**@p/aria-kernel v0.0.2**](../../README.md)

***

[@p/aria-kernel](../../modules.md) / [patterns](../README.md) / ValuedPatternProps

# Interface: ValuedPatternProps\<T\>

Defined in: [patterns/types.ts:37](https://github.com/developer-1px/interactive-os-3/blob/df2fd60ab01d60b9b40970c0425e92e7e2956ce8/packages/aria-kernel/src/patterns/types.ts#L37)

controlled value 를 가지는 패턴의 props base — 도메인 별 T 다름.
Radix·React Aria de facto: value + defaultValue + (single dispatch via onEvent).

 T = string         — combobox · textbox · spinbutton · single-select · radiogroup · tab
 T = string[]       — multi-select listbox · multi-select tree · treegrid multi
 T = number         — slider · progressbar · meter
 T = boolean        — switch · checkbox · disclosure
 T = [number, number] — range slider

value 주입   → controlled
value 미주입 → 패턴 내부 useState (defaultValue 시작값)

## Extends

- [`PatternProps`](PatternProps.md)

## Type Parameters

### T

`T`

## Properties

### aria-label?

> `optional` **aria-label?**: `string`

Defined in: [patterns/types.ts:20](https://github.com/developer-1px/interactive-os-3/blob/df2fd60ab01d60b9b40970c0425e92e7e2956ce8/packages/aria-kernel/src/patterns/types.ts#L20)

#### Inherited from

[`PatternProps`](PatternProps.md).[`aria-label`](PatternProps.md#aria-label)

***

### aria-labelledby?

> `optional` **aria-labelledby?**: `string`

Defined in: [patterns/types.ts:21](https://github.com/developer-1px/interactive-os-3/blob/df2fd60ab01d60b9b40970c0425e92e7e2956ce8/packages/aria-kernel/src/patterns/types.ts#L21)

#### Inherited from

[`PatternProps`](PatternProps.md).[`aria-labelledby`](PatternProps.md#aria-labelledby)

***

### data

> **data**: [`NormalizedData`](../../index/interfaces/NormalizedData.md)

Defined in: [patterns/types.ts:18](https://github.com/developer-1px/interactive-os-3/blob/df2fd60ab01d60b9b40970c0425e92e7e2956ce8/packages/aria-kernel/src/patterns/types.ts#L18)

#### Inherited from

[`PatternProps`](PatternProps.md).[`data`](PatternProps.md#data)

***

### defaultValue?

> `optional` **defaultValue?**: `T`

Defined in: [patterns/types.ts:39](https://github.com/developer-1px/interactive-os-3/blob/df2fd60ab01d60b9b40970c0425e92e7e2956ce8/packages/aria-kernel/src/patterns/types.ts#L39)

***

### onEvent

> **onEvent**: (`e`) => `void`

Defined in: [patterns/types.ts:19](https://github.com/developer-1px/interactive-os-3/blob/df2fd60ab01d60b9b40970c0425e92e7e2956ce8/packages/aria-kernel/src/patterns/types.ts#L19)

#### Parameters

##### e

[`UiEvent`](../../index/type-aliases/UiEvent.md)

#### Returns

`void`

#### Inherited from

[`PatternProps`](PatternProps.md).[`onEvent`](PatternProps.md#onevent)

***

### value?

> `optional` **value?**: `T`

Defined in: [patterns/types.ts:38](https://github.com/developer-1px/interactive-os-3/blob/df2fd60ab01d60b9b40970c0425e92e7e2956ce8/packages/aria-kernel/src/patterns/types.ts#L38)
