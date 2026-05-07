[**@p/aria-kernel v0.0.2**](../../README.md)

***

[@p/aria-kernel](../../modules.md) / [patterns](../README.md) / PatternProps

# Interface: PatternProps

Defined in: [patterns/types.ts:17](https://github.com/developer-1px/interactive-os-3/blob/df2fd60ab01d60b9b40970c0425e92e7e2956ce8/packages/aria-kernel/src/patterns/types.ts#L17)

Wrapper 의 표준 props base — 모든 컬렉션 wrapper 가 공유.
 data    : single data interface (NormalizedData)
 onEvent : single dispatch interface (모든 변화 통과)
 aria-label / aria-labelledby : accessible name (둘 중 하나 ARIA 강제)

wrapper-specific 옵션(slots/placeholder/orientation 등)은 extends 로 추가.

## Extended by

- [`ValuedPatternProps`](ValuedPatternProps.md)

## Properties

### aria-label?

> `optional` **aria-label?**: `string`

Defined in: [patterns/types.ts:20](https://github.com/developer-1px/interactive-os-3/blob/df2fd60ab01d60b9b40970c0425e92e7e2956ce8/packages/aria-kernel/src/patterns/types.ts#L20)

***

### aria-labelledby?

> `optional` **aria-labelledby?**: `string`

Defined in: [patterns/types.ts:21](https://github.com/developer-1px/interactive-os-3/blob/df2fd60ab01d60b9b40970c0425e92e7e2956ce8/packages/aria-kernel/src/patterns/types.ts#L21)

***

### data

> **data**: [`NormalizedData`](../../index/interfaces/NormalizedData.md)

Defined in: [patterns/types.ts:18](https://github.com/developer-1px/interactive-os-3/blob/df2fd60ab01d60b9b40970c0425e92e7e2956ce8/packages/aria-kernel/src/patterns/types.ts#L18)

***

### onEvent

> **onEvent**: (`e`) => `void`

Defined in: [patterns/types.ts:19](https://github.com/developer-1px/interactive-os-3/blob/df2fd60ab01d60b9b40970c0425e92e7e2956ce8/packages/aria-kernel/src/patterns/types.ts#L19)

#### Parameters

##### e

[`UiEvent`](../../index/type-aliases/UiEvent.md)

#### Returns

`void`
