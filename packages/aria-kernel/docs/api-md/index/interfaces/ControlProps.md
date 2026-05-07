[**@p/aria-kernel v0.0.2**](../../README.md)

***

[@p/aria-kernel](../../modules.md) / [index](../README.md) / ControlProps

# Interface: ControlProps

Defined in: [types.ts:104](https://github.com/developer-1px/interactive-os-3/blob/df2fd60ab01d60b9b40970c0425e92e7e2956ce8/packages/aria-kernel/src/types.ts#L104)

ControlProps — data + onEvent. 상호작용 컴포넌트의 공용 prop shape.

## Properties

### data

> **data**: [`NormalizedData`](NormalizedData.md)

Defined in: [types.ts:105](https://github.com/developer-1px/interactive-os-3/blob/df2fd60ab01d60b9b40970c0425e92e7e2956ce8/packages/aria-kernel/src/types.ts#L105)

***

### onEvent?

> `optional` **onEvent?**: (`e`) => `void`

Defined in: [types.ts:107](https://github.com/developer-1px/interactive-os-3/blob/df2fd60ab01d60b9b40970c0425e92e7e2956ce8/packages/aria-kernel/src/types.ts#L107)

상호작용 컴포넌트는 필수. Display-only Collection은 생략 가능.

#### Parameters

##### e

[`UiEvent`](../type-aliases/UiEvent.md)

#### Returns

`void`
