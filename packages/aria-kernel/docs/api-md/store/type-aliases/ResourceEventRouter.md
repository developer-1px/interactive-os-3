[**@p/aria-kernel v0.0.2**](../../README.md)

***

[@p/aria-kernel](../../modules.md) / [store](../README.md) / ResourceEventRouter

# Type Alias: ResourceEventRouter\<T\>

> **ResourceEventRouter**\<`T`\> = (`e`, `ctx`) => `T` \| `undefined`

Defined in: [store/data.ts:24](https://github.com/developer-1px/interactive-os-3/blob/df2fd60ab01d60b9b40970c0425e92e7e2956ce8/packages/aria-kernel/src/store/data.ts#L24)

ui/ UiEvent 를 받아 resource 의 다음 값으로 매핑하는 라우터 (undefined 면 무시).

## Type Parameters

### T

`T`

## Parameters

### e

[`UiEvent`](../../index/type-aliases/UiEvent.md)

### ctx

#### data

[`NormalizedData`](../../index/interfaces/NormalizedData.md)

#### value

`T` \| `undefined`

## Returns

`T` \| `undefined`
